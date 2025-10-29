/**
 * AI Service Layer with Fallback
 * Primary: Claude Sonnet 4.5 (best for storytelling)
 * Fallback: OpenAI GPT-4 (when Claude is unavailable)
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let anthropicClient: Anthropic | null = null;
let openaiClient: OpenAI | null = null;

function getAnthropicClient(): Anthropic | null {
  try {
    if (!anthropicClient && process.env.ANTHROPIC_API_KEY) {
      anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
    return anthropicClient;
  } catch (error) {
    console.warn('⚠️ [AI] Claude client initialization failed:', error);
    return null;
  }
}

function getOpenAIClient(): OpenAI | null {
  try {
    if (!openaiClient && process.env.OPENAI_API_KEY) {
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return openaiClient;
  } catch (error) {
    console.warn('⚠️ [AI] OpenAI client initialization failed:', error);
    return null;
  }
}

function getAvailableAI(): { type: 'claude' | 'openai' | null; client: any } {
  const claude = getAnthropicClient();
  if (claude) {
    return { type: 'claude', client: claude };
  }
  
  const openai = getOpenAIClient();
  if (openai) {
    console.log('🔄 [AI] Using GPT-4o (Claude unavailable)');
    return { type: 'openai', client: openai };
  }
  
  return { type: null, client: null };
}

/**
 * Generate 13-step deep analysis report with streaming
 * Tries Claude first, falls back to OpenAI if unavailable
 */
export async function* generateDeepReportStream(heroData: any) {
  const { type, client } = getAvailableAI();
  
  if (!type || !client) {
    throw new Error('No AI service available. Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY');
  }
  
  const prompt = buildDeepReportPrompt(heroData);
  
  console.log(`🤖 [AI] Starting deep report generation with ${type.toUpperCase()}...`);
  
  try {
    if (type === 'claude') {
      yield* generateWithClaude(client, prompt);
    } else {
      yield* generateWithOpenAI(client, prompt);
    }
    console.log(`✅ [AI] Deep report generation completed with ${type.toUpperCase()}`);
  } catch (error: any) {
    console.error(`❌ [AI] ${type.toUpperCase()} failed:`, error.message);
    
    // Try fallback if primary fails
    if (type === 'claude') {
      const openai = getOpenAIClient();
      if (openai) {
        console.log('🔄 [AI] Retrying with OpenAI fallback...');
        yield* generateWithOpenAI(openai, prompt);
        console.log('✅ [AI] Deep report generation completed with OpenAI (fallback)');
        return;
      }
    }
    
    throw error;
  }
}

async function* generateWithClaude(client: Anthropic, prompt: string) {
  const stream = await client.messages.stream({
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
}

async function* generateWithOpenAI(client: OpenAI, prompt: string) {
  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3500,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
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
1. 각 단계 **2-3 문단**으로 간결하게 작성
2. 핵심 인사이트 위주, 불필요한 반복 제거
3. 존댓말 사용, 따뜻하고 공감적인 톤
4. 구체적인 예시 1-2개만 포함
5. 이모지 적절히 활용
6. **중요**: 반드시 유효한 JSON 형식으로만 응답 (주석, 마크다운 없음)
7. **중요**: \`\`\`json 같은 마크다운 문법 사용 금지. 순수 JSON만 출력

간결하고 핵심적으로 작성해주세요.`;
}

/**
 * Generate 12 practical analysis cards
 * Tries Claude first, falls back to OpenAI if unavailable
 */
export async function generatePracticalCards(heroData: any): Promise<any[]> {
  const { type, client } = getAvailableAI();
  
  if (!type || !client) {
    throw new Error('No AI service available. Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY');
  }
  
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

  console.log(`🤖 [AI] Generating 12 practical cards with ${type.toUpperCase()}...`);

  try {
    // Generate all cards in parallel
    const results = await Promise.all(
      cards.map(card => generateCardContent(card, heroData, type, client))
    );

    console.log(`✅ [AI] 12 practical cards generated with ${type.toUpperCase()}`);
    return results;
  } catch (error: any) {
    console.error(`❌ [AI] ${type.toUpperCase()} failed:`, error.message);
    
    // Try fallback if primary fails
    if (type === 'claude') {
      const openai = getOpenAIClient();
      if (openai) {
        console.log('🔄 [AI] Retrying cards with OpenAI fallback...');
        const results = await Promise.all(
          cards.map(card => generateCardContent(card, heroData, 'openai', openai))
        );
        console.log('✅ [AI] 12 practical cards generated with OpenAI (fallback)');
        return results;
      }
    }
    
    throw error;
  }
}

/**
 * Generate content for a single practical card
 */
async function generateCardContent(
  card: any, 
  heroData: any, 
  aiType: 'claude' | 'openai',
  client: any
): Promise<any> {
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

**중요**: \`\`\`json 같은 마크다운 문법을 사용하지 마세요. 순수 JSON만 출력하세요.
따뜻하고 실용적으로 작성해주세요.`;

  try {
    let responseText = '';
    
    if (aiType === 'claude') {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      });
      const content = message.content[0];
      responseText = content.type === 'text' ? content.text : '';
    } else {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });
      responseText = completion.choices[0]?.message?.content || '';
    }
    
    // Try to parse JSON
    try {
      // Remove markdown code blocks if present
      let cleanText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn(`⚠️ [AI] Failed to parse card ${card.id} JSON:`, error);
      // Fallback if JSON parsing fails
      return {
        id: card.id,
        title: card.title,
        icon: card.icon,
        insight: responseText,
        details: [],
        actionItems: [],
      };
    }
  } catch (error) {
    console.error(`❌ [AI] Failed to generate card ${card.id}:`, error);
    // Return basic card structure on error
    return {
      id: card.id,
      title: card.title,
      icon: card.icon,
      insight: '분석 중 오류가 발생했습니다. 나중에 다시 시도해주세요.',
      details: [],
      actionItems: [],
    };
  }
}

