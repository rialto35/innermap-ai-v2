import { createHmac } from 'crypto'
import { randomUUID } from 'crypto'

import type { PaymentsAdapter } from './adapter'
import type { CheckoutReq, CheckoutRes, Method } from './types'

interface PortOneConfig {
  baseUrl: string
  apiKey: string
  apiSecret: string
  channelKey: string
  successUrl: string
  cancelUrl: string
  webhookSecret?: string
}

interface PortOnePaymentResponse {
  message?: string
  response?: {
    checkoutUrl?: string
    redirectUrl?: string
    mobileRedirectUrl?: string
    extra?: {
      redirectUrl?: string
    }
  }
}

interface PortOneWebhookPayload {
  type?: string
  status?: string
  data?: {
    status?: string
    paymentId?: string
  }
}

interface PortOneWebhookEvent {
  rawBody: string
  signature?: string
}

const SUPPORTED_METHODS: Partial<Record<Method, string>> = {
  card: 'CARD',
  kakao: 'KAKAOPAY',
  naver: 'NAVERPAY',
  toss: 'TOSSPAY'
}

const SUCCESS_STATUSES = new Set(['paid', 'pay_completed', 'payment.succeeded'])

function getConfig(): PortOneConfig {
  const {
    PORTONE_API_BASE,
    PORTONE_API_KEY,
    PORTONE_API_SECRET,
    PORTONE_CHANNEL_KEY,
    PORTONE_SUCCESS_URL,
    PORTONE_CANCEL_URL,
    PORTONE_WEBHOOK_SECRET
  } = process.env

  if (!PORTONE_API_KEY || !PORTONE_API_SECRET || !PORTONE_CHANNEL_KEY) {
    throw new Error('PortOne environment is not configured. Missing key/secret/channel.')
  }

  if (!PORTONE_SUCCESS_URL || !PORTONE_CANCEL_URL) {
    throw new Error('PortOne redirect URLs are not configured.')
  }

  return {
    baseUrl: PORTONE_API_BASE || 'https://api.portone.io',
    apiKey: PORTONE_API_KEY,
    apiSecret: PORTONE_API_SECRET,
    channelKey: PORTONE_CHANNEL_KEY,
    successUrl: PORTONE_SUCCESS_URL,
    cancelUrl: PORTONE_CANCEL_URL,
    webhookSecret: PORTONE_WEBHOOK_SECRET
  }
}

function verifySignature(config: PortOneConfig & { webhookSecret?: string }, event: PortOneWebhookEvent): boolean {
  if (!config.webhookSecret) {
    throw new Error('PortOne webhook secret is not configured.')
  }
  if (!event.signature) {
    return false
  }

  const computed = createHmac('sha256', config.webhookSecret).update(event.rawBody).digest('hex')
  return computed === event.signature
}

function resolveOrderName(plan?: CheckoutReq['plan']): string {
  if (!plan || plan === 'free') {
    return 'InnerMap Standard Checkout'
  }

  const label: Record<Exclude<CheckoutReq['plan'], undefined>, string> = {
    free: 'InnerMap Free Checkout',
    premium: 'InnerMap Premium Plan',
    pro: 'InnerMap Pro Plan'
  }

  return label[plan]
}

function ensureMethod(method: Method, currency: CheckoutReq['currency']): string {
  const mapped = SUPPORTED_METHODS[method]
  if (!mapped) {
    throw new Error(`PortOne does not support payment method "${method}".`)
  }

  if (currency !== 'KRW') {
    throw new Error('PortOne payment requires KRW currency.')
  }

  return mapped
}

async function callPortOne<T>(config: PortOneConfig, path: string, payload: unknown): Promise<T> {
  const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const json = (await response.json().catch(() => null)) as T | null

  if (!response.ok) {
    const reason = (json as { message?: string } | null)?.message || response.statusText
    throw new Error(`PortOne API error: ${reason}`)
  }

  if (!json) {
    throw new Error('PortOne API returned empty response.')
  }

  return json
}

export const portoneAdapter: PaymentsAdapter = {
  async checkout(req: CheckoutReq): Promise<CheckoutRes> {
    const config = getConfig()
    const method = ensureMethod(req.method, req.currency)

    const paymentId = `pt_${randomUUID()}`
    const orderName = resolveOrderName(req.plan)

    const payload = {
      channelKey: config.channelKey,
      paymentId,
      orderName,
      amount: {
        currency: req.currency,
        total: req.amount
      },
      customer: {
        id: req.userId
      },
      payMethod: method,
      redirect: {
        successUrl: config.successUrl,
        failUrl: config.cancelUrl
      }
    }

    const data = await callPortOne<PortOnePaymentResponse>(config, '/payments', payload)

    const redirectUrl =
      data.response?.checkoutUrl ||
      data.response?.redirectUrl ||
      data.response?.mobileRedirectUrl ||
      data.response?.extra?.redirectUrl

    if (!redirectUrl) {
      throw new Error('PortOne checkout response did not include redirect URL.')
    }

    return { ok: true, redirectUrl }
  },

  async handleWebhook(event: unknown): Promise<{ ok: boolean }> {
    const config = getConfig()
    const parsedEvent = event as PortOneWebhookEvent | undefined
    if (!parsedEvent || !parsedEvent.rawBody) {
      return { ok: false }
    }

    if (!verifySignature(config, parsedEvent)) {
      return { ok: false }
    }

    const payload: PortOneWebhookPayload | null = (() => {
      try {
        return JSON.parse(parsedEvent.rawBody) as PortOneWebhookPayload
      } catch {
        return null
      }
    })()

    if (!payload) {
      return { ok: false }
    }

    const status = payload.data?.status || payload.status || payload.type
    const normalized = typeof status === 'string' ? status.toLowerCase() : undefined

    if (normalized && SUCCESS_STATUSES.has(normalized)) {
      return { ok: true }
    }

    return { ok: false }
  }
}
