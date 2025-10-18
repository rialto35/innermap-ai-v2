import Stripe from 'stripe'

import type { PaymentsAdapter } from './adapter'
import type { CheckoutReq, CheckoutRes, WebhookPayload } from './types'
import { upsertSubscription, markWebhookHandled } from './subscriptions'

interface StripeConfig {
  secretKey: string
  priceKrw: string
  priceUsd: string
  successUrl: string
  cancelUrl: string
  webhookSecret?: string
}

const stripeInstances = new Map<string, Stripe>()

function getConfig(): StripeConfig {
  const {
    STRIPE_SECRET_KEY,
    STRIPE_PRICE_PREMIUM_KRW,
    STRIPE_PRICE_PREMIUM_USD,
    STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL,
    STRIPE_WEBHOOK_SECRET
  } = process.env

  if (!STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured.')
  }

  if (!STRIPE_PRICE_PREMIUM_KRW || !STRIPE_PRICE_PREMIUM_USD) {
    throw new Error('Stripe price IDs are not configured.')
  }

  if (!STRIPE_SUCCESS_URL || !STRIPE_CANCEL_URL) {
    throw new Error('Stripe redirect URLs are not configured.')
  }

  return {
    secretKey: STRIPE_SECRET_KEY,
    priceKrw: STRIPE_PRICE_PREMIUM_KRW,
    priceUsd: STRIPE_PRICE_PREMIUM_USD,
    successUrl: STRIPE_SUCCESS_URL,
    cancelUrl: STRIPE_CANCEL_URL,
    webhookSecret: STRIPE_WEBHOOK_SECRET
  }
}

function getStripe(secretKey: string): Stripe {
  if (stripeInstances.has(secretKey)) {
    return stripeInstances.get(secretKey) as Stripe
  }

  const instance = new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'InnerMap AI',
      url: 'https://innermap.ai'
    }
  })

  stripeInstances.set(secretKey, instance)
  return instance
}

function resolvePriceId(currency: CheckoutReq['currency'], config: StripeConfig): string {
  if (currency === 'KRW') {
    return config.priceKrw
  }
  if (currency === 'USD') {
    return config.priceUsd
  }
  throw new Error(`Unsupported currency for Stripe checkout: ${currency}`)
}

function buildIdempotencyKey(userId: string, plan: CheckoutReq['plan']): string {
  const normalizedPlan = plan || 'free'
  return `checkout:${userId}:${normalizedPlan}`
}

function buildMetadata(req: CheckoutReq): Stripe.MetadataParam {
  const metadata: Stripe.MetadataParam = {
    provider: 'stripe',
    userId: req.userId,
    method: req.method,
    currency: req.currency,
    plan: req.plan || 'free'
  }
  return metadata
}

export const stripeAdapter: PaymentsAdapter = {
  async checkout(req: CheckoutReq): Promise<CheckoutRes> {
    const config = getConfig()
    const stripe = getStripe(config.secretKey)
    const priceId = resolvePriceId(req.currency, config)

    const metadata = buildMetadata(req)

    const session = await stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        success_url: config.successUrl,
        cancel_url: config.cancelUrl,
        customer_creation: 'always',
        client_reference_id: req.userId,
        payment_method_types: ['card'],
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        subscription_data: {
          metadata
        },
        metadata
      },
      {
        idempotencyKey: buildIdempotencyKey(req.userId, req.plan)
      }
    )

    return {
      ok: true,
      redirectUrl: session.url || undefined,
      clientSecret: session.client_secret || undefined
    }
  },

  async handleWebhook(event: WebhookPayload): Promise<{ ok: boolean }> {
    const config = getConfig()
    if (!config.webhookSecret) {
      throw new Error('Stripe webhook secret is not configured.')
    }

    if (!event?.rawBody || !event.signature) {
      return { ok: false }
    }

    const stripe = getStripe(config.secretKey)

    try {
      const constructed = stripe.webhooks.constructEvent(event.rawBody, event.signature, config.webhookSecret)

      const isFirstDelivery = await markWebhookHandled('stripe', constructed.id)
      if (!isFirstDelivery) {
        return { ok: true }
      }

      return await handleStripeEvent(stripe, constructed)
    } catch (error) {
      console.error('Stripe webhook validation failed:', error)
      return { ok: false }
    }
  }
}

async function handleStripeEvent(stripe: Stripe, event: Stripe.Event): Promise<{ ok: boolean }> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (!session.subscription || typeof session.subscription !== 'string') {
        return { ok: false }
      }

      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      await upsertStripeSubscription(session.client_reference_id, subscription)
      return { ok: true }
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = (subscription.metadata?.userId || subscription.metadata?.user_id || null) as string | null
      await upsertStripeSubscription(userId, subscription)
      return { ok: true }
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription && typeof invoice.subscription === 'string') {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        await upsertStripeSubscription((invoice.metadata?.userId as string | undefined) || invoice.customer?.toString() || null, subscription)
      }
      return { ok: true }
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription && typeof invoice.subscription === 'string') {
        await upsertSubscription({
          userId: (invoice.metadata?.userId as string | undefined) || null,
          provider: 'stripe',
          providerSubId: invoice.subscription,
          status: 'past_due'
        })
      }
      return { ok: false }
    }
    default:
      return { ok: true }
  }
}

async function upsertStripeSubscription(userId: string | null | undefined, subscription: Stripe.Subscription) {
  const firstItem = subscription.items?.data?.[0]
  const plan = firstItem?.plan

  await upsertSubscription({
    userId: userId || (subscription.metadata?.userId as string | undefined) || null,
    provider: 'stripe',
    providerSubId: subscription.id,
    status: subscription.status,
    currentPeriodStart: fromUnix(subscription.current_period_start),
    currentPeriodEnd: fromUnix(subscription.current_period_end),
    plan: (plan?.nickname as string | undefined) || (plan?.metadata?.plan as string | undefined) || 'premium',
    currency: plan?.currency?.toUpperCase(),
    amount:
      plan?.amount ?? (plan?.amount_decimal !== undefined ? Number(plan.amount_decimal) : undefined),
    cancelAt: fromUnix(subscription.cancel_at ?? undefined)
  })
}

function fromUnix(value?: number | null): Date | undefined {
  if (!value) return undefined
  return new Date(value * 1000)
}
