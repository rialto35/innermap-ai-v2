/**
 * Big5 성격 분석 엔진
 * 55문항 응답을 Big5 점수로 변환
 */

import { RawResponse } from './types';
import { normalizeAndClip } from './normalization';

export type Big5Scores = { o: number; c: number; e: number; a: number; n: number };

/**
 * 55문항 응답을 Big5 점수로 변환
 */
export function toBig5(responses: RawResponse): Big5Scores {
  // Mock implementation for Big5 calculation
  // In a real scenario, this would involve complex psychometric scoring
  const sum = responses.reduce((acc, val) => acc + val, 0);
  const avg = sum / responses.length;

  // 결정적 결과를 위해 Math.random() 대신 응답 기반 계산 사용
  const seed = responses.slice(0, 5).reduce((acc, val) => acc + val, 0);
  
  return {
    o: normalizeAndClip(avg * 10 + (seed % 10), 0, 100), // Openness
    c: normalizeAndClip(avg * 10 + ((seed + 1) % 10), 0, 100), // Conscientiousness
    e: normalizeAndClip(avg * 10 + ((seed + 2) % 10), 0, 100), // Extraversion
    a: normalizeAndClip(avg * 10 + ((seed + 3) % 10), 0, 100), // Agreeableness
    n: normalizeAndClip(avg * 10 + ((seed + 4) % 10), 0, 100), // Neuroticism
  };
}
