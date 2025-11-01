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
    const rows = (data as any[]) || [];
    const boundaryRate = computeBoundaryRate(rows.map((d) => ({ big5: (d as any).big5 })) ?? []);

    // MBTI type counts (simple distribution)
    const typeCounts: Record<string, number> = {};
    for (const r of rows) {
      const t = (r as any)?.mbti;
      if (typeof t === 'string' && /^[EI][SN][TF][JP]$/.test(t)) {
        typeCounts[t] = (typeCounts[t] ?? 0) + 1;
      }
    }

    // Big5 basic stats (mean)
    const means = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    let mcount = 0;
    for (const r of rows) {
      const b5 = (r as any).big5 || {};
      if (typeof b5.O === 'number') {
        means.O += b5.O || 0; means.C += b5.C || 0; means.E += b5.E || 0; means.A += b5.A || 0; means.N += b5.N || 0;
        mcount += 1;
      }
    }
    if (mcount > 0) {
      means.O = Math.round((means.O / mcount) * 10) / 10;
      means.C = Math.round((means.C / mcount) * 10) / 10;
      means.E = Math.round((means.E / mcount) * 10) / 10;
      means.A = Math.round((means.A / mcount) * 10) / 10;
      means.N = Math.round((means.N / mcount) * 10) / 10;
    }

    // Adaptive adoption (recent): count assessments with raw_answers.adaptive
    const { data: assess, error: assessErr } = await supabaseAdmin
      .from('test_assessments')
      .select('id, raw_answers')
      .order('created_at', { ascending: false })
      .limit(200);
    const arows = (assess as any[]) || [];
    const adaptiveCount = arows.filter(r => !!(r?.raw_answers?.adaptive)).length;
    const adaptiveRate = total > 0 ? Math.round((adaptiveCount / total) * 1000) / 10 : 0;

    return NextResponse.json({
      ok: true,
      total,
      boundaryRate, // percent
      distributions: { mbti: typeCounts, big5Mean: means },
      adaptive: { count: adaptiveCount, rate: adaptiveRate },
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


