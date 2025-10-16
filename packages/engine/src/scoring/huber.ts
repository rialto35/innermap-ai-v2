/**
 * Huber Transformation
 * 
 * 클리핑, 타이브레이킹, 소프트맥스 유틸리티
 * 
 * @version v1.0.0
 * @reference src/lib/scoring.ts (기존 구현 기반)
 */

/**
 * Huber clipping
 * 극단값을 threshold 내로 제한하여 outlier 영향 감소
 * 
 * @param value 원본 값
 * @param threshold 클리핑 임계값 (기본: 0.8)
 * @returns 클리핑된 값
 * 
 * @example
 * huberClip(1.5, 0.8) // => 0.8
 * huberClip(-1.2, 0.8) // => -0.8
 * huberClip(0.3, 0.8) // => 0.3
 */
export function huberClip(value: number, threshold: number = 0.8): number {
  const absValue = Math.abs(value);
  if (absValue <= threshold) {
    return value;
  }
  return Math.sign(value) * threshold;
}

/**
 * Tie-breaker
 * 비슷한 점수들 간 차이를 확대하여 결정 명확성 향상
 * 
 * @param scores 점수 배열
 * @param alpha 차이 증폭 계수 (기본: 0.15)
 * @returns 조정된 점수 배열
 */
export function tieBreaker(scores: number[], alpha: number = 0.15): number[] {
  if (scores.length < 2) return scores;
  
  const result = [...scores];
  const sorted = [...scores].sort((a, b) => b - a);
  const [first, second] = sorted;
  
  const diff = first - second;
  
  // 차이가 작을 때만 증폭
  if (Math.abs(diff) < 0.5) {
    const firstIdx = result.indexOf(first);
    const secondIdx = result.indexOf(second);
    
    if (firstIdx !== -1 && secondIdx !== -1) {
      result[firstIdx] += alpha * diff;
      result[secondIdx] -= alpha * diff;
    }
  }
  
  return result;
}

/**
 * Antagonistic couple
 * 대립 쌍(E-I, S-N, T-F, J-P) 간 차이를 증폭
 * 
 * @param score1 첫 번째 점수
 * @param score2 두 번째 점수 (대립 쌍)
 * @param alpha 증폭 계수 (기본: 0.15)
 * @returns 조정된 [score1, score2]
 */
export function antagonisticCouple(
  score1: number,
  score2: number,
  alpha: number = 0.15
): [number, number] {
  const diff = score1 - score2;
  return [
    score1 + alpha * diff,
    score2 - alpha * diff
  ];
}

/**
 * Softmax
 * 점수 배열을 확률 분포로 변환
 * 
 * @param values 점수 배열
 * @returns 확률 배열 (합 = 1.0)
 * 
 * @example
 * softmax([1.0, 2.0, 3.0]) // => [0.09, 0.24, 0.67]
 */
export function softmax(values: number[]): number[] {
  if (values.length === 0) return [];
  
  // Numerical stability: subtract max
  const maxVal = Math.max(...values);
  const expValues = values.map(v => Math.exp(v - maxVal));
  const sum = expValues.reduce((a, b) => a + b, 0);
  
  return expValues.map(v => v / sum);
}

/**
 * Scale to 0-100
 * [-2, +2] 범위를 0-100으로 스케일링
 * 
 * @param value 원본 값 (보통 -2 ~ +2)
 * @param min 최소값 (기본: -2)
 * @param max 최대값 (기본: +2)
 * @returns 0-100 스케일 점수
 */
export function scaleToHundred(
  value: number,
  min: number = -2,
  max: number = 2
): number {
  const scaled = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

