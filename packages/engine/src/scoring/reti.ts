/**
 * RETI (Enneagram) Scoring
 * 
 * 에니어그램 9가지 성격 유형 점수 계산
 * 
 * @version v1.0.0
 * @reference src/lib/scoring.ts
 */

import type { RETIScores, RETIType, Answer, MBTIScores, Big5Scores } from '../types';
import { softmax } from './huber';

/**
 * RETI 원점수
 */
export interface RETIRawScores {
  r1: number; // 개혁가
  r2: number; // 조력자
  r3: number; // 성취자
  r4: number; // 예술가
  r5: number; // 사색가
  r6: number; // 충성가
  r7: number; // 열정가
  r8: number; // 도전자
  r9: number; // 중재자
}

/**
 * RETI 점수 계산
 */
export function calculateRETI(
  answers: Answer[],
  weights: Record<string, Partial<RETIRawScores>>
): RETIScores {
  const raw: RETIRawScores = {
    r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r8: 0, r9: 0
  };

  // 가중합 계산
  for (const answer of answers) {
    const weight = weights[answer.questionId];
    if (!weight) continue;

    const normalized = (answer.value - 3) / 2; // 5점 척도

    for (const type of Object.keys(weight) as Array<keyof RETIRawScores>) {
      const w = weight[type];
      if (w !== undefined) {
        raw[type] += normalized * w;
      }
    }
  }

  // 점수 정규화
  const scores = softmax(Object.values(raw));
  const scaledScores: Record<RETIType, number> = {
    '1': Math.round(scores[0] * 100),
    '2': Math.round(scores[1] * 100),
    '3': Math.round(scores[2] * 100),
    '4': Math.round(scores[3] * 100),
    '5': Math.round(scores[4] * 100),
    '6': Math.round(scores[5] * 100),
    '7': Math.round(scores[6] * 100),
    '8': Math.round(scores[7] * 100),
    '9': Math.round(scores[8] * 100),
  };

  // Top 2 찾기
  const entries = Object.entries(scaledScores) as Array<[RETIType, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  
  const [primary, secondary] = entries;
  const wing = Math.abs(parseInt(primary[0]) - parseInt(secondary[0])) === 1 
    ? secondary[0] 
    : undefined;

  return {
    primaryType: primary[0],
    wing,
    scores: scaledScores,
    confidence: primary[1] / 100
  };
}

/**
 * RETI 타이브레이커
 * MBTI + Big5 정보로 유사 점수 구분
 */
export function retiTieBreaker(
  reti: RETIScores,
  mbti: MBTIScores,
  big5: Big5Scores
): RETIType {
  const { primaryType, scores } = reti;
  
  // Top 2 점수 차이가 5점 미만이면 타이브레이킹
  const entries = Object.entries(scores) as Array<[RETIType, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  
  if (entries[1][1] - entries[0][1] > 5) {
    return primaryType; // 차이가 크면 그대로 반환
  }

  // MBTI + Big5 기반 타이브레이킹 로직
  const mbtiType = mbti.type;
  const E = big5.extraversion;
  const C = big5.conscientiousness;
  const O = big5.openness;
  const N = big5.neuroticism;

  // 예시 타이브레이킹 규칙
  if (mbtiType.startsWith('ENF') && primaryType === '7') {
    if (E > 70 && C > 50 && N < 30) return '8';
  }
  if (mbtiType.startsWith('EN') && primaryType === '7') {
    if (E > 65 && C > 60 && O < 40) return '3';
  }

  return primaryType;
}
