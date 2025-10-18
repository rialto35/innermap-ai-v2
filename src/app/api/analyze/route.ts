/**
 * Inner9 Analysis API
 * @route POST /api/analyze
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { runAnalysis } from '@/core/im-core';
import type { AnalyzeInput } from '@/core/im-core/types';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = (await req.json()) as Partial<AnalyzeInput>;
    
    if (!body?.big5) {
      return NextResponse.json({ ok: false, error: 'MISSING_BIG5' }, { status: 400 });
    }

    // 최소 검증
    const { O, C, E, A, N } = body.big5 as any;
    if ([O, C, E, A, N].some((v) => typeof v !== 'number')) {
      return NextResponse.json({ ok: false, error: 'INVALID_BIG5' }, { status: 400 });
    }

    const out = await runAnalysis({
      big5: { O, C, E, A, N },
      mbti: body.mbti,
      reti: body.reti,
      dob: body.dob,
      locale: body.locale ?? 'ko-KR',
    });

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
        inner_nine: out.inner9,
        model_version: out.modelVersion,
        engine_version: out.engineVersion,
        hero_code: out.hero?.code ?? null,
        color_natal: out.color?.natal?.id ?? null,
        color_growth: out.color?.growth?.id ?? null,
        narrative: out.narrative?.summary ?? null,
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

    return NextResponse.json({ ok: true, id: resultData.id, data: out });
  } catch (e: any) {
    console.error('Inner9 analysis error:', e);
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
