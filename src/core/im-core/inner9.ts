/**
 * Inner9 score computation from Big5 percentiles and MBTI ratios
 * Enhanced with proper calculations and NaN protection
 */

export type Big5Percentiles = {
  O: number; C: number; E: number; A: number; N: number;
}

export type MbtiRatios = {
  EI: number; SN: number; TF: number; JP: number;
}

export type Inner9Scores = {
  creation: number;     // 창조
  will: number;         // 의지
  sensitivity: number;  // 감수성
  harmony: number;      // 조화
  expression: number;   // 표현
  insight: number;      // 통찰
  resilience: number;   // 회복력
  balance: number;      // 균형
  growth: number;       // 성장
};

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function safeNumber(value: any): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/**
 * Enhanced Inner9 calculation with proper formulas
 * Based on psychological research and domain expertise
 */
export function computeInner9Scores(big5: Big5Percentiles, mbti: MbtiRatios): Inner9Scores {
  // Input validation and NaN protection
  const O = safeNumber(big5.O);
  const C = safeNumber(big5.C);
  const E = safeNumber(big5.E);
  const A = safeNumber(big5.A);
  const N = safeNumber(big5.N);

  // Core dimensions (direct mapping)
  const creation = clamp01(O);
  const will = clamp01(C);
  const sensitivity = clamp01(N);  // 높을수록 예민
  const harmony = clamp01(A);
  const expression = clamp01(E);

  // Derived dimensions (calculated)
  const insight = clamp01((O + (100 - N) * 0.5));  // 창조성 + 정서안정성
  const resilience = clamp01(100 - N);  // 신경성의 역
  const balance = clamp01((O + C + E + A + (100 - N)) / 5);  // 전체 균형
  const growth = clamp01((O * 0.4 + C * 0.3 + (100 - N) * 0.3));  // 성장 잠재력

  // Final normalization to ensure all values are 0-100 integers
  const normalize = (v: number) => Math.round(Math.min(100, Math.max(0, v)));

  const normalizedScores = {
    creation: normalize(creation),
    will: normalize(will),
    sensitivity: normalize(sensitivity),
    harmony: normalize(harmony),
    expression: normalize(expression),
    insight: normalize(insight),
    resilience: normalize(resilience),
    balance: normalize(balance),
    growth: normalize(growth),
  };

  console.log('🔍 [Inner9] Computed scores:', normalizedScores);

  return normalizedScores;
}

/**
 * Validate Inner9 scores for data integrity
 */
export function validateInner9Scores(scores: Inner9Scores): boolean {
  const values = Object.values(scores);
  return values.every(v => Number.isFinite(v) && v >= 0 && v <= 100);
}

/**
 * Get default Inner9 scores (neutral values)
 */
export function getDefaultInner9Scores(): Inner9Scores {
  return {
    creation: 50, will: 50, sensitivity: 50, harmony: 50, expression: 50,
    insight: 50, resilience: 50, balance: 50, growth: 50
  };
}



