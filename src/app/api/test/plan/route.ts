import { NextResponse } from 'next/server';
import { buildTestPlan } from '@/data/questionBank';
import { TestMode } from '@/types/question';

export async function POST(request: Request) {
  try {
    const { mode } = await request.json();

    if (!mode || (mode !== 'simple' && mode !== 'deep')) {
      return NextResponse.json(
        { error: '유효하지 않은 모드입니다' },
        { status: 400 }
      );
    }

    const questions = buildTestPlan(mode as TestMode);

    return NextResponse.json({
      success: true,
      plan: {
        mode,
        questions,
        total: questions.length
      }
    });
  } catch (error) {
    console.error('Test plan 생성 에러:', error);
    return NextResponse.json(
      { success: false, error: '문항 계획 생성 실패' },
      { status: 500 }
    );
  }
}

