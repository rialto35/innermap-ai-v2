/**
 * Inner9 내면 나침반 분석 엔진
 * Big5, MBTI, RETI를 융합하여 9축 내면 지도 생성
 */

import { Big5Scores } from './big5';
import { RawResponse } from './types';

export type Inner9Axis = { label: string; value: number };

export type Inner9Config = {
  weights?: { big5: number; mbti: number; reti: number };
};

/**
 * Big5, MBTI, RETI를 융합하여 Inner9 9축 계산
 */
export function toInner9(data: {
  big5: Big5Scores;
  mbti: string;
  reti: number;
  weights?: { big5: number; mbti: number; reti: number };
}): Inner9Axis[] {
  const { big5, mbti, reti, weights = { big5: 1, mbti: 0.5, reti: 0.5 } } = data;

  // Simplified mapping for Inner9 axes based on Big5, MBTI, and RETI
  // In a real system, this would be a more complex weighted matrix multiplication
  const inner9Scores: { [key: string]: number } = {
    creation: big5.o * weights.big5 + (mbti.includes('N') ? 10 : 0) * weights.mbti,
    balance: (100 - Math.abs(big5.e - big5.c)) * weights.big5 + (mbti.includes('J') ? 5 : 0) * weights.mbti,
    intuition: big5.o * weights.big5 + (mbti.includes('N') ? 15 : 0) * weights.mbti,
    analysis: big5.c * weights.big5 + (mbti.includes('T') ? 10 : 0) * weights.mbti,
    harmony: big5.a * weights.big5 + (mbti.includes('F') ? 15 : 0) * weights.mbti,
    drive: big5.e * weights.big5 + (reti > 5 ? 10 : 0) * weights.reti,
    reflection: (100 - big5.n) * weights.big5 + (mbti.includes('I') ? 5 : 0) * weights.mbti,
    empathy: big5.a * weights.big5 + (mbti.includes('F') ? 10 : 0) * weights.mbti,
    discipline: big5.c * weights.big5 + (reti < 5 ? 10 : 0) * weights.reti,
  };

  return Object.entries(inner9Scores).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize for display
    value: Math.max(0, Math.min(100, value)), // 0~100 클리핑
  }));
}