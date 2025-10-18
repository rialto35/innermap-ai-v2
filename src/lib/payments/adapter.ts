import type { CheckoutReq, CheckoutRes, WebhookPayload } from './types'

export interface PaymentsAdapter {
  checkout(req: CheckoutReq): Promise<CheckoutRes>
  handleWebhook(event: WebhookPayload): Promise<{ ok: boolean }>
}
