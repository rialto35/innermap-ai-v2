/**
 * Report Engine
 * 
 * LLM 기반 심층 리포트 생성
 * - Big5, MBTI, RETI 결과를 내러티브로 변환
 * - 성장 경로 및 인사이트 제공
 * 
 * @version v1.1.0
 */

import type { Big5Scores, MbtiResult, RetiResult } from './types';

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

/**
 * 시각화 메타데이터 생성
 * 성장 벡터 및 보조척도 프로필
 */
export interface VisualMetadata {
  // 성장 벡터 (Big5 변화 추적)
  growthVector?: {
    from: [number, number, number, number, number]; // [O, C, E, A, N]
    to: [number, number, number, number, number];
    labels: string[];
  };
  
  // 보조 척도 프로필
  auxProfile?: {
    SDT?: number;
    Affect?: number;
    Flow?: number;
    SelfEsteem?: number;
    Empathy?: number;
  };
  
  // Big5 레이더 차트 데이터
  big5Radar: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

/**
 * 시각화 메타 생성 함수
 */
export function buildVisualMetadata(input: {
  big5: Big5Scores;
  auxiliary?: ReportInput['auxiliary'];
  previousBig5?: Big5Scores; // 이전 결과가 있을 경우
}): VisualMetadata {
  const { big5, auxiliary, previousBig5 } = input;
  
  const metadata: VisualMetadata = {
    big5Radar: {
      openness: big5.openness,
      conscientiousness: big5.conscientiousness,
      extraversion: big5.extraversion,
      agreeableness: big5.agreeableness,
      neuroticism: big5.neuroticism
    }
  };
  
  // 성장 벡터 (이전 결과가 있는 경우)
  if (previousBig5) {
    metadata.growthVector = {
      from: [
        previousBig5.openness,
        previousBig5.conscientiousness,
        previousBig5.extraversion,
        previousBig5.agreeableness,
        previousBig5.neuroticism
      ],
      to: [
        big5.openness,
        big5.conscientiousness,
        big5.extraversion,
        big5.agreeableness,
        big5.neuroticism
      ],
      labels: ['개방성', '성실성', '외향성', '친화성', '신경성']
    };
  }
  
  // 보조 척도 프로필
  if (auxiliary) {
    metadata.auxProfile = {};
    
    if (auxiliary.sdt) {
      // SDT 평균값
      metadata.auxProfile.SDT = Math.round(
        (auxiliary.sdt.autonomy + auxiliary.sdt.competence + auxiliary.sdt.relatedness) / 3
      );
    }
    
    if (auxiliary.affect) {
      // Affect 균형 점수 (positive - negative/2)
      metadata.auxProfile.Affect = Math.round(
        auxiliary.affect.positive - (auxiliary.affect.negative / 2)
      );
    }
    
    if (auxiliary.flow !== undefined) {
      metadata.auxProfile.Flow = Math.round(auxiliary.flow);
    }
    
    if (auxiliary.selfEsteem !== undefined) {
      metadata.auxProfile.SelfEsteem = Math.round(auxiliary.selfEsteem);
    }
    
    if (auxiliary.empathy !== undefined) {
      metadata.auxProfile.Empathy = Math.round(auxiliary.empathy);
    }
  }
  
  return metadata;
}

/**
 * LLM 내러티브 프롬프트 (개선된 버전 - PR #5.1)
 */
export function buildNarrativePrompt(input: ReportInput): {
  system: string;
  user: string;
} {
  const { big5, mbti, reti, hero, auxiliary, userName } = input;
  
  const system = `당신은 성격심리학·조직심리·발달심리에 전문성을 가진 컨설턴트입니다.
결과 데이터를 바탕으로 사용자의 현재 성향과 강점, 성장경로를
근거 기반으로 부드럽고 분석적인 톤으로 작성하세요.

문서는 Markdown 섹션으로 구성합니다:
1) 핵심 요약 (100-150단어)
2) 강점과 잠재력 (150-200단어)
3) 현재 주의점 (100-150단어)
4) 환경/관계에서의 팁 (150-200단어)
5) 성장 경로 제안 (실행 가능한 3단계, 200-250단어)

주의사항:
- 과도한 일반화 금지
- 점수는 "높음/보통/낮음"으로 자연어 해석 병기
- 구체적 행동 예시 3개 이상 포함
- 전체 길이: 600~900 단어
- 한국어로 작성
- Markdown 형식 사용 (헤딩, 리스트, 볼드 등)

반드시 다음 형식으로 작성하세요:

# 핵심 요약
[내용]

## 강점과 잠재력
[내용]

## 현재 주의점
[내용]

## 환경과 관계에서의 팁
[내용]

## 성장 경로 제안
### 1단계: [제목]
[내용]

### 2단계: [제목]
[내용]

### 3단계: [제목]
[내용]`;

  const big5Interpretations = [
    `개방성 ${interpretScore(big5.openness)} (${big5.openness}/100)`,
    `성실성 ${interpretScore(big5.conscientiousness)} (${big5.conscientiousness}/100)`,
    `외향성 ${interpretScore(big5.extraversion)} (${big5.extraversion}/100)`,
    `친화성 ${interpretScore(big5.agreeableness)} (${big5.agreeableness}/100)`,
    `신경성 ${interpretScore(big5.neuroticism)} (${big5.neuroticism}/100)`
  ].join(', ');

  const user = `${userName ? `사용자: ${userName}\n` : ''}
## 심리 프로필

**Big5 성격 특성:**
${big5Interpretations}

**MBTI 유형:**
- 유형: ${mbti.type}
- 확신도: E/I ${Math.round(mbti.confidence.EI * 100)}%, S/N ${Math.round(mbti.confidence.SN * 100)}%, T/F ${Math.round(mbti.confidence.TF * 100)}%, J/P ${Math.round(mbti.confidence.JP * 100)}%

**RETI (에니어그램):**
- 주 유형: Type ${reti.primaryType}
${reti.secondaryType ? `- 윙: Type ${reti.secondaryType}` : ''}
- 확신도: ${Math.round(reti.confidence * 100)}%

**영웅 아이덴티티:**
- 이름: ${hero.name}
- 특성: ${hero.traits.join(', ')}

${auxiliary ? `
**보조 심리 척도:**
${auxiliary.sdt ? `- 자기결정성: 자율성 ${interpretScore(auxiliary.sdt.autonomy)} (${auxiliary.sdt.autonomy}/100), 유능감 ${interpretScore(auxiliary.sdt.competence)} (${auxiliary.sdt.competence}/100), 관계성 ${interpretScore(auxiliary.sdt.relatedness)} (${auxiliary.sdt.relatedness}/100)` : ''}
${auxiliary.affect ? `- 정서 균형: 긍정 ${interpretScore(auxiliary.affect.positive)} (${auxiliary.affect.positive}/100), 부정 ${interpretScore(auxiliary.affect.negative)} (${auxiliary.affect.negative}/100)` : ''}
${auxiliary.flow !== undefined ? `- 몰입 경향: ${interpretScore(auxiliary.flow)} (${auxiliary.flow}/100)` : ''}
${auxiliary.selfEsteem !== undefined ? `- 자존감: ${interpretScore(auxiliary.selfEsteem)} (${auxiliary.selfEsteem}/100)` : ''}
${auxiliary.empathy !== undefined ? `- 공감 능력: ${interpretScore(auxiliary.empathy)} (${auxiliary.empathy}/100)` : ''}
` : ''}

위 결과를 종합하여 통찰력 있는 심층 리포트를 Markdown 형식으로 작성해주세요.`;

  return { system, user };
}

