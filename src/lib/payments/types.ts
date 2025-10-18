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
