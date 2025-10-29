/**
 * Claude AI Service Layer
 * Handles AI-powered deep analysis report generation using Claude Sonnet 4.5
 */

import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to avoid build-time errors
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

/**
 * Generate 13-step deep analysis report with streaming
 */
export async function* generateDeepReportStream(heroData: any) {
  const anthropic = getAnthropicClient();
  const prompt = buildDeepReportPrompt(heroData);
  
  console.log('🤖 [Claude] Starting deep report generation...');
  
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      yield chunk.delta.text;
    }
  }
  
  console.log('✅ [Claude] Deep report generation completed');
}

/**
 * Build prompt for 13-step deep analysis report
 */
function buildDeepReportPrompt(heroData: any): string {
  const { user, mbti, world, big5, analysis, hero, tribe, stone } = heroData;
  
  return `당신은 심리 분석 전문가이자 스토리텔러입니다.
다음 데이터를 바탕으로 "innerMap 13단계 통합 리포트"를 작성해주세요.

# 사용자 데이터
- 이름: ${user?.name || '사용자'}
- MBTI: ${mbti?.type || 'INTP'}
- RETI: R${world?.reti || '1'}
- Big5: O=${big5?.O || 50}, C=${big5?.C || 50}, E=${big5?.E || 50}, A=${big5?.A || 50}, N=${big5?.N || 50}
- Inner9 강점: ${analysis?.inner9?.strengths?.map((s: any) => s.dimension || s).join(', ') || '균형, 성찰'}
- Inner9 약점: ${analysis?.inner9?.growthAreas?.map((g: any) => g.dimension || g).join(', ') || '추진력, 공감'}
- Hero: ${hero?.name || 'Architect of Logic'}
- Tribe: ${tribe?.name || '베르디안'}
- Stone: ${stone?.name || 'Arche'}

# 출력 형식 (반드시 유효한 JSON으로만 응답)
{
  "sections": [
    {
      "id": 1,
      "title": "성격 지형 분석",
      "icon": "🎭",
      "content": "MBTI, RETI, Hero를 통합한 성격 분석 (3-4 문단, 따뜻하고 공감적인 톤)"
    },
    {
      "id": 2,
      "title": "감정 흐름 진단",
      "icon": "🌊",
      "content": "Big5 신경성과 Inner9 감정 차원 분석 (3-4 문단, 회복 루틴 포함)"
    },
    {
      "id": 3,
      "title": "내면의 우주",
      "icon": "🌌",
      "content": "Inner9 시각화 및 은유적 표현 (2-3 문단)"
    },
    {
      "id": 4,
      "title": "그림자 영역 탐색",
      "icon": "🌑",
      "content": "약점을 성장 기회로 재해석 (3-4 문단, 통합 연습 포함)"
    },
    {
      "id": 5,
      "title": "관계 패턴 분석",
      "icon": "🤝",
      "content": "Big5 외향성/친화성 기반 관계 분석 (3-4 문단, 조화 루틴 포함)"
    },
    {
      "id": 6,
      "title": "성장 나침반",
      "icon": "🌱",
      "content": "단기(3개월), 중기(6-12개월), 장기(1년+) 목표 (구체적 실천 방법)"
    },
    {
      "id": 7,
      "title": "직장/커리어 패턴",
      "icon": "💼",
      "content": "직무 적합성 및 업무 스타일 분석 (3-4 문단, 추천 직업군 포함)"
    },
    {
      "id": 8,
      "title": "궁합 & 관계 시너지",
      "icon": "💞",
      "content": "MBTI 궁합 및 관계 유지 팁 (3-4 문단)"
    },
    {
      "id": 9,
      "title": "라이프 밸런스 & 웰빙",
      "icon": "⚖️",
      "content": "스트레스 관리 및 웰빙 전략 (3-4 문단, 구체적 루틴 포함)"
    },
    {
      "id": 10,
      "title": "미래 성장 시나리오",
      "icon": "🚀",
      "content": "1년/3년/5년 후 성장 비전 (구체적 시나리오)"
    },
    {
      "id": 11,
      "title": "추천 멘토링",
      "icon": "👥",
      "content": "멘토 유형 및 피드백 방식 제안 (2-3 문단)"
    },
    {
      "id": 12,
      "title": "통합 메시지",
      "icon": "💎",
      "content": "핵심 메시지 및 격려 (2-3 문단, 감동적인 마무리)"
    },
    {
      "id": 13,
      "title": "감정 워드클라우드",
      "icon": "☁️",
      "content": "핵심 키워드 8개 (이모지 + 단어 형태)"
    }
  ]
}

# 작성 가이드
1. 각 단계마다 스토리텔링 방식으로 작성
2. 데이터를 나열하지 말고, 의미를 해석
3. 존댓말 사용, 따뜻하고 공감적인 톤
4. 구체적인 예시와 실천 방법 포함
5. 이모지 적절히 활용
6. 반드시 유효한 JSON 형식으로만 응답 (주석 없음)

각 단계를 풍부하고 따뜻하게 작성해주세요.`;
}

