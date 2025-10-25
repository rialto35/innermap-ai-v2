/**
 * Fixed-Point 연산 유틸리티
 * 부동소수점 오차를 방지하기 위한 고정소수점 연산
 */

/**
 * 고정소수점 곱셈 (소수점 2자리)
 */
export function fixedMultiply(a: number, b: number): number {
  return Math.round((a * b) * 100) / 100;
}

/**
 * 고정소수점 나눗셈 (소수점 2자리)
 */
export function fixedDivide(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round((a / b) * 100) / 100;
}

/**
 * 고정소수점 평균 (소수점 2자리)
 */
export function fixedAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return fixedDivide(sum, values.length);
}

/**
 * 고정소수점 가중 평균 (소수점 2자리)
 */
export function fixedWeightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must have the same length');
  }
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < values.length; i++) {
    weightedSum += fixedMultiply(values[i], weights[i]);
    totalWeight += weights[i];
  }
  
  return totalWeight === 0 ? 0 : fixedDivide(weightedSum, totalWeight);
}

/**
 * 고정소수점 정규화 (0~100 범위)
 */
export function fixedNormalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  const normalized = fixedDivide(value - min, max - min);
  return Math.max(0, Math.min(100, Math.round(normalized * 100)));
}

/**
 * 고정소수점 클리핑
 */
export function fixedClip(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}
