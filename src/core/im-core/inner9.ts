/**
 * Inner9 score computation from Big5 percentiles and MBTI ratios
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
  growth: number;       // 성장 (향후 개선)
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(100, Math.round(x)));
}

/**
 * 기본 매핑: 도메인 검증 후 가중치 조정 가능
 */
export function computeInner9Scores(big5: Big5Percentiles, mbti: MbtiRatios): Inner9Scores {
  const creation = clamp01(big5.O);
  const will = clamp01(big5.C);
  const sensitivity = clamp01(big5.N);
  const harmony = clamp01(big5.A);
  const expression = clamp01(big5.E);
  const insight = clamp01((big5.O + big5.A) / 2);
  const resilience = clamp01(100 - big5.N);
  const balance = clamp01((big5.O + big5.C + big5.E + big5.A + big5.N) / 5);
  const growth = 50; // TODO: 성장 벡터 기반 계산 도입

  return { creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth };
}

// 주석: 향후 각 축에 MBTI 축 가중치(EI/SN/TF/JP)를 혼합하는 실험 계획
// 예) expression에 EI 가중, insight에 SN 가중 등



