/**
 * Client-side and server-side event logging utility
 * Sends events to /api/event for tracking user actions
 */

export async function logEvent(
  name: string,
  payload: Record<string, any> = {}
): Promise<void> {
  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ name, payload }),
    });
  } catch {
    // Silent fail - don't block user flow on analytics errors
  }
}

