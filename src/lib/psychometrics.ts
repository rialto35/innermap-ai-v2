/**
 * Psychometric Analysis Utilities
 * 
 * Functions for computing percentiles, ratios, and AI-generated analysis
 * for deep psychological insights.
 */

import OpenAI from 'openai';
import type { Big5Percentiles, MBTIRatios, AnalyzeResult } from './types';
import { INNER9_DESCRIPTIONS } from '@/constants/inner9';

// Lazy initialization of OpenAI client (to avoid build-time errors)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

/**
 * Convert Big5 scores (0-1 range) to percentiles (0-100)
 * 
 * @param big5 - Big5 scores in 0-1 range
 * @returns Percentile scores (0-100) for each factor
 * 
 * @example
 * computeBig5Percentiles({ O: 0.82, C: 0.61, E: 0.45, A: 0.77, N: 0.38 })
 * // Returns: { O: 82, C: 61, E: 45, A: 77, N: 38 }
 */
export function computeBig5Percentiles(big5: {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}): Big5Percentiles {
  return {
    O: Math.round(big5.O * 100),
    C: Math.round(big5.C * 100),
    E: Math.round(big5.E * 100),
    A: Math.round(big5.A * 100),
    N: Math.round(big5.N * 100),
  };
}

/**
 * Compute MBTI axis ratios from MBTI type string
 * 
 * Uses a simple heuristic: dominant preference gets 65%, recessive gets 35%
 * This can be refined with actual test scores if available.
 * 
 * @param mbti - MBTI type string (e.g., "INFP")
 * @returns Ratio scores (0-100) for each axis
 * 
 * @example
 * computeMBTIRatios("INFP")
 * // Returns: { EI: 35, SN: 35, TF: 35, JP: 35 }
 * 
 * computeMBTIRatios("ESTJ")
 * // Returns: { EI: 65, SN: 65, TF: 65, JP: 65 }
 */
export function computeMBTIRatios(mbti: string): MBTIRatios {
  if (mbti.length !== 4) {
    throw new Error(`Invalid MBTI string: ${mbti}. Expected 4 characters.`);
  }

  return {
    EI: mbti[0] === 'E' ? 65 : 35,
    SN: mbti[1] === 'S' ? 65 : 35,
    TF: mbti[2] === 'T' ? 65 : 35,
    JP: mbti[3] === 'J' ? 65 : 35,
  };
}

/**
 * Compute MBTI ratios with confidence scores
 * 
 * If confidence scores are available, use them to compute more accurate ratios.
 * 
 * @param mbti - MBTI type string
 * @param confidence - Confidence scores for each axis (0-1 range)
 * @returns Ratio scores (0-100) for each axis
 * 
 * @example
 * computeMBTIRatiosWithConfidence("INFP", { EI: 0.8, SN: 0.6, TF: 0.7, JP: 0.5 })
 * // Returns: { EI: 20, SN: 40, TF: 30, JP: 50 }
 */
export function computeMBTIRatiosWithConfidence(
  mbti: string,
  confidence: { EI: number; SN: number; TF: number; JP: number }
): MBTIRatios {
  if (mbti.length !== 4) {
    throw new Error(`Invalid MBTI string: ${mbti}. Expected 4 characters.`);
  }

  // Convert confidence to ratio
  // If E with 0.8 confidence => 80% E, 20% I
  // If I with 0.8 confidence => 20% E, 80% I
  return {
    EI: mbti[0] === 'E' ? Math.round(50 + confidence.EI * 50) : Math.round(50 - confidence.EI * 50),
    SN: mbti[1] === 'S' ? Math.round(50 + confidence.SN * 50) : Math.round(50 - confidence.SN * 50),
    TF: mbti[2] === 'T' ? Math.round(50 + confidence.TF * 50) : Math.round(50 - confidence.TF * 50),
    JP: mbti[3] === 'J' ? Math.round(50 + confidence.JP * 50) : Math.round(50 - confidence.JP * 50),
  };
}

/**
 * Generate AI-powered psychological analysis text
 * 
 * Uses OpenAI GPT to create personalized analysis based on:
 * - Big5 percentiles
 * - MBTI ratios
 * - Growth vectors (if available)
 * 
 * @param result - Analysis result with scores and ratios
 * @returns AI-generated analysis text
 * 
 * @throws Error if OPENAI_API_KEY is not configured
 */
