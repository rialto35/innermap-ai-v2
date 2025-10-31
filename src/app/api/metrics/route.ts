/**
 * Metrics API (READ-ONLY)
 * - Lightweight summary for accuracy pipeline bootstrap
 * - Computes boundaryRate from stored Big5 in recent results
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type Big5 = { O?: number; C?: number; E?: number; A?: number; N?: number };

function computeBoundaryRate(rows: Array<{ big5: Big5 }>): number {
  if (!rows?.length) return 0;
  let boundaryCount = 0;
  for (const r of rows) {
    const b5 = r.big5 || {};
    const E = clamp(b5.E);
    const SN = clamp(100 - (b5.O ?? 0));
    const TF = clamp(100 - (b5.A ?? 0));
    const JP = clamp(b5.C);
    const boundary = [E, SN, TF, JP].some((v) => v >= 45 && v <= 55);
    if (boundary) boundaryCount += 1;
  }
  return Math.round((boundaryCount / rows.length) * 1000) / 10; // percent with 0.1 precision
}

function clamp(v?: number): number {
  const n = typeof v === 'number' ? v : 0;
  return Math.max(0, Math.min(100, n));
}

export async function GET() {
  try {
    // Fetch recent results (limited) to keep it light
    const { data, error } = await supabaseAdmin
      .from('test_assessment_results')
      .select('mbti, big5, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ ok: false, error: 'DB_ERROR' }, { status: 500 });
    }

    const total = data?.length ?? 0;
    const boundaryRate = computeBoundaryRate((data as any[])?.map((d) => ({ big5: (d as any).big5 })) ?? []);

    return NextResponse.json({
      ok: true,
      total,
      boundaryRate, // percent
      // Placeholders for future: top1/top2/auc/mae/icc once gold labels & pipelines are ready
      mbti: { top1: null, top2: null, axesAuc: null },
      reti: { top1: null, top2: null },
      big5: { mae: null, r: null },
      inner9: { icc: null },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}


