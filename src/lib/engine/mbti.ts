/**
 * MBTI 성격 유형 분석 엔진
 * Big5 점수와 55문항 응답을 기반으로 MBTI 유형 결정
 */

import { Big5Scores } from './big5';
import { normalizeLikert, normalizeLikertAvg } from './normalization';

export type MBTIDimensions = {
  E: number; // Extraversion vs Introversion
  S: number; // Sensing vs Intuition  
  T: number; // Thinking vs Feeling
  P: number; // Perceiving vs Judging
};

type Dims = { E: number; S: number; T: number; J: number }; // 각 0~1 스케일 가정

/**
 * Big5 점수를 MBTI 차원으로 변환
 */
export function big5ToMBTIDimensions(big5: Big5Scores): MBTIDimensions {
  // Big5 → MBTI 매핑 공식
  const E = big5.e; // Extraversion 직접 매핑
  const S = (big5.c + big5.a) / 2; // Sensing (성실성 + 친화성)
  const T = (100 - big5.a + big5.c) / 2; // Thinking (친화성 역상관 + 성실성)
  const P = (100 - big5.c + big5.o) / 2; // Perceiving (성실성 역상관 + 개방성)
  
  return { E, S, T, P };
}

/**
 * MBTI 차원을 4글자 유형으로 변환
 */
export function dimensionsToMBTI(dims: MBTIDimensions): string {
  const E = dims.E > 50 ? 'E' : 'I';
  const S = dims.S > 50 ? 'S' : 'N';
  const T = dims.T > 50 ? 'T' : 'F';
  const P = dims.P > 50 ? 'P' : 'J';
  
  return E + S + T + P;
}

/**
 * Big5 점수와 응답을 기반으로 MBTI 유형 결정
 */
export function toMBTI({ big5, responses }: { big5: Big5Scores; responses: number[] }): string {
  // 예시: Big5와 문항 일부를 혼합하는 경우
  // (실제 가중치는 기존 로직을 유지하고, normalizeLikert*만 적용)
  const dims: Dims = {
    E: clamp01(big5.e / 100),
    S: clamp01((100 - big5.o) / 100),
    T: clamp01((100 - big5.a) / 100),
    J: clamp01(big5.c / 100),
  };

  // 선택적으로 추가 문항 평균(1~7)을 0~1로 합성
  if (responses?.length >= 30) {
    const additionalE = normalizeLikertAvg(responses.slice(20, 25)); // 21~25번
    const additionalS = normalizeLikertAvg(responses.slice(25, 30)); // 26~30번
    dims.E = (dims.E + additionalE) / 2;
    dims.S = (dims.S + additionalS) / 2;
  }

  // 이진 분기
  const I = dims.E < 0.5, N = dims.S < 0.5, F = dims.T < 0.5, P = dims.J < 0.5;
  const mbti = `${I ? "I" : "E"}${N ? "N" : "S"}${F ? "F" : "T"}${P ? "P" : "J"}`;

  return mbti;
}

// 내부 유틸 (로컬)
function clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
