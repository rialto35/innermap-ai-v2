/**
 * POST /api/payments/webhook
 * 
 * Stripe webhook handler
 */

import { NextRequest, NextResponse } from 'next/server'

import { portoneAdapter } from '@/lib/payments/portoneAdapter'
import { stripeAdapter } from '@/lib/payments/stripeAdapter'

export async function POST(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('p')
  if (!provider) {
    return NextResponse.json({ ok: false, error: 'UNKNOWN_PROVIDER' }, { status: 400 })
  }
  const rawBody = await request.text()
  const signature =
    (provider === 'stripe'
      ? request.headers.get('stripe-signature')
      : request.headers.get('x-portone-signature')) || undefined

  const adapter = provider === 'portone' ? portoneAdapter : stripeAdapter

  const { ok } = await adapter.handleWebhook({ rawBody, signature })

  return NextResponse.json({ ok })
}

