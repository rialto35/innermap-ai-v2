/**
 * Report Engine
 * 
 * LLM 기반 심층 리포트 생성
 * - Big5, MBTI, RETI 결과를 내러티브로 변환
 * - 성장 경로 및 인사이트 제공
 * 
 * @version v1.1.0
 */

import type { Big5Scores } from './types';

// Temporary type definitions (TODO: move to types.ts)
interface MbtiResult {
  type: string;
  confidence: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
  raw?: any;
}

interface RetiResult {
  primaryType: string;
  secondaryType?: string;
  confidence: number;
  rawScores: Record<string, number>;
}

export interface ReportInput {
  // 핵심 점수
  big5: Big5Scores;
  mbti: MbtiResult;
  reti: RetiResult;
  
  // 영웅 정보
  hero: {
    id: string;
    name: string;
    traits: string[];
  };
  
  // 보조 척도 (선택)
  auxiliary?: {
    sdt?: { autonomy: number; competence: number; relatedness: number };
    affect?: { positive: number; negative: number };
    flow?: number;
    selfEsteem?: number;
    empathy?: number;
  };
  
  // 사용자 정보
  userName?: string;
  birthDate?: string;
}

export interface ReportOutput {
  sections: ReportSection[];
  metadata: {
    version: string;
    generatedAt: string;
    model: string;
    tokens: number;
  };
}

export interface ReportSection {
  id: string;
  title: string;
  content: string; // Markdown
  order: number;
}

/**
 * LLM 프롬프트 생성
 */
export function generateReportPrompt(input: ReportInput): {
  system: string;
  user: string;
} {
  const { big5, mbti, reti, hero, auxiliary, userName } = input;
  
  const system = `당신은 성격심리학과 조직심리에 전문지식을 가진 AI 컨설턴트입니다.
사용자가 검사한 Big5, MBTI, RETI, 보조척도 결과를 바탕으로
'현재 성향 요약', '강점과 성장 가능성', '적합 환경', '성장 경로'를
따뜻하고 분석적인 톤으로 작성하세요.

결과는 반드시 다음 JSON 형식으로 반환하세요:
{
  "sections": [
    {
      "id": "overview",
      "title": "당신의 핵심 성향",
      "content": "Markdown 형식의 내용...",
      "order": 1
    },
    {
      "id": "strengths",
      "title": "강점과 잠재력",
      "content": "Markdown 형식의 내용...",
      "order": 2
    },
    {
      "id": "advice",
      "title": "이 시기에 도움이 되는 조언",
      "content": "Markdown 형식의 내용...",
      "order": 3
    },
    {
      "id": "growth",
      "title": "성장 경로 지도",
      "content": "Markdown 형식의 내용...",
      "order": 4
    }
  ]
}

작성 가이드라인:
- 각 섹션은 200-400자 정도로 작성
- 구체적인 예시와 함께 설명
- 긍정적이고 성장 지향적인 톤 유지
- 전문 용어는 쉽게 풀어서 설명
- 한국어로 작성`;

  const user = `${userName ? `사용자 이름: ${userName}\n` : ''}
**Big5 성격 특성:**
- 개방성 (Openness): ${big5.openness}/100
- 성실성 (Conscientiousness): ${big5.conscientiousness}/100
- 외향성 (Extraversion): ${big5.extraversion}/100
- 친화성 (Agreeableness): ${big5.agreeableness}/100
- 신경성 (Neuroticism): ${big5.neuroticism}/100

**MBTI 유형:**
- 유형: ${mbti.type}
- 신뢰도: E/I ${Math.round(mbti.confidence.EI * 100)}%, S/N ${Math.round(mbti.confidence.SN * 100)}%, T/F ${Math.round(mbti.confidence.TF * 100)}%, J/P ${Math.round(mbti.confidence.JP * 100)}%

**RETI (에니어그램) 유형:**
- 주 유형: Type ${reti.primaryType}
${reti.secondaryType ? `- 보조 유형: Type ${reti.secondaryType}` : ''}
- 신뢰도: ${Math.round(reti.confidence * 100)}%

**영웅 아이덴티티:**
- 이름: ${hero.name}
- 특성: ${hero.traits.join(', ')}

${auxiliary ? `
**보조 심리 척도:**
${auxiliary.sdt ? `- 자기결정성: 자율성 ${auxiliary.sdt.autonomy}/100, 유능감 ${auxiliary.sdt.competence}/100, 관계성 ${auxiliary.sdt.relatedness}/100` : ''}
${auxiliary.affect ? `- 정서: 긍정 ${auxiliary.affect.positive}/100, 부정 ${auxiliary.affect.negative}/100` : ''}
${auxiliary.flow !== undefined ? `- 몰입: ${auxiliary.flow}/100` : ''}
${auxiliary.selfEsteem !== undefined ? `- 자존감: ${auxiliary.selfEsteem}/100` : ''}
${auxiliary.empathy !== undefined ? `- 공감: ${auxiliary.empathy}/100` : ''}
` : ''}

위 결과를 종합하여 4개 섹션의 심층 리포트를 JSON 형식으로 작성해주세요.`;

  return { system, user };
}

/**
 * 점수 레벨 해석
 */
export function interpretScore(score: number): string {
  if (score < 20) return '매우 낮음';
  if (score < 40) return '낮음';
  if (score < 60) return '보통';
  if (score < 80) return '높음';
  return '매우 높음';
}

/**
 * Big5 주요 특성 추출
 */
export function extractBig5Highlights(big5: Big5Scores): {
  strengths: Array<{ trait: string; score: number; label: string }>;
  balanced: Array<{ trait: string; score: number; label: string }>;
} {
  const traits = [
    { key: 'openness', label: '개방성', score: big5.openness },
    { key: 'conscientiousness', label: '성실성', score: big5.conscientiousness },
    { key: 'extraversion', label: '외향성', score: big5.extraversion },
    { key: 'agreeableness', label: '친화성', score: big5.agreeableness },
    { key: 'neuroticism', label: '신경성', score: big5.neuroticism }
  ];

  const strengths = traits.filter(t => t.score >= 70).map(t => ({
    trait: t.key,
    score: t.score,
    label: t.label
  }));

  const balanced = traits.filter(t => t.score >= 40 && t.score < 70).map(t => ({
    trait: t.key,
    score: t.score,
    label: t.label
  }));

  return { strengths, balanced };
}

/**
 * 리포트 메타데이터 생성
 */
export function createReportMetadata(model: string, tokens: number): ReportOutput['metadata'] {
  return {
    version: 'v1.1.0',
    generatedAt: new Date().toISOString(),
    model,
    tokens
  };
}

