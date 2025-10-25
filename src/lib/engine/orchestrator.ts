/**
 * 분석 엔진 오케스트레이터
 * 55문항 응답을 받아 Big5, MBTI, RETI, Inner9를 동시에 산출
 */

import { toBig5, Big5Scores } from './big5';
import { toMBTI } from './mbti';
import { toRETI } from './reti';
import { toInner9, Inner9Result } from './inner9';

export type RawResponse = number[]; // 길이 55, 1~7 Likert 등
export type FullResult = {
  big5: Big5Scores; // 0~100
  mbti: string; // ESFP 등
  reti: number; // 1~9
  inner9: Inner9Result; // 9축 0~100
  timestamp: string; // 동시 생성 보장
};

export type Weights = {
  big5: number;
  mbti: number;
  reti: number;
};

/**
 * 55문항 응답을 모든 분석 결과로 변환
 * @param responses 55개 문항 응답 (1~7 Likert 스케일)
 * @param opts 가중치 옵션
 * @returns 모든 분석 결과
 */
export function runAll(responses: RawResponse, opts?: {
  weights?: Weights;
}): FullResult {
  // 입력 길이 최소 가드
  if (!Array.isArray(responses) || responses.length < 55) {
    throw new Error(`Invalid responses length: ${responses?.length}. Expected 55.`);
  }

  // 모든 응답이 1~7 범위인지 검증
  for (let i = 0; i < responses.length; i++) {
    if (responses[i] < 1 || responses[i] > 7 || !Number.isInteger(responses[i])) {
      throw new Error(`문항 ${i + 1}의 응답이 유효하지 않습니다: ${responses[i]}`);
    }
  }

  const timestamp = new Date().toISOString();
  const weights = opts?.weights || { big5: 1, mbti: 0.5, reti: 0.5 };

  // 1단계: Big5 분석
  const big5 = toBig5(responses);
  
  // 2단계: MBTI 분석 (Big5 기반)
  const mbti = toMBTI({ big5, responses });
  
  // 3단계: RETI 분석 (Big5 기반)
  const reti = toRETI({ big5, responses });
  
  // 4단계: Inner9 분석 (모든 결과 융합)
  const inner9 = toInner9({ big5, mbti, reti, weights });

  return {
    big5,
    mbti,
    reti,
    inner9,
    timestamp
  };
}

/**
 * 배치 분석 (여러 응답을 한번에 처리)
 */
export function runBatch(responsesList: RawResponse[], opts?: {
  weights?: Weights;
}): FullResult[] {
  return responsesList.map(responses => runAll(responses, opts));
}

/**
 * 분석 결과 검증
 */
export function validateResult(result: FullResult): boolean {
  // Big5 점수 범위 검증
  const big5Values = Object.values(result.big5);
  if (big5Values.some(v => v < 0 || v > 100)) {
    return false;
  }

  // MBTI 형식 검증
  if (!/^[EI][SN][TF][PJ]$/.test(result.mbti)) {
    return false;
  }

  // RETI 범위 검증
  if (result.reti < 1 || result.reti > 9) {
    return false;
  }

  // Inner9 점수 범위 검증
  if (result.inner9.length !== 9) {
    return false;
  }
  if (result.inner9.some(axis => axis.value < 0 || axis.value > 100)) {
    return false;
  }

  return true;
}
