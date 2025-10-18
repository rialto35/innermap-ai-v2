import { useEffect, useState } from 'react'

type SubscriptionData = {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid'
  current_period_end?: string | null
  cancel_at_period_end?: boolean
  portal_url?: string | null
  receipt_url?: string | null
} | null

type SubscriptionState = {
  data: SubscriptionData
  loading: boolean
  error?: string
  premium: boolean
  pastDue: boolean
}

export function usePremiumSubscription(): SubscriptionState {
  const [data, setData] = useState<SubscriptionData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/me/subscription', { cache: 'no-store' })
        const json = await res.json()
        if (!json.ok) {
          throw new Error(json.error || 'FAILED_SUBSCRIPTION_QUERY')
        }
        if (alive) {
          setData(json.data)
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : 'UNKNOWN_ERROR')
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  const premium = Boolean(data && ['active', 'trialing'].includes(data.status))
  const pastDue = data?.status === 'past_due'

  return {
    data,
    loading,
    error,
    premium,
    pastDue,
  }
}
