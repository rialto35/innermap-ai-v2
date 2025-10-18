import { supabaseAdmin } from '@/lib/supabase'
import { flags } from '@/lib/flags'

interface PremiumUserRef {
  id?: string | null
  email: string
}

export async function assertPremium(user: PremiumUserRef) {
  if (!flags.payments_v2_guard) {
    return null
  }

  const userId = await resolveUserId(user)

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, cancel_at_period_end, updated_at, portal_url, receipt_url')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .gt('current_period_end', new Date().toISOString())
    .order('updated_at', { ascending: false })
    .maybeSingle()

  if (error || !data) {
    const err: any = new Error('FORBIDDEN_PREMIUM')
    err.code = 'FORBIDDEN_PREMIUM'
    throw err
  }

  return {
    status: data.status,
    current_period_end: data.current_period_end,
    cancel_at_period_end: data.cancel_at_period_end ?? false,
    updated_at: data.updated_at,
    portal_url: data.portal_url ?? null,
    receipt_url: data.receipt_url ?? null,
  }
}

async function resolveUserId(user: PremiumUserRef): Promise<string> {
  if (user.id) {
    return user.id
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', user.email)
    .maybeSingle()

  if (error || !data?.id) {
    const err: any = new Error('FORBIDDEN_PREMIUM')
    err.code = 'FORBIDDEN_PREMIUM'
    throw err
  }

  return data.id
}

