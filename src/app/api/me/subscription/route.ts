import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle()

  if (userError || !user?.id) {
    return NextResponse.json({ ok: false, error: 'USER_NOT_FOUND' }, { status: 404 })
  }

  const { data: subscription, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, cancel_at_period_end, updated_at')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'unpaid'])
    .order('updated_at', { ascending: false })
    .maybeSingle()

  if (subError) {
    if (subError.code === 'PGRST205') {
      console.log('Subscriptions table not found, returning null subscription');
      return NextResponse.json(
        { ok: true, data: null },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }
    console.error('Subscription query error:', subError);
    return NextResponse.json({ ok: false, error: 'FAILED_SUBSCRIPTION_QUERY' }, { status: 500 })
  }

  return NextResponse.json(
    {
      ok: true,
      data: subscription
        ? {
            status: subscription.status,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
          }
        : null,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
