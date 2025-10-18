interface EventPayload {
  name: string
  payload?: Record<string, unknown>
}

const eventEndpoint = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ''

export async function logEvent(name: string, payload?: Record<string, unknown>) {
  const body: EventPayload = { name, payload }

  try {
    if (typeof window !== 'undefined') {
      await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else if (eventEndpoint) {
      await fetch(`${eventEndpoint.replace(/\/$/, '')}/api/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
  } catch (error) {
    console.error('[logEvent] failed:', error)
  }
}

