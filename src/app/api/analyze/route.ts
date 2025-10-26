/**
 * Inner9 Analysis API
 * @route POST /api/analyze
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { runAnalysis } from '@/core/im-core';
import { toInner9 } from '@/core/im-core/inner9';
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    
    // Enhanced Inner9 calculation with type weighting
    const config = getInner9Config();
    const inner9Scores = toInner9({
      big5: { o: O, c: C, e: E, a: A, n: N },
      mbti: body.mbti as string,
      reti: body.reti as number,
      weights: config.useTypeWeights ? { big5: 1, mbti: 0.5, reti: 0.5 } : { big5: 1, mbti: 0, reti: 0 }
    });
    
    // Validate Inner9 scores
    try {
      Inner9Schema.parse(inner9Scores);
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
        growth: out.inner9 ? {
          innate: out.inner9.creation ?? 50,
          acquired: out.inner9.will ?? 50,
          conscious: out.inner9.insight ?? 50,
          unconscious: out.inner9.sensitivity ?? 50,
          growth: out.inner9.growth ?? 50,
          stability: out.inner9.balance ?? 50,
          harmony: out.inner9.harmony ?? 50,
          individual: out.inner9.expression ?? 50,
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
    const inner9Map = inner9Scores.reduce((acc, axis) => {
      acc[axis.label.toLowerCase()] = axis.value;
      return acc;
    }, {} as Record<string, number>);
    
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
        inner_nine: out.inner9,
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
        `Inner9 내면 지도: ${inner9Scores.length}개 축 분석 완료`
      ]
    };

    // ReportV1 객체 생성
    const reportV1: ReportV1 = wrapAsReportV1(
      resultData.id,
      session?.user?.email || 'unknown',
      out,
      summary
    );

    return NextResponse.json({ 
      ok: true, 
      reportId: resultData.id,
      report: reportV1,
      data: {
        ...out,
        big5Percentiles,
        mbtiRatios,
        inner9Scores,
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
