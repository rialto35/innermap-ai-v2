/**
 * im-core 엔진 오케스트레이터
 * Double-Buffer Verification 포함
 */

import crypto from 'node:crypto';
import { toBig5 } from './big5';
import { toMBTI } from './mbti';
import { toRETI } from './reti';
import { toInner9 } from './inner9';
import { RawResponse, FullResult, Weights } from './types';

/**
 * 55문항 응답을 모든 분석 결과로 변환 (Double-Buffer Verification 포함)
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

  // Double-Buffer Verification
  const result = computeAll(responses, opts);
  const result2 = computeAll(responses, opts);
  
  // 해시 비교로 결정성 검증 (타임스탬프 제외)
  const result1NoTimestamp = { ...result, timestamp: 'fixed' };
  const result2NoTimestamp = { ...result2, timestamp: 'fixed' };
  
  const hash1 = crypto.createHash("sha1").update(JSON.stringify(result1NoTimestamp)).digest("hex");
  const hash2 = crypto.createHash("sha1").update(JSON.stringify(result2NoTimestamp)).digest("hex");
  
  if (hash1 !== hash2) {
    throw new Error(`Determinism check failed: ${hash1} ≠ ${hash2}`);
  }
  
  return result;
}

/**
 * 실제 계산 로직 (Double-Buffer에서 사용)
 */
function computeAll(responses: RawResponse, opts?: {
  weights?: Weights;
}): FullResult {
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
 * 엔진 상태 확인
 */
export function getEngineStatus() {
  return {
    version: '1.3.1',
    status: 'operational',
    features: ['double-buffer-verification', 'determinism-check', 'cross-validation']
  };
}

/**
 * im-core 결과를 ReportV1 포맷으로 래핑
 */
export function wrapAsReportV1(
  id: string,
  ownerId: string,
  result: FullResult,
  summary: { highlight: string; bullets: string[] }
) {
  return {
    id,
    ownerId,
    meta: {
      version: "v1.3.1" as const,
      engineVersion: "IM-Core 1.3.1",
      weightsVersion: "v1.3",
      generatedAt: result.timestamp
    },
    scores: {
      big5: result.big5,
      mbti: result.mbti,
      reti: result.reti,
      inner9: result.inner9
    },
    summary,
    deep: {
      modules: {
        cognition: "pending" as const,
        communication: "pending" as const,
        goal: "pending" as const,
        relation: "pending" as const,
        energy: "pending" as const,
        growth: "pending" as const
      }
    }
  };
}
