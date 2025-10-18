import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Simple in-memory rate limiter (per edge instance). For production, move to KV/DB.
const BUCKET: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000; // 1 min
const MAX_EVENTS_PER_WINDOW = 60; // per ip/session

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';
    const ua = req.headers.get('user-agent') || '';
    const key = createHash('sha256').update(`${ip}|${ua}`).digest('hex');

    const now = Date.now();
    const bucket = BUCKET[key];
    if (!bucket || now - bucket.ts > WINDOW_MS) {
      BUCKET[key] = { count: 1, ts: now };
    } else {
      bucket.count += 1;
      if (bucket.count > MAX_EVENTS_PER_WINDOW) {
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
      }
    }

    const body = await req.json().catch(() => ({} as any));
    // For MVP, just log to console. Future: insert into Supabase `events`.
    console.log('[event]', JSON.stringify({ ts: new Date().toISOString(), ...body }));
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}


