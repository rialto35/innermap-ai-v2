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

  const userId = await resolveOrCreateUserId(session.user.email, session.user.name || undefined)
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'USER_NOT_FOUND' }, { status: 400 })
  }

  const payload: CheckoutReq = {
    ...body,
    provider,
    userId,
  }

  try {
    const result = await adapter.checkout(payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Checkout failed:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'CHECKOUT_FAILED',
      },
      { status: 500 }
    )
  }
}

async function resolveOrCreateUserId(email: string, name?: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    console.error('Failed to resolve user id from Supabase:', error)
    return null
  }

  if (data?.id) {
    return data.id
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('users')
    .insert({ email, name: name || null, provider: 'credentials', provider_id: email })
    .select('id')
    .single()

  if (insertError) {
    console.error('Failed to insert user into Supabase:', insertError)
    return null
  }

  return inserted?.id ?? null
}

