/**
 * MBTI Scoring
 * 
 * Myers-Briggs Type Indicator 점수 계산
 * - E (Extraversion) vs I (Introversion)
 * - S (Sensing) vs N (iNtuition)
 * - T (Thinking) vs F (Feeling)
 * - J (Judging) vs P (Perceiving)
 * 
 * @version v1.0.0
 * @reference src/lib/scoring.ts
 */

import type { MBTIScores, MBTIType, Answer } from '../types';
import { antagonisticCouple, softmax } from './huber';

/**
 * MBTI 원점수 타입
 */
export interface MBTIRawScores {
  E: number;  // Extraversion
  I: number;  // Introversion
  S: number;  // Sensing
  N: number;  // iNtuition
  T: number;  // Thinking
  F: number;  // Feeling
  J: number;  // Judging
  P: number;  // Perceiving
}

/**
 * MBTI 점수 계산
 * 
 * @param answers 사용자 답변
 * @param weights 질문별 MBTI 가중치
 * @returns MBTIScores
 */
export function calculateMBTI(
  answers: Answer[],
  weights: Record<string, Partial<MBTIRawScores>>
): MBTIScores {
  // 원점수 초기화
  const raw: MBTIRawScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  // 가중합 계산
  for (const answer of answers) {
    const weight = weights[answer.questionId];
    if (!weight) continue;

    // 정규화된 값 (-1 ~ +1)
    const normalized = (answer.value - 3) / 2; // 5점 척도 가정

    for (const dim of Object.keys(weight) as Array<keyof MBTIRawScores>) {
      const w = weight[dim];
      if (w !== undefined) {
        raw[dim] += normalized * w;
      }
    }
  }

  // Antagonistic coupling (대립쌍 차이 증폭)
  const [E, I] = antagonisticCouple(raw.E, raw.I);
  const [N, S] = antagonisticCouple(raw.N, raw.S);
  const [T, F] = antagonisticCouple(raw.T, raw.F);
  const [J, P] = antagonisticCouple(raw.J, raw.P);

  // 타입 판정
  const type = determineMBTIType({ E, I, S, N, T, F, J, P });

  // Confidence 계산 (softmax 기반)
  const EI_conf = softmax([E, I]);
  const SN_conf = softmax([S, N]);
  const TF_conf = softmax([T, F]);
  const JP_conf = softmax([J, P]);

  const confidence = Math.min(
    EI_conf[E > I ? 0 : 1],
    SN_conf[N > S ? 0 : 1],
    TF_conf[T > F ? 0 : 1],
    JP_conf[J > P ? 0 : 1]
  );

  return {
    type,
    dimensions: {
      EI: normalizeDimension(E, I),
      SN: normalizeDimension(S, N),
      TF: normalizeDimension(T, F),
      JP: normalizeDimension(J, P)
    },
    confidence
  };
}

/**
 * MBTI 타입 판정
 */
function determineMBTIType(raw: MBTIRawScores): MBTIType {
  const e_i = raw.E >= raw.I ? 'E' : 'I';
  const s_n = raw.N >= raw.S ? 'N' : 'S';
  const t_f = raw.T >= raw.F ? 'T' : 'F';
  const j_p = raw.J >= raw.P ? 'J' : 'P';

  return `${e_i}${s_n}${t_f}${j_p}` as MBTIType;
}

/**
 * 차원 정규화 (-100 ~ +100)
 * 양수는 첫 번째 극, 음수는 두 번째 극
 */
function normalizeDimension(scoreA: number, scoreB: number): number {
  const diff = scoreA - scoreB;
  const total = Math.abs(scoreA) + Math.abs(scoreB);
  
  if (total === 0) return 0;
  
  return Math.round((diff / total) * 100);
}

/**
 * MBTI 설명 가져오기
 */
export function getMBTIDescription(type: MBTIType): {
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
} {
  const descriptions: Record<MBTIType, ReturnType<typeof getMBTIDescription>> = {
    'INTJ': {
      name: '전략가',
      summary: '상상력이 풍부하고 전략적인 사색가',
      strengths: ['분석적', '독립적', '전략적'],
      weaknesses: ['완벽주의', '감정표현 부족']
    },
    'INTP': {
      name: '논리학자',
      summary: '지식을 끊임없이 추구하는 혁신가',
      strengths: ['논리적', '창의적', '개방적'],
      weaknesses: ['우유부단', '과도한 분석']
    },
    'ENTJ': {
      name: '통솔자',
      summary: '대담하고 상상력이 풍부한 지도자',
      strengths: ['리더십', '결단력', '효율성'],
      weaknesses: ['지배적', '완고함']
    },
    'ENTP': {
      name: '변론가',
      summary: '똑똑하고 호기심 많은 사색가',
      strengths: ['혁신적', '적응력', '토론능력'],
      weaknesses: ['논쟁적', '집중력 부족']
    },
    // ... 나머지 12개 타입도 동일한 구조로 정의 가능
    // 간략히 처리를 위해 기본값 반환
  } as any;

  return descriptions[type] || {
    name: type,
    summary: `${type} 성격 유형`,
    strengths: ['분석중'],
    weaknesses: ['분석중']
  };
}
