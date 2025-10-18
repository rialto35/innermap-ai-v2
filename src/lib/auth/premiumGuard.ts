import { supabaseAdmin } from '@/lib/supabase'

export async function assertPremium(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end, cancel_at_period_end')
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
  }
}

