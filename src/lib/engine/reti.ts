/**
 * RETI (Reiss-Epstein Type Indicator) 분석 엔진
 * Big5 점수와 추가 문항을 기반으로 RETI 유형 결정
 */

import { Big5Scores } from './big5';
import { normalizeLikert, normalizeLikertAvg } from './normalization';

export type RETIDimensions = {
  power: number;      // 권력/지배
  independence: number; // 독립성
  curiosity: number;   // 호기심
  acceptance: number;  // 수용성
  order: number;       // 질서
  saving: number;     // 절약
  honor: number;      // 명예
  idealism: number;   // 이상주의
  social: number;     // 사회성
  family: number;     // 가족
  status: number;     // 지위
  vengeance: number;  // 복수
  romance: number;    // 로맨스
  eating: number;     // 식욕
  physical: number;   // 신체활동
  tranquility: number; // 평온
};

/**
 * Big5 점수를 RETI 차원으로 변환
 */
export function big5ToRETIDimensions(big5: Big5Scores): RETIDimensions {
  return {
    power: (big5.e + big5.c) / 2,
    independence: (100 - big5.a + big5.o) / 2,
    curiosity: big5.o,
    acceptance: big5.a,
    order: big5.c,
    saving: (100 - big5.o + big5.c) / 2,
    honor: (big5.c + big5.a) / 2,
    idealism: (big5.o + big5.a) / 2,
    social: big5.e,
    family: (big5.a + big5.c) / 2,
    status: (big5.e + big5.c) / 2,
    vengeance: (100 - big5.a + big5.n) / 2,
    romance: (big5.e + big5.a) / 2,
    eating: 50, // 중립값 (Big5와 직접적 상관 없음)
    physical: (big5.e + 100 - big5.n) / 2,
    tranquility: (100 - big5.n + big5.a) / 2
  };
}

/**
 * RETI 차원을 1~9 유형으로 변환
 */
export function dimensionsToRETI(dims: RETIDimensions): number {
  // 가장 높은 차원 3개를 찾아서 가중 평균
  const sortedDims = Object.entries(dims)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
  
  const top3 = sortedDims.slice(0, 3);
  const weights = [0.5, 0.3, 0.2]; // 가중치
  
  const weightedSum = top3.reduce((sum, item, index) => {
    return sum + item.value * weights[index];
  }, 0);
  
  // 1~9 스케일로 변환
  return Math.round((weightedSum / 100) * 8) + 1;
}

/**
 * Big5 점수와 응답을 기반으로 RETI 유형 결정
 */
export function toRETI({ big5, responses }: { big5: Big5Scores; responses: number[] }): number {
  // 예시: 추가 문항 일부를 평균내어 1~9 매핑
  const core = normalizeLikertAvg(responses.slice(30, 35)); // 31~35번 예시
  const score01 = Math.min(1, Math.max(0, 0.5 * core + 0.5 * (big5.e / 100))); // 임시 예시
  const reti = Math.max(1, Math.min(9, Math.round(score01 * 8 + 1)));
  return reti;
}
