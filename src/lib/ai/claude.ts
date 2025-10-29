/**
 * AI Service Layer with Fallback
 * Primary: Claude Sonnet 4.5 (best for storytelling)
 * Fallback: OpenAI GPT-4 (when Claude is unavailable)
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { TRIBES_12, STONES_12, getStoneByName, getTribeByName } from '@/lib/data/tribesAndStones';
import innermapTribes from '@/data/innermapTribes.json';

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
 * Helper: Get attachment type from Big5 scores
 */
function getAttachmentType(big5: any): string {
  const n = big5?.N || 50;
  const a = big5?.A || 50;
  const e = big5?.E || 50;
  
  if (n < 40 && a > 60) return '안정형 (Secure)';
  if (n > 60 && a < 40) return '회피형 (Avoidant)';
  if (n > 60 && a > 60) return '불안형 (Anxious)';
  return '혼합형 (Mixed)';
}

/**
 * Helper: Get extreme Big5 traits
 */
function getExtremeBig5(big5: any): { high: string[], low: string[] } {
  const traits = {
    O: '개방성',
    C: '성실성',
    E: '외향성',
    A: '친화성',
    N: '신경성'
  };
  
  const high: string[] = [];
  const low: string[] = [];
  
  Object.entries(traits).forEach(([key, label]) => {
    const score = big5?.[key] || 50;
    if (score > 70) high.push(label);
    if (score < 30) low.push(label);
  });
  
  return { high, low };
}

/**
 * Helper: Get max Inner9 dimension
 */
function getMaxInner9(inner9: any): string {
  if (!inner9 || typeof inner9 !== 'object') return '균형';
  
  const dimensions = {
    '선천': inner9['선천'] || 0,
    '후천': inner9['후천'] || 0,
    '조화': inner9['조화'] || 0,
    '개별': inner9['개별'] || 0,
    '관계': inner9['관계'] || 0,
    '성찰': inner9['성찰'] || 0,
    '추진': inner9['추진'] || 0,
    '공감': inner9['공감'] || 0,
    '통찰': inner9['통찰'] || 0
  };
  
  const max = Object.entries(dimensions).reduce((a, b) => a[1] > b[1] ? a : b);
  return max[0];
}

/**
 * Build prompt for 13-step deep analysis report
 * Enhanced with Tribe (선천 컬러) and Stone (후천 컬러) data
 */