/**
 * Generate 12 practical analysis cards
 */
export async function generatePracticalCards(heroData: any): Promise<any[]> {
  const anthropic = getAnthropicClient();
  
  const cards = [
    // Career (4 cards)
    { id: 'career-fit', title: '직무 적합성 분석', icon: '💼', category: 'career' },
    { id: 'leadership', title: '리더십 스타일', icon: '👔', category: 'career' },
    { id: 'productivity', title: '업무 스타일 & 생산성', icon: '📊', category: 'career' },
    { id: 'teamwork', title: '협업 & 팀워크', icon: '🤝', category: 'career' },
    
    // Relationships (3 cards)
    { id: 'romance', title: '연애 궁합 분석', icon: '💕', category: 'relationship' },
    { id: 'friendship', title: '우정 & 사교성', icon: '👥', category: 'relationship' },
    { id: 'family', title: '가족 관계 역학', icon: '👨‍👩‍👧‍👦', category: 'relationship' },
    
    // Personal Growth (5 cards)
    { id: 'stress', title: '스트레스 관리 전략', icon: '😰', category: 'growth' },
    { id: 'learning', title: '학습 스타일 & 성장', icon: '📚', category: 'growth' },
    { id: 'hobbies', title: '취미 & 여가 추천', icon: '🎨', category: 'growth' },
    { id: 'finance', title: '재무 관리 스타일', icon: '💰', category: 'growth' },
    { id: 'lifestyle', title: '라이프스타일 설계', icon: '🏡', category: 'growth' },
  ];

  console.log('🤖 [Claude] Generating 12 practical cards...');

  // Generate all cards in parallel
  const results = await Promise.all(
    cards.map(card => generateCardContent(card, heroData))
  );

  console.log('✅ [Claude] 12 practical cards generated');

  return results;
}

/**
 * Generate content for a single practical card
 */
async function generateCardContent(card: any, heroData: any): Promise<any> {
  const anthropic = getAnthropicClient();
  const { user, mbti, world, big5 } = heroData;
  
  const prompt = `당신은 심리 분석 전문가입니다.
다음 사용자 데이터를 바탕으로 "${card.title}" 분석 카드를 작성해주세요.

# 사용자 데이터
- MBTI: ${mbti?.type || 'INTP'}
- RETI: R${world?.reti || '1'}
- Big5: O=${big5?.O}, C=${big5?.C}, E=${big5?.E}, A=${big5?.A}, N=${big5?.N}

# 출력 형식 (유효한 JSON)
{
  "id": "${card.id}",
  "title": "${card.title}",
  "icon": "${card.icon}",
  "insight": "핵심 인사이트 (2-3 문장)",
  "details": ["세부 사항 1", "세부 사항 2", "세부 사항 3"],
  "actionItems": ["실천 방법 1", "실천 방법 2"]
}

따뜻하고 실용적으로 작성해주세요.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type === 'text') {
    try {
      return JSON.parse(content.text);
    } catch {
      // Fallback if JSON parsing fails
      return {
        id: card.id,
        title: card.title,
        icon: card.icon,
        insight: content.text,
        details: [],
        actionItems: [],
      };
    }
  }

  return card;
}

