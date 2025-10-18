/**
 * Daily Luck API
 * @route GET /api/luck?dob=YYYY-MM-DD
 */

import { NextResponse } from 'next/server';
import { calcDailyLuck } from '@/core/im-core/luck';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dob = searchParams.get('dob');

    if (!dob) {
      return NextResponse.json({ ok: false, error: 'MISSING_DOB' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return NextResponse.json({ ok: false, error: 'INVALID_DOB_FORMAT' }, { status: 400 });
    }

    const luck = calcDailyLuck(dob);

    return NextResponse.json({ ok: true, data: luck });
  } catch (e: any) {
    console.error('Luck calculation error:', e);
    return NextResponse.json(
      { ok: false, error: 'ENGINE_ERROR', detail: e?.message },
      { status: 500 }
    );
  }
}

