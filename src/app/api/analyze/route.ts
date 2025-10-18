/**
 * Inner9 Analysis API
 * @route POST /api/analyze
 */

import { NextResponse } from 'next/server';
import { runAnalysis } from '@/core/im-core';
import type { AnalyzeInput } from '@/core/im-core/types';

export async function POST(req: Request) {
  try {
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

    // TODO: DB 저장 (results.inner_nine / versions)는 후속 PR에서
    return NextResponse.json({ ok: true, data: out });
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
