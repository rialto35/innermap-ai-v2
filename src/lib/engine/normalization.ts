/**
 * 정규화 및 클리핑 유틸리티
 * 모든 점수를 0~100 범위로 정규화
 */

// 범용 유틸
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Likert 1~7 → 0~1 정규화
export const normalizeLikert = (v: number, min = 1, max = 7) => {
  if (Number.isNaN(v)) return 0.5;
  return clamp((v - min) / (max - min), 0, 1);
};

// Likert 배열 평균 → 0~1
export const normalizeLikertAvg = (arr: number[], min = 1, max = 7) => {
  if (!arr?.length) return 0.5;
  const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
  return normalizeLikert(avg, min, max);
};

// 0~1 → 0~100
export const to100 = (v: number) => Math.round(clamp(v, 0, 1) * 100);

// 안전 가드: 0~100 클리핑
export const clip100 = (v: number) => Math.min(100, Math.max(0, v));

export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50; // 중립값
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

export function clip(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function round(value: number, decimals: number = 1): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Big5 점수 정규화
 */
export function normalizeBig5(scores: { o: number; c: number; e: number; a: number; n: number }) {
  return {
    o: clip(round(scores.o)),
    c: clip(round(scores.c)),
    e: clip(round(scores.e)),
    a: clip(round(scores.a)),
    n: clip(round(scores.n))
  };
}
