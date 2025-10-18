import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, source = '/pricing', notes } = body;

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'INVALID_EMAIL' }, { status: 400 });
    }

    const headersList = await headers();
    const referer = headersList.get('referer') ?? null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert into waitlist (duplicate emails will be ignored due to unique constraint)
    const { error } = await supabase.from('waitlist').insert({
      email,
      source_page: source,
      referer,
      notes: notes ?? null,
    });

    if (error && !/duplicate key|unique/i.test(error.message)) {
      console.error('Waitlist insert error:', error);
      return NextResponse.json({ ok: false, error: 'DB_ERROR' }, { status: 500 });
    }

    // Log event for analytics (best effort, don't fail if this fails)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || '';
      await fetch(`${baseUrl}/api/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'premium_waitlist_signup',
          payload: { email, source },
        }),
        cache: 'no-store',
      });
    } catch {
      // Silent fail on analytics
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ ok: false, error: 'UNKNOWN' }, { status: 500 });
  }
}