export async function generateAnalysisText(result: Partial<AnalyzeResult>): Promise<string> {
  console.log('🤖 [generateAnalysisText] Starting AI analysis generation...');

  const openai = getOpenAIClient();

  // Build comprehensive prompt
  const prompt = `
당신은 전문 심리 분석가입니다. 다음 데이터를 바탕으로 사용자의 성격을 깊이 있게 분석하고 성장 조언을 제공해주세요.

## 분석 데이터

### Big5 성격 요인 (백분위수, 0-100)
- 개방성 (Openness): ${result.big5Percentiles?.O}%
- 성실성 (Conscientiousness): ${result.big5Percentiles?.C}%
- 외향성 (Extraversion): ${result.big5Percentiles?.E}%
- 친화성 (Agreeableness): ${result.big5Percentiles?.A}%
- 신경성 (Neuroticism): ${result.big5Percentiles?.N}%

### MBTI 유형: ${result.mbti}
- E/I 비율: ${result.mbtiRatios?.EI}% (E 선호도)
- S/N 비율: ${result.mbtiRatios?.SN}% (S 선호도)
- T/F 비율: ${result.mbtiRatios?.TF}% (T 선호도)
- J/P 비율: ${result.mbtiRatios?.JP}% (J 선호도)

${result.growth ? `
### 성장 벡터
- 타고난 vs 습득: ${result.growth.innate} / ${result.growth.acquired}
- 의식 vs 무의식: ${result.growth.conscious} / ${result.growth.unconscious}
- 성장 vs 안정: ${result.growth.growth} / ${result.growth.stability}
- 조화 vs 개성: ${result.growth.harmony} / ${result.growth.individual}
` : ''}

## 요청사항

다음 형식으로 분석을 작성해주세요:

### 1. 핵심 성격 특징 (2-3문장)
전반적인 성격 경향과 주요 특성을 요약합니다.

### 2. 강점 (3-4개 항목)
- 강점 1: 설명
- 강점 2: 설명
- 강점 3: 설명

### 3. 성장 영역 (3-4개 항목)
- 영역 1: 개선 방향
- 영역 2: 개선 방향
- 영역 3: 개선 방향

### 4. 맞춤 조언 (2-3문장)
구체적이고 실천 가능한 성장 조언을 제공합니다.

**중요**: 
- 긍정적이고 격려하는 톤을 유지하세요
- 구체적이고 실천 가능한 조언을 제공하세요
- 전문적이면서도 친근한 언어를 사용하세요
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const analysis = completion.choices[0].message?.content?.trim() ?? '';

    console.log('✅ [generateAnalysisText] AI analysis generated');
    console.log('📝 [generateAnalysisText] Analysis length:', analysis.length, 'chars');

    return analysis;
  } catch (error) {
    console.error('❌ [generateAnalysisText] Failed to generate analysis:', error);
    
    // Fallback to template-based analysis if AI fails
    return generateFallbackAnalysis(result);
  }
}

/**
 * Generate fallback analysis when AI is unavailable
 * 
 * Uses template-based approach with percentile-based insights.
 */
function generateFallbackAnalysis(result: Partial<AnalyzeResult>): string {
  const { big5Percentiles, mbti } = result;

  if (!big5Percentiles || !mbti) {
    return '분석 데이터가 부족하여 상세 분석을 생성할 수 없습니다.';
  }

  const sections: string[] = [];

  // 1. Core personality
  sections.push('### 1. 핵심 성격 특징\n');
  if (big5Percentiles.E > 60) {
    sections.push('당신은 사교적이고 활동적인 성향을 가지고 있습니다. 사람들과의 상호작용에서 에너지를 얻으며, 새로운 경험을 즐깁니다.');
  } else if (big5Percentiles.E < 40) {
    sections.push('당신은 내향적이고 사려 깊은 성향을 가지고 있습니다. 혼자만의 시간을 통해 에너지를 충전하며, 깊이 있는 관계를 선호합니다.');
  } else {
    sections.push('당신은 외향성과 내향성의 균형을 잘 맞추는 편입니다. 상황에 따라 유연하게 대응할 수 있는 강점이 있습니다.');
  }

  // 2. Strengths
  sections.push('\n### 2. 강점\n');
  const strengths: string[] = [];
  
  if (big5Percentiles.O > 60) strengths.push('- **창의성**: 새로운 아이디어와 관점을 탐구하는 능력이 뛰어납니다.');
  if (big5Percentiles.C > 60) strengths.push('- **성실성**: 목표를 향해 꾸준히 노력하며 책임감이 강합니다.');
  if (big5Percentiles.A > 60) strengths.push('- **협력**: 타인과 조화롭게 일하며 공감 능력이 뛰어납니다.');
  if (big5Percentiles.N < 40) strengths.push('- **정서 안정성**: 스트레스 상황에서도 침착함을 유지합니다.');

  sections.push(strengths.slice(0, 4).join('\n'));

  // 3. Growth areas
  sections.push('\n\n### 3. 성장 영역\n');
  const growthAreas: string[] = [];
  
  if (big5Percentiles.O < 40) growthAreas.push('- **개방성**: 새로운 경험과 관점에 더 열린 자세를 가져보세요.');
  if (big5Percentiles.C < 40) growthAreas.push('- **계획성**: 목표 설정과 시간 관리 기술을 향상시켜보세요.');
  if (big5Percentiles.E < 40) growthAreas.push('- **사회성**: 작은 모임부터 시작해 사회적 네트워크를 확장해보세요.');
  if (big5Percentiles.N > 60) growthAreas.push('- **스트레스 관리**: 명상이나 운동을 통해 정서 조절 능력을 키워보세요.');

  sections.push(growthAreas.slice(0, 4).join('\n'));

  // 4. Advice
  sections.push('\n\n### 4. 맞춤 조언\n');
  sections.push('당신의 강점을 활용하면서 성장 영역에 조금씩 도전해보세요. 작은 변화가 큰 성장으로 이어질 수 있습니다. 자신만의 속도로 나아가되, 새로운 가능성에 열린 마음을 유지하세요.');

  return sections.join('');
}

/**
 * Get Big5 factor interpretation
 * 
 * @param factor - Big5 factor name
 * @param percentile - Percentile score (0-100)
 * @returns Interpretation text
 */
export function interpretBig5Factor(
  factor: 'O' | 'C' | 'E' | 'A' | 'N',
  percentile: number
): string {
  const interpretations: Record<string, { high: string; low: string; mid: string }> = {
    O: {
      high: '새로운 아이디어와 경험에 매우 개방적입니다. 창의적이고 호기심이 많습니다.',
      mid: '실용성과 창의성의 균형을 잘 맞춥니다.',
      low: '전통적이고 실용적인 접근을 선호합니다. 검증된 방법을 신뢰합니다.',
    },
    C: {
      high: '매우 성실하고 조직적입니다. 목표 달성을 위해 계획적으로 행동합니다.',
      mid: '유연성과 계획성을 적절히 조화시킵니다.',
      low: '자발적이고 유연한 스타일을 선호합니다. 즉흥적인 결정을 잘 내립니다.',
    },
    E: {
      high: '사교적이고 활동적입니다. 사람들과의 상호작용에서 에너지를 얻습니다.',
      mid: '상황에 따라 외향적/내향적 성향을 유연하게 조절합니다.',
      low: '내향적이고 사려 깊습니다. 혼자만의 시간을 통해 에너지를 충전합니다.',
    },
    A: {
      high: '협력적이고 공감 능력이 뛰어납니다. 타인을 배려하고 조화를 중시합니다.',
      mid: '협력과 자기주장 사이의 균형을 잘 맞춥니다.',
      low: '경쟁적이고 독립적입니다. 자신의 의견을 명확히 표현합니다.',
    },
    N: {
      high: '감정적으로 민감하고 스트레스에 영향을 많이 받습니다. 세심한 주의가 필요합니다.',
      mid: '정서적으로 안정적이면서도 상황에 적절히 반응합니다.',
      low: '정서적으로 매우 안정적입니다. 스트레스 상황에서도 침착함을 유지합니다.',
    },
  };

  const interpretation = interpretations[factor];
  if (percentile > 60) return interpretation.high;
  if (percentile < 40) return interpretation.low;
  return interpretation.mid;
}

/**
 * Generate rich, AI-powered Inner9 detailed story
 * 
 * @param inner9Scores - Inner9 dimension scores
 * @param personalityType - Personality type (visionary, achiever, empath, innovator, balanced)
 * @param topDimension - Highest scoring dimension [key, score]
 * @param lowDimension - Lowest scoring dimension [key, score]
 * @param avg - Average score across all dimensions
 * @param mbti - Optional MBTI type
 * @returns AI-generated detailed story (500-800 characters)
 */
export async function generateInner9DetailedStory(
  inner9Scores: Record<string, number>,
  personalityType: string,
  topDimension: [string, number],
  lowDimension: [string, number],
  avg: number,
  mbti?: string
): Promise<string> {
  console.log('🤖 [generateInner9DetailedStory] Starting AI story generation...');

  const openai = getOpenAIClient();

  const topKey = topDimension[0];
  const topScore = Math.round(topDimension[1]);
  const lowKey = lowDimension[0];
  const lowScore = Math.round(lowDimension[1]);

  const topLabel = INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label || topKey;
  const lowLabel = INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label || lowKey;

  const personalityTypeLabels: Record<string, string> = {
    visionary: '비전형 인재',
    achiever: '성취형 인재',
    empath: '감성형 인재',
    innovator: '혁신형 인재',
    balanced: '조화형 인재'
  };

  const prompt = `
당신은 전문 심리 분석가이자 커리어 코치입니다. 
사용자의 Inner9 분석 결과를 바탕으로 개인화되고 풍성한 해설을 작성해주세요.

## 분석 데이터

**성격 유형**: ${personalityTypeLabels[personalityType] || '조화형 인재'}
**MBTI**: ${mbti || '정보 없음'}
**전체 평균 점수**: ${avg}점

**가장 강한 영역**: ${topLabel} (${topScore}점)
**성장 영역**: ${lowLabel} (${lowScore}점)

**Inner9 상세 점수**:
${Object.entries(inner9Scores)
  .map(([key, score]) => `- ${INNER9_DESCRIPTIONS[key as keyof typeof INNER9_DESCRIPTIONS]?.label || key}: ${Math.round(score)}점`)
  .join('\n')}

## 요청사항

다음 구조로 **3-4개 단락**의 풍성한 해설을 작성해주세요:

### 첫 번째 단락: 성격 유형 소개 및 전반적 특성
- 이 사람이 어떤 유형의 인재인지 구체적으로 설명
- 전체 평균 점수(${avg}점)가 의미하는 바
- 2-3문장

### 두 번째 단락: 가장 강한 영역(${topLabel}) 심층 분석
- ${topScore}점이 어느 정도 수준인지 (예: 상위 5%, 평균 이상 등)
- 이 강점이 실제 생활/업무에서 어떻게 나타나는지
- 이 강점이 주는 가치와 영향력
- 3-4문장

### 세 번째 단락: 성장 영역(${lowLabel}) 기회 제시
- ${lowScore}점의 의미 (약점이 아닌 성장 기회로 프레이밍)
- 이 영역을 발전시키면 어떤 변화가 있을지
- 구체적인 성장 방향 제시
- 3-4문장

### 네 번째 단락 (선택): 미래 비전
- 강점을 유지하면서 성장 영역을 발전시켰을 때의 모습
- 완성된 인재상
- 1-2문장

**중요 가이드라인**:
1. 긍정적이고 격려하는 톤 유지
2. 구체적인 예시와 비유 사용
3. "상위 X%", "평균 이상" 등 객관적 지표 포함
4. 전문적이면서도 따뜻한 언어
5. **각 단락을 명확히 구분: 단락 사이에 빈 줄 2개 (줄바꿈 2번)**
6. **각 단락 내에서는 문장 간 자연스러운 흐름 유지**
7. 총 길이: 500-800자

**형식 예시**:
당신은 비전형 인재로서...첫 번째 단락 내용...

두 번째 단락 시작...강점 분석...

세 번째 단락 시작...성장 기회...

네 번째 단락 시작...미래 비전...

**중요**: 마크다운 없이 순수 텍스트로 작성. 단락 구분은 반드시 빈 줄 2개로.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8, // 창의성 높임
      max_tokens: 1200,
    });

    const story = completion.choices[0].message?.content?.trim() ?? '';

    console.log('✅ [generateInner9DetailedStory] AI story generated');
    console.log('📝 [generateInner9DetailedStory] Story length:', story.length, 'chars');

    return story;
  } catch (error) {
    console.error('❌ [generateInner9DetailedStory] Failed:', error);
    
    // Fallback to simple story if AI fails
    return `당신은 ${personalityTypeLabels[personalityType] || '조화형 인재'}로서 전반적으로 균형 잡힌 성향을 보입니다. 특히 ${topLabel} 영역에서 ${topScore}점의 강점을 보이며, ${lowLabel} 영역(${lowScore}점)의 발전을 통해 더욱 완성도 높은 인재가 될 수 있습니다.`;
  }
}

