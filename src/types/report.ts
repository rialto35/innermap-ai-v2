/**
 * Report Contract v1 - 단일 리포트 계약
 * 검사 직후와 내 결과를 동일한 데이터 구조로 처리
 */

export type ReportV1 = {
  id: string;
  ownerId: string;
  meta: {
    version: "v1.0.0" | "v1.1.0" | "v1.3.1";
    engineVersion: string;       // e.g. "IM-Core 1.3.1"
    weightsVersion: string;      // e.g. "v1.3"
    generatedAt: string;         // ISO UTC
  };
  scores: {
    big5: { o: number; c: number; e: number; a: number; n: number }; // 0..100
    mbti: string;  // /^[EI][SN][TF][JP]$/
    reti: number;  // 1..9
    inner9: Array<{ label: string; value: number }>; // 0..100 x 9
  };
  summary: {
    highlight: string;           // 한 문장 요약
    bullets: string[];           // 3~5개 핵심 포인트
  };
  deep?: {
    modules: Record<DeepKey, DeepState>; // "pending" | "running" | "ready" | "error"
    narrative?: string;          // LLM 내러티브 본문(있으면 표시)
    resources?: {
      charts: {
        big5?: string;           // storage URL e.g. reports/<id>/charts/big5.svg
        inner9?: string;
      };
    };
  };
};

export type DeepKey = "cognition" | "communication" | "goal" | "relation" | "energy" | "growth";
export type DeepState = "pending" | "running" | "ready" | "error";

/**
 * API 응답 타입들
 */
export type ReportResponse = ReportV1;
export type ReportListResponse = {
  reports: Array<Pick<ReportV1, 'id' | 'meta' | 'scores' | 'summary'>>;
  total: number;
  hasMore: boolean;
};

export type ShareResponse = {
  shareId: string;
  url: string;
  scope: "summary" | "full";
  expiresAt: string;
};

/**
 * im-core 결과를 ReportV1로 변환하는 헬퍼
 */
export function createReportV1(
  id: string,
  ownerId: string,
  imCoreResult: any,
  summary: { highlight: string; bullets: string[] },
  deep?: Partial<ReportV1['deep']>
): ReportV1 {
  return {
    id,
    ownerId,
    meta: {
      version: "v1.3.1",
      engineVersion: imCoreResult.engineVersion || "IM-Core 1.3.1",
      weightsVersion: imCoreResult.weightsVersion || "v1.3",
      generatedAt: imCoreResult.timestamp || new Date().toISOString()
    },
    scores: {
      big5: imCoreResult.big5,
      mbti: imCoreResult.mbti,
      reti: imCoreResult.reti,
      inner9: imCoreResult.inner9
    },
    summary,
    deep: deep ? {
      modules: {
        cognition: "pending",
        communication: "pending", 
        goal: "pending",
        relation: "pending",
        energy: "pending",
        growth: "pending",
        ...deep.modules
      },
      narrative: deep.narrative,
      resources: deep.resources
    } : undefined
  };
}
