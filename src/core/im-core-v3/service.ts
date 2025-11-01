/**
 * IM-Core v3.0 서비스 레이어
 * 
 * 단건 추론 및 메타데이터 생성
 */

import { runIMCoreV3 } from "./index";
import type { EngineResultV3 } from "./types";

export type InferOnceInput = {
  answers: Record<number, 1 | 2 | 3 | 4 | 5>;
  result_id?: string | null;
};

export type InferOnceOutput = {
  mbti: {
    type: string;
    confidence: number;
    confidenceLevel: "낮음" | "보통" | "높음";
  };
  enneaTop3: Array<{
    type: number;
    probability: number;
    confidence: "high" | "medium" | "low";
  }>;
  inner9: {
    탐구심: number;
    자기통제: number;
    사회관계: number;
    리더십: number;
    협업성: number;
    정서안정: number;
    회복탄력: number;
    몰입: number;
    성장동기: number;
  };
  meta: {
    version: string;
    timestamp: string;
    itemCount: number;
    flags: string[];
    warnings: string[];
    metrics?: {
      ece_pre?: number;
      ece_post?: number;
      brier?: number;
      auroc?: number;
    };
  };
};

/**
 * 단건 추론 (60문항 → MBTI + Enneagram + Inner9)
 */
export function inferOnce(answers: Record<number, 1 | 2 | 3 | 4 | 5>): InferOnceOutput {
  const t0 = Date.now();
  
  // v3.0 엔진 실행
  const result: EngineResultV3 = runIMCoreV3(answers);
  
  // MBTI 신뢰레벨 계산
  const mbtiConfidence = result.mbti.confidence;
  const mbtiConfidenceLevel = 
    mbtiConfidence >= 0.75 ? "높음" : 
    mbtiConfidence >= 0.5 ? "보통" : 
    "낮음";
  
  // Enneagram Top-3 추출
  const enneaTop3 = result.enneagram.candidates
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
  
  const took = Date.now() - t0;
  
  return {
    mbti: {
      type: result.mbti.type,
      confidence: mbtiConfidence,
      confidenceLevel: mbtiConfidenceLevel,
    },
    enneaTop3,
    inner9: result.inner9,
    meta: {
      version: result.version,
      timestamp: result.timestamp,
      itemCount: result.metadata.itemCount,
      flags: result.metadata.flags,
      warnings: result.metadata.warnings,
      metrics: {
        // 추후 calibration 적용 시 추가
      },
    },
  };
}

