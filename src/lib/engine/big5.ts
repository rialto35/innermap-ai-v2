/**
 * Big5 성격 분석 엔진
 * 55문항 응답을 Big5 점수로 변환
 */

import { normalizeLikert, normalizeBig5 } from './normalization';

export type Big5Scores = {
  o: number; // Openness (개방성)
  c: number; // Conscientiousness (성실성)
  e: number; // Extraversion (외향성)
  a: number; // Agreeableness (친화성)
  n: number; // Neuroticism (신경성)
};

/**
 * 55문항 응답을 Big5 점수로 변환
 * @param responses 55개 문항 응답 (1~7 Likert 스케일)
 * @returns Big5 점수 (0~100)
 */
export function toBig5(responses: number[]): Big5Scores {
  if (responses.length !== 55) {
    throw new Error('응답은 정확히 55개여야 합니다');
  }

  // Big5 문항 매핑 (실제 구현에서는 문항별 가중치 적용)
  const opennessItems = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51]; // 11개
  const conscientiousnessItems = [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52]; // 11개
  const extraversionItems = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53]; // 11개
  const agreeablenessItems = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54]; // 11개
  const neuroticismItems = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; // 11개

  // 각 차원별 평균 계산
  const openness = opennessItems.reduce((sum, idx) => sum + responses[idx - 1], 0) / opennessItems.length;
  const conscientiousness = conscientiousnessItems.reduce((sum, idx) => sum + responses[idx - 1], 0) / conscientiousnessItems.length;
  const extraversion = extraversionItems.reduce((sum, idx) => sum + responses[idx - 1], 0) / extraversionItems.length;
  const agreeableness = agreeablenessItems.reduce((sum, idx) => sum + responses[idx - 1], 0) / agreeablenessItems.length;
  const neuroticism = neuroticismItems.reduce((sum, idx) => sum + responses[idx - 1], 0) / neuroticismItems.length;

  // Likert 스케일을 0~100으로 정규화
  const scores = {
    o: normalizeLikert(openness),
    c: normalizeLikert(conscientiousness),
    e: normalizeLikert(extraversion),
    a: normalizeLikert(agreeableness),
    n: normalizeLikert(neuroticism)
  };

  return normalizeBig5(scores);
}
