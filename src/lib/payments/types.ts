export type Provider = 'portone' | 'stripe'

export type Method =
  | 'card'
  | 'kakao'
  | 'naver'
  | 'toss'
  | 'paypal'
  | 'apple'
  | 'google'

export interface CheckoutReq {
  provider: Provider
  method: Method
  amount: number
  currency: 'KRW' | 'USD'
  userId: string
  plan?: 'free' | 'premium' | 'pro'
}

export interface CheckoutRes {
  ok: boolean
  redirectUrl?: string
  clientSecret?: string
}

export interface WebhookPayload {
  rawBody: string
  signature?: string
}

export interface SubscriptionUpsertInput {
  userId: string | null
  provider: Provider
  providerSubId: string
  status: string
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAt?: Date
  plan?: string
  currency?: string
  amount?: number
}
