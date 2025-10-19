/**
 * Inner9 Analysis API
 * @route POST /api/analyze
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { runAnalysis } from '@/core/im-core';
import { computeInner9Scores } from '@/core/im-core/inner9';
import { Inner9Schema } from '@/lib/schemas/inner9';
import { getInner9Config } from '@/config/inner9';
import type { AnalyzeInput } from '@/core/im-core/types';
import { 
  computeBig5Percentiles, 
  computeMBTIRatios, 
  generateAnalysisText 
} from '@/lib/psychometrics';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = (await req.json()) as Partial<AnalyzeInput>;
    
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
    const inner9Scores = computeInner9Scores(
      big5Percentiles,
      body.mbti as any,
      body.reti as any,
      config.useTypeWeights
    );
    
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
    let userId = null;
    if (session?.user?.email) {
      // 이메일로 user_id (UUID) 조회
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();
      userId = userData?.id ?? null;
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
    console.info('inner9-save', { 
      user: userId, 
      creation: inner9Scores.creation, 
      will: inner9Scores.will,
      sensitivity: inner9Scores.sensitivity,
      harmony: inner9Scores.harmony,
      expression: inner9Scores.expression,
      insight: inner9Scores.insight,
      resilience: inner9Scores.resilience,
      balance: inner9Scores.balance,
      growth: inner9Scores.growth,
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
        inner9_scores: inner9Scores,
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

    return NextResponse.json({ 
      ok: true, 
      id: resultData.id, 
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
