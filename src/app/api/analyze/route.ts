/**
 * Inner9 Analysis API
 * @route POST /api/analyze
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { runAnalysis } from '@/core/im-core';
import { Inner9Schema } from '@/lib/schemas/inner9';
import { getInner9Config } from '@/config/inner9';
import { wrapAsReportV1 } from '@/core/im-core/orchestrator';
import { ReportV1 } from '@/types/report';
// import type { AnalyzeInput } from '@/core/im-core/types';
import { 
  computeBig5Percentiles, 
  computeMBTIRatios, 
  generateAnalysisText 
} from '@/lib/psychometrics';
import { getFlags } from '@/lib/flags';
import { getBig5Mapping } from '@/core/im-core/big5.config';
import { computeInner9 as computeInner9V2 } from '@/core/im-core-v2/inner9';
import { promises as fs } from 'fs';
import path from 'path';
import { fuseMbti } from '@/lib/engine/fusion';
import mbtiBoundary from '@/data/adaptive/mbti_boundary.json';

// MBTI 연속 축 및 확신도 계산 (Phase 0: 서버 응답에만 노출)
function computeMbtiConfidenceFromBig5(b5: { O: number; C: number; E: number; A: number; N: number }) {
  // 0~100 스케일 가정
  const axes = {
    EI: Math.max(0, Math.min(100, b5.E)),
    SN: Math.max(0, Math.min(100, 100 - b5.O)),
    TF: Math.max(0, Math.min(100, 100 - b5.A)),
    JP: Math.max(0, Math.min(100, b5.C)),
  };
  const boundary = Object.values(axes).some((v) => v >= 45 && v <= 55);
  const perAxisConfidence = Object.values(axes).map((v) => Math.abs(v - 50) / 50);
  const confidence = Math.round((perAxisConfidence.reduce((a, b) => a + b, 0) / perAxisConfidence.length) * 100);
  return { axes, boundary, confidence };
}

// MBTI 경계 보호 분류(섀도런용) — EI/SN/TF/JP 축을 기반으로 이진 분류 + 경계 플래그
function classifyMbtiFromBig5(b5: { O: number; C: number; E: number; A: number; N: number }) {
  const axes = {
    EI: Math.max(0, Math.min(100, b5.E)),
    SN: Math.max(0, Math.min(100, 100 - b5.O)),
    TF: Math.max(0, Math.min(100, 100 - b5.A)),
    JP: Math.max(0, Math.min(100, b5.C)),
  };
  const boundary = Object.values(axes).some((v) => v >= 47 && v <= 53);
  const type = `${axes.EI >= 50 ? 'E' : 'I'}${axes.SN >= 50 ? 'S' : 'N'}${axes.TF >= 50 ? 'T' : 'F'}${axes.JP >= 50 ? 'J' : 'P'}`;
  return { type, axes, boundary };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    const body = (await req.json()) as any;
    
    console.log('📊 [API /analyze] Request body:', JSON.stringify(body, null, 2));
    
    if (!body?.big5) {
      console.log('❌ [API /analyze] Missing big5 data');
      return NextResponse.json({ ok: false, error: 'MISSING_BIG5' }, { status: 400 });
    }

    // 최소 검증
    const { O, C, E, A, N } = body.big5 as any;
    console.log('📊 [API /analyze] Big5 values:', { O, C, E, A, N });
    
    if ([O, C, E, A, N].some((v) => typeof v !== 'number')) {
      console.log('❌ [API /analyze] Invalid Big5 values - not all numbers');
      return NextResponse.json({ ok: false, error: 'INVALID_BIG5' }, { status: 400 });
    }

    console.log('📊 [API /analyze] Calling runAnalysis with:', {
      big5: { O: O / 100, C: C / 100, E: E / 100, A: A / 100, N: N / 100 },
      mbti: body.mbti,
      reti: body.reti,
      dob: body.dob,
      locale: body.locale ?? 'ko-KR',
      age: body.age ?? 30,
      gender: body.gender ?? 'male',
    });

    const out = await runAnalysis({
      big5: { O: O / 100, C: C / 100, E: E / 100, A: A / 100, N: N / 100 },
      mbti: body.mbti,
      reti: body.reti,
      dob: body.dob,
      locale: body.locale ?? 'ko-KR',
      age: body.age ?? 30, // 기본값 설정
      gender: body.gender ?? 'male', // 기본값 설정
    });
    
    console.log('✅ [API /analyze] runAnalysis completed successfully');

    // Compute deep analysis metrics
    console.log('📊 [API /analyze] Computing deep analysis metrics...');
    const big5Percentiles = computeBig5Percentiles({ O: O / 100, C: C / 100, E: E / 100, A: A / 100, N: N / 100 });
    const mbtiRatios = body.mbti ? computeMBTIRatios(body.mbti) : { EI: 50, SN: 50, TF: 50, JP: 50 };
    
    // Phase 0: MBTI 확신도(연속 축 기반) 계산 — 플래그 기본 OFF, 서버 응답에만 포함
    const flags = getFlags();
    const mapping = getBig5Mapping();
    const mbtiConfidence = (flags.confidenceBadge || flags.engineV2)
      ? computeMbtiConfidenceFromBig5({ O, C, E, A, N })
      : null;
    const mbtiV2 = flags.engineV2 ? classifyMbtiFromBig5({ O, C, E, A, N }) : null;
    const mbtiStable = (() => {
      if (!flags.engineV2 || !mbtiV2) return null;
      // 경계 구간이면 기존 MBTI 유지, 아니면 V2 타입 제안
      const current = (body.mbti as string) || null;
      if (mbtiV2.boundary && current) return { type: current, from: 'boundary-protect' };
      return { type: mbtiV2.type, from: 'v2' };
    })();
    const engineDebug = (flags.engineV2 || flags.verboseLog)
      ? {
          mappingVersion: mapping.version,
          reverseCounts: {
            O: mapping.O.reverse.length,
            C: mapping.C.reverse.length,
            E: mapping.E.reverse.length,
            A: mapping.A.reverse.length,
            N: mapping.N.reverse.length,
          },
          weightCounts: {
            O: mapping.O.weights.length,
            C: mapping.C.weights.length,
            E: mapping.E.weights.length,
            A: mapping.A.weights.length,
            N: mapping.N.weights.length,
          },
        }
      : null;

    // Late-fusion (shadow-run, debug only) — no behavior change
    const fusionDebug = (() => {
      if (!flags.fusionV1) return null;
      try {
        const fusion = fuseMbti({
          big5: { O, C, E, A, N },
          mbtiSelf: body.mbti as string,
          mbtiPred: (mbtiStable?.type ?? mbtiV2?.type ?? body.mbti) as string,
          boundary: !!mbtiConfidence?.boundary,
        });
        return fusion;
      } catch {
        return null;
      }
    })();

    // Mini-adaptive hint (boundary only, flag-guarded) — no client enforcement
    const adaptiveHint = (() => {
      if (!flags.miniAdaptive) return null;
      if (!mbtiConfidence?.boundary) return null;
      try {
        const items = (mbtiBoundary as any)?.items || [];
        // Provide a minimal subset (2 items) to keep payload light
        return { type: 'mbti', items: items.slice(0, 2) };
      } catch {
        return null;
      }
    })();
    
    // Enhanced Inner9 calculation with type weighting
    const config = getInner9Config();
    const analysisResult = await runAnalysis({
      big5: { O, C, E, A, N }, // 대문자 키 사용, 0~100 범위 그대로 전달
      mbti: body.mbti as string,
      reti: body.reti as number,
      weights: config.useTypeWeights ? { big5: 1, mbti: 0.5, reti: 0.5 } : { big5: 1, mbti: 0, reti: 0 }
    });
    
    const inner9Scores = analysisResult.inner9;
    
    // NaN 값 처리 - 기본값으로 대체
    const sanitizedInner9 = Object.fromEntries(
      Object.entries(inner9Scores).map(([key, value]) => [
        key, 
        typeof value === 'number' && !isNaN(value) ? value : 0.5
      ])
    );
    
    console.log('🔍 [API /analyze] Original Inner9:', inner9Scores);
    console.log('🔍 [API /analyze] Sanitized Inner9:', sanitizedInner9);

    // Shadow-run logging for ENGINE_V2 (no behavior change)
    if (flags.engineV2) {
      try {
        const baseInner9Raw: any = (out as any)?.inner9 || {};
        const baseInner9: Record<string, number> = Object.fromEntries(
          Object.entries(baseInner9Raw).map(([k, v]) => {
            const num = Number(v);
            // if baseline looks like 0..1, scale to 0..100 for fair diff
            const scaled = num <= 1 ? num * 100 : num;
            return [k, Math.round(scaled * 100) / 100];
          })
        );

        const deltas: Record<string, number> = {};
        Object.keys(sanitizedInner9).forEach((k) => {
          const a = Number((sanitizedInner9 as any)[k] ?? 0);
          const b = Number(baseInner9[k] ?? 0);
          deltas[k] = Math.round((a - b) * 100) / 100;
        });

        const vals = Object.values(sanitizedInner9) as number[];
        const avg = vals.length ? vals.reduce((s, x) => s + x, 0) / vals.length : 0;
        const min = Math.min(...vals);
        const max = Math.max(...vals);

        console.info('[ENGINE_V2][shadow] mbtiConfidence:', mbtiConfidence);
        console.info('[ENGINE_V2][shadow] baseInner9(0-100):', baseInner9);
        console.info('[ENGINE_V2][shadow] v2Inner9(sanitized):', sanitizedInner9);
        console.info('[ENGINE_V2][shadow] delta(v2 - base):', deltas);
        console.info('[ENGINE_V2][shadow] summary:', { avg: Math.round(avg * 100) / 100, min, max });
        if (mbtiV2) {
          console.info('[ENGINE_V2][shadow] mbtiV2:', mbtiV2);
        }

        // v2.2: compute Inner9 nonlinear interaction (shadow) from Big5
        try {
          if (process.env.IM_INNER9_NONLINEAR_ENABLED === 'true' || flags.inner9Nonlinear) {
            const shadowInner9 = computeInner9V2({ O, C, E, A, N });
            const growthDelta = Math.round(((shadowInner9.growth - (sanitizedInner9 as any)?.growth) + Number.EPSILON) * 10) / 10;
            console.info('[ENGINE_V2][shadow] inner9.v2_2:', shadowInner9, 'growthΔ', growthDelta);

            // Persist shadow log under /logs/engine_v2/
            const dir = path.join(process.cwd(), 'logs', 'engine_v2');
            await fs.mkdir(dir, { recursive: true });
            const file = path.join(dir, `${new Date().toISOString().slice(0,10)}.log`);
            const entry = {
              ts: new Date().toISOString(),
              engine_version: 'v2.2',
              user: session?.user?.email ?? null,
              big5: { O, C, E, A, N },
              mbti: { legacy: body.mbti, v2: mbtiV2?.type ?? null, confidence: mbtiConfidence?.confidence ?? null },
              inner9: { legacy: sanitizedInner9, v2_2: shadowInner9, growthDelta },
            };
            await fs.appendFile(file, JSON.stringify(entry) + '\n', 'utf8');
          }
        } catch (logErr) {
          console.warn('[ENGINE_V2][shadow] persist failed', logErr);
        }
      } catch (e) {
        console.warn('[ENGINE_V2][shadow] logging failed:', e);
      }
    }
    
    // Validate Inner9 scores
    try {
      Inner9Schema.parse(sanitizedInner9);
      console.log('✅ [API /analyze] Inner9 scores validated');
    } catch (error) {
      console.error('❌ [API /analyze] Inner9 validation failed:', error);
      return NextResponse.json({ ok: false, error: 'INNER9_VALIDATION_FAILED' }, { status: 500 });
    }
    
    // Generate AI analysis text (async)
    let analysisText = '';
    try {
      analysisText = await generateAnalysisText({
        userId: session?.user?.email ?? 'anonymous',
        testType: 'inner9',
        big5: { O, C, E, A, N },
        mbti: body.mbti ?? 'XXXX',
        big5Percentiles,
        mbtiRatios,
        analysisText: '', // Will be filled
        growth: sanitizedInner9 ? {
          innate: sanitizedInner9.creation ?? 50,
          acquired: sanitizedInner9.will ?? 50,
          conscious: sanitizedInner9.insight ?? 50,
          unconscious: sanitizedInner9.sensitivity ?? 50,
          growth: sanitizedInner9.growth ?? 50,
          stability: sanitizedInner9.balance ?? 50,
          harmony: sanitizedInner9.harmony ?? 50,
          individual: sanitizedInner9.expression ?? 50,
        } : undefined,
      });
      console.log('✅ [API /analyze] AI analysis generated:', analysisText.length, 'chars');
    } catch (error) {
      console.error('⚠️ [API /analyze] Failed to generate AI analysis:', error);
      analysisText = '심층 분석을 생성하는 중 오류가 발생했습니다. 기본 분석 결과를 확인해주세요.';
    }

    // DB 저장: results 테이블에 Inner9 결과 저장
    // - 카카오/네이버는 이메일이 없을 수 있으므로 provider/providerId로 우선 조회
    let userId: string | null = null;
    if (session) {
      const s: any = session as any;
      const provider: string | undefined = s?.provider;
      const providerId: string | undefined = s?.providerId;

      // 1) provider + provider_id로 조회 (우선)
      if (provider && providerId) {
        const { data: byProv } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('provider', provider)
          .eq('provider_id', providerId)
          .maybeSingle();
        if (byProv?.id) userId = byProv.id as string;
      }

      // 2) 이메일이 있으면 이메일로 조회 (google 또는 이메일 허용된 경우)
      if (!userId && session.user?.email) {
        const { data: byEmail } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email as string)
          .maybeSingle();
        if (byEmail?.id) userId = byEmail.id as string;
      }

      // 3) effectiveEmail로 보조 조회 (naver:email, kakao:providerId)
      if (!userId && (provider || providerId)) {
        const effectiveEmail = (() => {
          const raw = session.user?.email as string | undefined;
          if (provider && provider !== 'google') {
            if (raw && raw.length > 0) return `${provider}:${raw}`;
            if (providerId) return `${provider}:${providerId}`;
          }
          return raw ?? `${provider}:${providerId ?? 'unknown'}`;
        })();
        const { data: byEff } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', effectiveEmail)
          .maybeSingle();
        if (byEff?.id) userId = byEff.id as string;
      }
    }

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Derive a simple tribe from the strongest Inner9 dimension to satisfy NOT NULL constraints
    const strongestKey = Object.entries(out.inner9)
      .sort((a: any, b: any) => (b[1] as number) - (a[1] as number))[0]?.[0] ?? 'unknown'
    const derivedTribe = strongestKey
    const heroPayload = {
      id: out.hero?.id ?? 0,
      code: out.hero?.code ?? 'H-UNKNOWN',
      title: out.hero?.title ?? '미확인 영웅',
      color: out.hero?.color ?? null,
      score: out.hero?.score ?? null,
    };

    // Log Inner9 scores for monitoring
    // sanitizedInner9 사용 (NaN 값이 0.5로 대체된 버전)
    const inner9Map = sanitizedInner9 || {};
    
    console.info('inner9-save', { 
      user: userId, 
      ...inner9Map,
      mbti: body.mbti,
      reti: body.reti
    });

    const { data: resultData, error: insertError } = await supabaseAdmin
      .from('results')
      .insert({
        user_id: userId,
        big5_scores: {
          O: body.big5.O,
          C: body.big5.C,
          E: body.big5.E,
          A: body.big5.A,
          N: body.big5.N,
        },
        mbti_scores: body.mbti ? { type: body.mbti } : { type: null },
        reti_scores: typeof body.reti === 'number' ? { score: body.reti } : { score: null },
        inner_nine: sanitizedInner9,
        inner9_scores: inner9Map,
        model_version: out.modelVersion,
        engine_version: out.engineVersion,
        hero_code: out.hero?.code ?? null,
        hero: heroPayload,
        color_natal: out.color?.natal?.id ?? null,
        color_growth: out.color?.growth?.id ?? null,
        stone: out.color?.natal?.id ?? 0,
        narrative: out.narrative?.summary ?? null,
        tribe: (out as any)?.hero?.tribe ?? derivedTribe ?? 'unknown',
        // Deep analysis fields
        big5_percentiles: big5Percentiles,
        mbti_ratios: mbtiRatios,
        analysis_text: analysisText,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('DB insert error:', insertError);
      return NextResponse.json(
        { ok: false, error: 'DB_ERROR', detail: insertError.message },
        { status: 500 }
      );
    }

    // ReportV1 포맷으로 요약 생성
    const summary = {
      highlight: analysisText || "분석이 완료되었습니다.",
      bullets: [
        `Big5 성격 분석: ${body.big5.O}% 개방성, ${body.big5.C}% 성실성`,
        `MBTI 유형: ${body.mbti || '미분류'}`,
        `RETI 동기: ${body.reti || 5}점`,
        `Inner9 내면 지도: ${Object.keys(inner9Scores || {}).length}개 축 분석 완료`
      ]
    };

    // ReportV1 객체 생성
    const reportV1: ReportV1 = wrapAsReportV1(
      resultData.id,
      session?.user?.email || 'unknown',
      out,
      summary
    );

    // Phase 0: Big5 신뢰도(간단 지표) 산출 — 50에서의 평균 편차 기반
    const big5Vals = [O, C, E, A, N];
    const spread = big5Vals.reduce((s, x) => s + Math.abs(x - 50), 0) / (5 * 50);
    const big5Confidence = Math.max(0, Math.min(100, Math.round((1 - spread) * 100)));

    return NextResponse.json({ 
      ok: true, 
      reportId: resultData.id,
      report: reportV1,
      data: {
        ...out,
        big5Percentiles,
        mbtiRatios,
        mbtiConfidence,
        mbtiV2,
        mbtiStable,
        confidence: {
          big5: big5Confidence,
          mbti: mbtiConfidence?.confidence ?? null,
        },
        engineDebug,
        fusionDebug,
        adaptiveHint,
        inner9Scores: sanitizedInner9,
        analysisText,
      }
    });
  } catch (e: any) {
    console.error('❌ [API /analyze] Inner9 analysis error:', e);
    console.error('❌ [API /analyze] Error stack:', e?.stack);
    return NextResponse.json(
      { ok: false, error: 'ENGINE_ERROR', detail: e?.message },
      { status: 500 }
    );
  }
}

// GET 메서드 (API 정보)
export async function GET() {
  return NextResponse.json({
    message: 'InnerMap AI 분석 API (Inner9)',
    version: '1.0.0',
    engines: {
      inner9: 'inner9@1.0.0',
      'im-core': 'im-core@1.0.0',
    },
    endpoints: {
      POST: '/api/analyze - Inner9 분석 실행 (big5 필수)',
    },
  });
}
