/**
 * POST /api/payments/checkout
 * 
 * Stripe checkout session creation
 */

import { NextRequest, NextResponse } from 'next/server'

import { portoneAdapter } from '@/lib/payments/portoneAdapter'
import { stripeAdapter } from '@/lib/payments/stripeAdapter'
import type { CheckoutReq } from '@/lib/payments/types'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CheckoutReq
  if (!body.provider) {
    return NextResponse.json({ ok: false, error: 'UNKNOWN_PROVIDER' }, { status: 400 })
  }
  const adapter = body.provider === 'portone' ? portoneAdapter : stripeAdapter
  const result = await adapter.checkout(body)
  return NextResponse.json(result)
}