function buildDeepReportPrompt(heroData: any): string {
  const { user, mbti, world, big5, analysis, hero, tribe, stone, inner9 } = heroData;
  
  // Fetch detailed Tribe data
  const tribeData = innermapTribes.find((t: any) => 
    t.nameKor === tribe?.name || t.nameEn === tribe?.name || t.id === tribe?.code?.toLowerCase()
  );
  
  // Fetch detailed Stone data
  const stoneData = getStoneByName(stone?.name || 'Arche');
  
  // Derive additional insights
  const attachmentType = getAttachmentType(big5);
  const extremeBig5 = getExtremeBig5(big5);
  const maxInner9 = getMaxInner9(inner9);
  
  return `You are a psychological analysis expert and storyteller for innerMap AI.
Create a "13-Step Integrated Psychological Report" based on the user's data below.

**CRITICAL**: You MUST respond with ONLY valid JSON. No explanations, no apologies, no markdown.
Start your response with { and end with }. Nothing else.

# 📊 사용자 핵심 데이터

## 1️⃣ 기본 정보
- 이름: ${user?.name || '사용자'}
- MBTI: ${mbti?.type || 'INTP'}
- RETI: R${world?.reti || '1'}

## 2️⃣ Big5 성격 (0-100점)
- 개방성(O): ${big5?.O || 50}점
- 성실성(C): ${big5?.C || 50}점
- 외향성(E): ${big5?.E || 50}점
- 친화성(A): ${big5?.A || 50}점
- 신경성(N): ${big5?.N || 50}점
- **애착 유형**: ${attachmentType}
- **극단 특성**: 높음(${extremeBig5.high.join(', ') || '없음'}), 낮음(${extremeBig5.low.join(', ') || '없음'})

## 3️⃣ Inner9 내면 지도
- 최강 차원: ${maxInner9}
- 강점: ${analysis?.inner9?.strengths?.map((s: any) => s.dimension || s).join(', ') || '균형, 성찰'}
- 성장 영역: ${analysis?.inner9?.growthAreas?.map((g: any) => g.dimension || g).join(', ') || '추진력, 공감'}

## 4️⃣ 영웅 (Hero) - 소망 컬러
- 이름: ${hero?.name || 'Architect of Logic'}
- 설명: ${hero?.description || '논리의 설계자'}

## 5️⃣ 부족 (Tribe) - 선천 컬러 🌅
${tribeData ? `
- 이름: ${tribeData.nameKor} (${tribeData.nameEn})
- 상징: ${tribeData.symbol?.icon || tribeData.symbol}
- 핵심 가치: ${tribeData.essence?.coreValue || tribeData.coreValue}
- 철학: ${tribeData.essence?.philosophy || tribeData.description}
- 키워드: ${tribeData.personality?.keywords?.join(', ') || tribeData.keywords?.join(', ')}
- AI 톤: ${tribeData.aiPrompt?.tone || '따뜻하고 공감적'}
- AI 포커스: ${tribeData.aiPrompt?.focus || '내면 성장'}
` : `- 이름: ${tribe?.name || '알 수 없음'}`}

## 6️⃣ 결정석 (Stone) - 후천 컬러 💎
${stoneData ? `
- 이름: ${stoneData.nameKo} (${stoneData.nameEn})
- 상징: ${stoneData.symbol}
- 핵심 가치: ${stoneData.coreValue}
- 성장 키워드: ${stoneData.growthKeyword}
- 설명: ${stoneData.description}
- Big5 대응: ${Object.entries(stoneData.big5Mapping).map(([k, v]) => `${k}=${v}`).join(', ')}
` : `- 이름: ${stone?.name || '알 수 없음'}`}

---

# 📝 출력 형식 (반드시 유효한 JSON으로만 응답)

{
  "sections": [
    {
      "id": 1,
      "title": "성격 지형 분석",
      "icon": "🎭",
      "content": "MBTI, RETI, Hero를 통합한 성격 분석. 500-700자. ${tribeData?.aiPrompt?.tone || '따뜻하고 공감적인 톤'}으로 작성."
    },
    {
      "id": 2,
      "title": "감정 흐름 진단",
      "icon": "🌊",
      "content": "Big5 신경성(${big5?.N}점)과 애착 유형(${attachmentType})을 중심으로 감정 패턴 분석. 500-700자. 회복 루틴 2가지 포함."
    },
    {
      "id": 3,
      "title": "내면의 우주 (Inner9)",
      "icon": "🌌",
      "content": "Inner9 최강 차원(${maxInner9})을 중심으로 내면 세계 시각화. 500-700자. 은유와 스토리텔링 활용."
    },
    {
      "id": 4,
      "title": "그림자 영역 탐색",
      "icon": "🌑",
      "content": "성장 영역(${analysis?.inner9?.growthAreas?.map((g: any) => g.dimension || g).join(', ')})을 성장 기회로 재해석. 500-700자. 통합 연습 1-2가지 포함."
    },
    {
      "id": 5,
      "title": "관계 패턴 분석",
      "icon": "🤝",
      "content": "Big5 외향성(${big5?.E}점), 친화성(${big5?.A}점) 기반 관계 분석. 500-700자. ${tribeData?.personality?.keywords?.includes('관계') ? '부족 특성 반영.' : ''}"
    },
    {
      "id": 6,
      "title": "성장 나침반 (Tribe + Stone)",
      "icon": "🌱",
      "content": "부족(${tribeData?.nameKor || tribe?.name})의 선천 본질과 결정석(${stoneData?.nameKo || stone?.name})의 후천 성장을 통합. 500-700자. 단기/중기/장기 목표 각 1개씩."
    },
    {
      "id": 7,
      "title": "직장/커리어 패턴",
      "icon": "💼",
      "content": "MBTI(${mbti?.type})와 Big5 성실성(${big5?.C}점) 기반 직무 적합성. 500-700자. ${tribeData?.life?.careers ? `추천 직업: ${tribeData.life.careers.slice(0, 3).join(', ')}` : ''}"
    },
    {
      "id": 8,
      "title": "궁합 & 관계 시너지",
      "icon": "💞",
      "content": "MBTI 궁합 및 ${attachmentType} 애착 유형 기반 관계 전략. 500-700자. ${tribeData?.life?.relationships || ''}"
    },
    {
      "id": 9,
      "title": "라이프 밸런스 & 웰빙",
      "icon": "⚖️",
      "content": "Big5 신경성(${big5?.N}점) 기반 스트레스 관리. 500-700자. ${stoneData?.effect || '균형 유지'} 전략 포함."
    },
    {
      "id": 10,
      "title": "미래 성장 시나리오",
      "icon": "🚀",
      "content": "1년/3년/5년 후 성장 비전. 500-700자. ${tribeData?.aiPrompt?.focus || '내면 성장'}을 중심으로 구체적 시나리오."
    },
    {
      "id": 11,
      "title": "추천 멘토링",
      "icon": "👥",
      "content": "학습 스타일과 피드백 방식 제안. 500-700자. Big5 개방성(${big5?.O}점) 반영."
    },
    {
      "id": 12,
      "title": "통합 메시지",
      "icon": "💎",
      "content": "부족(${tribeData?.nameKor})의 철학과 결정석(${stoneData?.nameKo})의 성장 키워드를 통합한 핵심 메시지. 500-700자. 감동적이고 격려하는 마무리."
    },
    {
      "id": 13,
      "title": "감정 워드클라우드",
      "icon": "☁️",
      "content": "분석 데이터 기반 핵심 키워드 배열. **아래 JSON 구조 필수**."
    }
  ]
}

---

# ⚠️ 13단계 워드클라우드 특별 지침

13단계는 **반드시 다음 JSON 배열 형식**으로 작성하세요:

{
  "id": 13,
  "title": "감정 워드클라우드",
  "icon": "☁️",
  "content": "",
  "keywords": [
    {
      "word": "키워드",
      "emoji": "🔥",
      "source": "출처 (MBTI/Big5/Inner9/Tribe/Stone)",
      "weight": 1-10,
      "color": "#FF6B35"
    }
  ]
}

**키워드 생성 규칙**:
1. 총 12-15개 키워드 생성
2. 출처별 분배:
   - MBTI(${mbti?.type}): 2-3개
   - Big5 극단 특성: 2-3개
   - Inner9 최강 차원(${maxInner9}): 2-3개
   - Tribe(${tribeData?.nameKor}): 2-3개
   - Stone(${stoneData?.nameKo}): 2-3개
3. weight: 중요도 (10=최고, 1=최저)
4. color: 출처별 색상
   - MBTI: #8B5CF6 (보라)
   - Big5: #3B82F6 (파랑)
   - Inner9: #10B981 (초록)
   - Tribe: ${tribeData?.symbol?.color?.hex || '#FB923C'} (부족 색)
   - Stone: ${stoneData?.color || '#FBBF24'} (결정석 색)

**예시**:
{
  "word": "창조적",
  "emoji": "🎨",
  "source": "Big5 개방성 높음",
  "weight": 9,
  "color": "#3B82F6"
}

---

# ✍️ 작성 가이드

1. **분량**: 각 단계 500-700자 (13단계 제외) - 간결하게!
2. **톤**: ${tribeData?.aiPrompt?.tone || '따뜻하고 공감적이며, 존댓말 사용'}
3. **구조**: 도입(1문장) → 분석(2-3문단) → 실천(1문단)
4. **데이터 활용**: 부족/결정석 철학을 자연스럽게 녹여내기
5. **구체성**: 추상적 표현보다 구체적 예시와 실천 방법
6. **이모지**: 적절히 활용 (과도하지 않게)

${tribeData?.aiPrompt?.context || ''}

---

# ⚠️ FINAL WARNING

- **OUTPUT FORMAT**: Pure JSON only. Start with { and end with }.
- **NO MARKDOWN**: Do not use \`\`\`json or any markdown syntax.
- **NO EXPLANATIONS**: Do not add "Here is the report:" or similar text.
- **NO APOLOGIES**: If you cannot complete, return partial JSON, not error messages.

**START YOUR RESPONSE NOW WITH {**`;
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

