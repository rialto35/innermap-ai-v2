import type { PaymentsAdapter } from './adapter'
import type { CheckoutReq, CheckoutRes } from './types'

export const stripeAdapter: PaymentsAdapter = {
  async checkout(_req: CheckoutReq): Promise<CheckoutRes> {
    return { ok: true }
  },

  async handleWebhook(_event: unknown): Promise<{ ok: boolean }> {
    return { ok: true }
  },
}
