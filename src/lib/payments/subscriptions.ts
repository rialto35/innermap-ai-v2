import { supabaseAdmin } from '@/lib/supabase'

import type { SubscriptionUpsertInput } from './types'

export async function upsertSubscription(input: SubscriptionUpsertInput) {
  if (!input.providerSubId) {
    throw new Error('Subscription upsert requires providerSubId')
  }

  const upsertData = {
    user_id: input.userId,
    provider: input.provider,
    provider_sub_id: input.providerSubId,
    status: input.status,
    current_period_start: input.currentPeriodStart?.toISOString() || null,
    current_period_end: input.currentPeriodEnd?.toISOString() || null,
    cancel_at: input.cancelAt?.toISOString() || null,
    plan: input.plan,
    currency: input.currency,
    amount: input.amount ?? null,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(upsertData, { onConflict: 'provider,provider_sub_id' })

  if (error) {
    throw error
  }
}

export async function markWebhookHandled(provider: string, eventId: string): Promise<boolean> {
  if (!eventId) {
    return true
  }

  const { error } = await supabaseAdmin
    .from('webhook_events')
    .insert({ id: eventId, provider })

  if (error) {
    if (error.code === '23505') {
      return false
    }
    throw error
  }

  return true
}
