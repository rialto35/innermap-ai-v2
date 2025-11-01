import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const assessmentId: string | undefined = body?.assessmentId;
    const items: Array<{ id: string; value: number }> = Array.isArray(body?.items) ? body.items : [];
    const durationMs: number | undefined = typeof body?.durationMs === 'number' ? body.durationMs : undefined;

    if (!assessmentId || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    // Fetch existing raw_answers
    const { data: row, error: fetchErr } = await supabaseAdmin
      .from('test_assessments')
      .select('id, raw_answers')
      .eq('id', assessmentId)
      .maybeSingle();
    if (fetchErr || !row) {
      return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 });
    }

    const merged = { ...(row.raw_answers || {}), adaptive: { items, durationMs, ts: new Date().toISOString() } };

    const { error: upErr } = await supabaseAdmin
      .from('test_assessments')
      .update({ raw_answers: merged })
      .eq('id', assessmentId);
    if (upErr) {
      return NextResponse.json({ ok: false, error: 'UPDATE_FAILED' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}


