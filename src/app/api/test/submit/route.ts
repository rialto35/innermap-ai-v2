import { NextResponse } from 'next/server';
import { calculateAllScores } from '@/lib/scoring/unified';
import { Big5Question } from '@/types/question';

export async function POST(request: Request) {
  try {
    const { answers, questions, birth, mode } = await request.json();

    if (!answers || !questions || !birth) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다' },
        { status: 400 }
      );
    }

    // 답변을 배열 형태로 변환
    const answerArray = Object.entries(answers).map(([qid, value]) => ({
      qid,
      value: value as number
    }));

    // 점수 계산
    const scores = calculateAllScores(answerArray, questions as Question[], birth);

    // 신뢰도 레벨 결정 (심층검사일 때 더 높음)
    const confidenceLevel = mode === 'deep' ? '높음' : '보통';

    return NextResponse.json({
      success: true,
      scores,
      metadata: {
        mode,
        confidenceLevel,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('점수 계산 에러:', error);
    return NextResponse.json(
      { success: false, error: '점수 계산 실패' },
      { status: 500 }
    );
  }
}

