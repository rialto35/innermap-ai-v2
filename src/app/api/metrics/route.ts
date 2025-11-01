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
      .select('assessment_id, mbti, big5, created_at')
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
    const adaptiveRows = arows.filter(r => !!(r?.raw_answers?.adaptive));
    const adaptiveCount = adaptiveRows.length;
    const adaptiveRate = total > 0 ? Math.round((adaptiveCount / total) * 1000) / 10 : 0;
    const avgDurationMs = adaptiveCount > 0
      ? Math.round(adaptiveRows.reduce((s, r) => s + (r?.raw_answers?.adaptive?.durationMs || 0), 0) / adaptiveCount)
      : 0;
    const avgItems = adaptiveCount > 0
      ? Math.round((adaptiveRows.reduce((s, r) => s + ((r?.raw_answers?.adaptive?.items?.length) || 0), 0) / adaptiveCount) * 10) / 10
      : 0;

    // Advanced metrics (requires self-reported MBTI in raw_answers)
    const assessMap: Record<string, any> = {};
    for (const a of arows) assessMap[(a as any).id] = a;

    const pairs = rows
      .map((r: any) => ({ r, a: assessMap[r.assessment_id as string] }))
      .filter((x) => !!x.a);

    const selfMbti = (a: any): string | null => {
      const raw = a?.raw_answers || {};
      const fromProfile = raw?.profile?.mbti;
      const flat = raw?.mbti || raw?.mbtiSelf || raw?.self_mbti;
      const t = (fromProfile || flat || '').toUpperCase();
      return /^[EI][SN][TF][JP]$/.test(t) ? t : null;
    };

    const labelPairs = pairs
      .map(({ r, a }) => ({ pred: (r.mbti as string) || null, self: selfMbti(a), big5: (r.big5 as any) || {} }))
      .filter((p) => p.pred && p.self);

    const mbtiTop1 = labelPairs.length
      ? Math.round((labelPairs.filter((p) => p.pred === p.self).length / labelPairs.length) * 1000) / 10
      : null;

    // axes AUC using self labels vs continuous axes from Big5
    const auc = (scores: number[], labels: number[]): number | null => {
      if (scores.length < 5) return null;
      const pts = scores.map((s, i) => ({ s, y: labels[i] }));
      pts.sort((a, b) => b.s - a.s);
      let tp = 0, fp = 0, tpPrev = 0, fpPrev = 0, aucSum = 0;
      const P = labels.reduce((s, y) => s + (y === 1 ? 1 : 0), 0);
      const N = labels.length - P;
      if (P === 0 || N === 0) return null;
      let lastS: number | null = null;
      for (const { s, y } of pts) {
        if (lastS !== null && s !== lastS) {
          aucSum += (fp - fpPrev) * (tp + tpPrev) / 2;
          fpPrev = fp; tpPrev = tp;
        }
        if (y === 1) tp++; else fp++;
        lastS = s;
      }
      aucSum += (fp - fpPrev) * (tp + tpPrev) / 2;
      const area = aucSum / (P * N);
      return Math.round(area * 1000) / 1000; // 0.000 precision
    };

    const axes = { EI: null as number | null, SN: null as number | null, TF: null as number | null, JP: null as number | null };
    if (labelPairs.length >= 5) {
      const EIs = labelPairs.map((p) => clamp(p.big5.E));
      const SNs = labelPairs.map((p) => clamp(100 - (p.big5.O ?? 0)));
      const TFs = labelPairs.map((p) => clamp(100 - (p.big5.A ?? 0)));
      const JPs = labelPairs.map((p) => clamp(p.big5.C));
      const labEI = labelPairs.map((p) => (p.self![0] === 'E' ? 1 : 0));
      const labSN = labelPairs.map((p) => (p.self![1] === 'S' ? 1 : 0));
      const labTF = labelPairs.map((p) => (p.self![2] === 'T' ? 1 : 0));
      const labJP = labelPairs.map((p) => (p.self![3] === 'J' ? 1 : 0));
      axes.EI = auc(EIs, labEI);
      axes.SN = auc(SNs, labSN);
      axes.TF = auc(TFs, labTF);
      axes.JP = auc(JPs, labJP);
    }

    return NextResponse.json({
      ok: true,
      total,
      boundaryRate, // percent
      distributions: { mbti: typeCounts, big5Mean: means },
      adaptive: { count: adaptiveCount, rate: adaptiveRate, avgDurationMs, avgItems },
      // Advanced metrics: computed when self-reported MBTI is available in raw_answers; otherwise null
      mbti: { top1: mbtiTop1, top2: null, axesAuc: axes },
      reti: { top1: null, top2: null },
      big5: { mae: null, r: null },
      inner9: { icc: null },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}


