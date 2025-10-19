/**
 * Fallback Analysis API Route
 * Direct OpenAI call when CrewAI service is unavailable
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, big5, mbti, inner9, hero } = body;

    // Validate input
    if (!big5 || !inner9) {
      return NextResponse.json(
        { error: 'Missing required fields: big5, inner9' },
        { status: 400 }
      );
    }

    console.log('[Fallback Analysis] Starting direct OpenAI analysis...');

    const openai = getOpenAIClient();

    // Prepare context
    const context = `
다음은 사용자의 심리 분석 데이터입니다:

**Big5 성격 점수:**
- 개방성 (O): ${big5.O.toFixed(2)}
- 성실성 (C): ${big5.C.toFixed(2)}
- 외향성 (E): ${big5.E.toFixed(2)}
- 친화성 (A): ${big5.A.toFixed(2)}
- 신경성 (N): ${big5.N.toFixed(2)}

${mbti ? `**MBTI 유형:** ${mbti}` : ''}

**Inner9 차원 점수:**
- 창조 (Creation): ${inner9.creation.toFixed(1)}
- 의지 (Will): ${inner9.will.toFixed(1)}
- 통찰 (Insight): ${inner9.insight.toFixed(1)}
- 감수성 (Sensitivity): ${inner9.sensitivity.toFixed(1)}
- 성장 (Growth): ${inner9.growth.toFixed(1)}
- 균형 (Balance): ${inner9.balance.toFixed(1)}
- 조화 (Harmony): ${inner9.harmony.toFixed(1)}
- 표현 (Expression): ${inner9.expression.toFixed(1)}

${hero ? `**영웅 원형:** ${hero.title} (${hero.code})` : ''}
${hero?.tribe ? `**부족:** ${hero.tribe}` : ''}
    `.trim();

    const prompt = `
${context}

위 심리 데이터를 종합 분석하여 다음 형식으로 심층 리포트를 작성해주세요:

1. **전체 요약** (2-3 문단): 핵심 성격 특징을 간결하게 요약
2. **주요 강점** (3-5개): 각 강점에 대한 간단한 설명
3. **성장 영역** (3-5개): 각 영역에 대한 간단한 설명
4. **성장 조언** (2-3 문단): 구체적이고 실천 가능한 조언
5. **관계 및 소통** (2-3 문단): 대인관계 패턴과 개선 방안
6. **커리어 방향** (2-3 문단): 적합한 직업 분야와 발전 방향

톤은 공감적이고 격려적이며, 독자가 자신의 잠재력을 믿고 성장할 수 있도록 동기부여해야 합니다.

JSON 형식으로 출력하세요:
{
  "summary": "전체 요약 텍스트",
  "strengths": ["강점1", "강점2", "강점3"],
  "weaknesses": ["약점1", "약점2", "약점3"],
  "growthAdvice": "성장 조언 텍스트",
  "relationships": "관계 및 소통 텍스트",
  "career": "커리어 방향 텍스트"
}
    `.trim();

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            '당신은 20년 경력의 심리학 박사이자 개인 성장 코치입니다. 복잡한 심리 데이터를 명확하고 실용적인 통찰로 변환하는 능력이 뛰어납니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const processingTime = (Date.now() - startTime) / 1000;

    const analysisText = completion.choices[0].message?.content?.trim() ?? '{}';
    const analysis = JSON.parse(analysisText);

    console.log('[Fallback Analysis] Completed successfully');

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        crewVersion: 'fallback',
        processingTime,
      },
    });
  } catch (error) {
    console.error('[Fallback Analysis] Failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Fallback analysis failed',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

