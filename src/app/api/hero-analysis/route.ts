/**
 * Hero Analysis API Route
 * 
 * POST /api/hero-analysis
 * 사용자의 성격 데이터를 받아 영웅 세계관 분석 결과를 반환
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeHero, generateFallbackAnalysis } from '@/lib/ai/heroAnalysis';
import type { HeroAnalysisInput } from '@/lib/prompts/systemPrompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 데이터 검증
    const { mbti, enneagram, big5, colors, birthDate } = body;
    
    if (!mbti || !enneagram || !colors || colors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 데이터가 누락되었습니다. (mbti, enneagram, colors 필요)',
        },
        { status: 400 }
      );
    }

    const userData: HeroAnalysisInput = {
      mbti,
      enneagram: Number(enneagram),
      big5: big5 ? {
        openness: big5.openness || 0,
        conscientiousness: big5.conscientiousness || 0,
        extraversion: big5.extraversion || 0,
        agreeableness: big5.agreeableness || 0,
        neuroticism: big5.neuroticism || 0,
      } : undefined,
      colors: Array.isArray(colors) ? colors : [colors],
      birthDate: birthDate || undefined,
    };

    console.log('🧬 Hero Analysis 요청:', userData);

    // OpenAI API 키 확인
    const hasApiKey = !!process.env.OPENAI_API_KEY;

    let result;

    if (hasApiKey) {
      // 실제 AI 분석
      console.log('✨ OpenAI로 분석 시작...');
      result = await analyzeHero(userData);
      console.log('✅ 분석 완료!');
    } else {
      // Fallback 분석 (API 키 없을 때)
      console.log('⚠️ OpenAI API 키 없음 - Fallback 사용');
      result = generateFallbackAnalysis(userData);
    }

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        usedFallback: !hasApiKey,
        timestamp: new Date().toISOString(),
        inputData: userData,
      },
    });

  } catch (error: any) {
    console.error('❌ Hero Analysis API 에러:', error);

    // 에러 타입별 처리
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenAI API 키 오류',
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          success: false,
          error: 'API 요청 한도 초과',
          details: '잠시 후 다시 시도해주세요.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '분석 중 오류가 발생했습니다.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET 요청 처리 (API 상태 확인)
 */
export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    status: 'online',
    service: 'Hero Analysis API',
    version: '2.0',
    features: {
      aiAnalysis: hasApiKey,
      fallbackMode: !hasApiKey,
    },
    endpoints: {
      analyze: 'POST /api/hero-analysis',
    },
  });
}

