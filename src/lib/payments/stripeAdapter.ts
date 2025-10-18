import Stripe from 'stripe'

import type { PaymentsAdapter } from './adapter'
import type { CheckoutReq, CheckoutRes } from './types'

interface StripeConfig {
  secretKey: string
  priceKrw: string
  priceUsd: string
  successUrl: string
  cancelUrl: string
}

interface SubscriptionMeta {
  status: string
  currentPeriodEnd?: number
  cancelAt?: number | null
}

const stripeInstances = new Map<string, Stripe>()

function getConfig(): StripeConfig {
  const {
    STRIPE_SECRET_KEY,
    STRIPE_PRICE_PREMIUM_KRW,
    STRIPE_PRICE_PREMIUM_USD,
    STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL
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
    cancelUrl: STRIPE_CANCEL_URL
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

function normalizeStatus(subscription?: Stripe.Subscription | null): SubscriptionMeta {
  if (!subscription) {
    return { status: 'unknown' }
  }

  return {
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
    cancelAt: subscription.cancel_at
  }
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

  async handleWebhook(event: unknown): Promise<{ ok: boolean }> {
    const stripeEvent = event as Stripe.Event | undefined
    if (!stripeEvent) {
      return { ok: false }
    }

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription
        if (!subscriptionId || typeof subscriptionId !== 'string') {
          return { ok: false }
        }
        return { ok: true }
      }
      case 'invoice.paid':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        const meta = normalizeStatus(subscription)
        return { ok: meta.status === 'active' || meta.status === 'trialing' }
      }
      case 'invoice.payment_failed':
        return { ok: false }
      default:
        return { ok: true }
    }
  }
}
