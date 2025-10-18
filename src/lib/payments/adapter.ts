import { CheckoutReq, CheckoutRes } from './types'

export interface PaymentsAdapter {
  checkout(req: CheckoutReq): Promise<CheckoutRes>
  handleWebhook(event: unknown): Promise<{ ok: boolean }>
}
