/**
 * POST /api/payments/checkout
 * 
 * Stripe checkout session creation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { portoneAdapter } from '@/lib/payments/portoneAdapter'
import { stripeAdapter } from '@/lib/payments/stripeAdapter'
import type { CheckoutReq } from '@/lib/payments/types'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 })
  }

  const body = (await request.json()) as CheckoutReq
  if (!body.provider) {
    return NextResponse.json({ ok: false, error: 'UNKNOWN_PROVIDER' }, { status: 400 })
  }

  const provider = body.provider === 'portone' ? 'portone' : 'stripe'
  const adapter = provider === 'portone' ? portoneAdapter : stripeAdapter

  const userId = await resolveUserId(session.user.email)
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'USER_NOT_FOUND' }, { status: 400 })
  }

  const payload: CheckoutReq = {
    ...body,
    provider,
    userId,
  }

  const result = await adapter.checkout(payload)
  return NextResponse.json(result)
}

async function resolveUserId(email: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    console.error('Failed to resolve user id from Supabase:', error)
    return null
  }

  return data?.id ?? null
}

