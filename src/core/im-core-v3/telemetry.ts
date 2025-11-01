/**
 * IM-Core v3.0 텔레메트리
 * 
 * 최소 수집 원칙:
 * - PII 저장 금지
 * - 익명/집계만
 * - 성능 및 품질 지표만
 */

export type ImV3Event = {
  // 기본 메타
  ts: string;
  version: string;
  seed: number;
  tau: number;
  
  // 결과 ID (익명)
  result_id?: string | null;
  
  // 추론 결과 (집계용)
  mbti?: string;
  mbti_confidence?: number;
  ennea_primary?: number;
  
  // 보정도 지표 (선택)
  ece_pre?: number | null;
  ece_post?: number | null;
  brier?: number | null;
  auroc?: number | null;
  
  // 성능
  took_ms: number;
  
  // 에러 (있을 경우)
  error?: string | null;
};

/**
 * 텔레메트리 이벤트 생성
 */
export function createTelemetryEvent(
  data: Partial<ImV3Event> & { took_ms: number }
): ImV3Event {
  return {
    ts: new Date().toISOString(),
    version: "v3.0",
    seed: parseInt(process.env.IM_V3_SEED || "42", 10),
    tau: parseFloat(process.env.IM_V3_TAU || "1.5"),
    ...data,
  };
}

/**
 * 텔레메트리 로깅 (콘솔)
 */
export function logTelemetry(event: ImV3Event): void {
  console.log("[IMv3:Telemetry]", JSON.stringify(event));
}

/**
 * 일일 집계 타입
 */
export type DailyAggregate = {
  date: string;
  total_count: number;
  
  // MBTI 분포
  mbti_distribution: Record<string, number>;
  mbti_avg_confidence: number;
  
  // Enneagram 분포
  ennea_distribution: Record<number, number>;
  
  // 성능
  avg_took_ms: number;
  p50_took_ms: number;
  p95_took_ms: number;
  p99_took_ms: number;
  
  // 품질 (있을 경우)
  avg_ece?: number;
  avg_brier?: number;
  avg_auroc?: number;
  
  // 에러율
  error_rate: number;
};

/**
 * 이벤트 배열 → 일일 집계
 */
export function aggregateDaily(events: ImV3Event[]): DailyAggregate {
  const date = events[0]?.ts.slice(0, 10) || new Date().toISOString().slice(0, 10);
  
  // MBTI 분포
  const mbtiDist: Record<string, number> = {};
  let mbtiConfidenceSum = 0;
  let mbtiCount = 0;
  
  // Enneagram 분포
  const enneaDist: Record<number, number> = {};
  
  // 성능
  const tookMs: number[] = [];
  
  // 품질
  let eceSum = 0, eceCount = 0;
  let brierSum = 0, brierCount = 0;
  let aurocSum = 0, aurocCount = 0;
  
  // 에러
  let errorCount = 0;
  
  for (const event of events) {
    // MBTI
    if (event.mbti) {
      mbtiDist[event.mbti] = (mbtiDist[event.mbti] || 0) + 1;
      if (event.mbti_confidence !== undefined) {
        mbtiConfidenceSum += event.mbti_confidence;
        mbtiCount++;
      }
    }
    
    // Enneagram
    if (event.ennea_primary) {
      enneaDist[event.ennea_primary] = (enneaDist[event.ennea_primary] || 0) + 1;
    }
    
    // 성능
    tookMs.push(event.took_ms);
    
    // 품질
    if (event.ece_post !== undefined && event.ece_post !== null) {
      eceSum += event.ece_post;
      eceCount++;
    }
    if (event.brier !== undefined && event.brier !== null) {
      brierSum += event.brier;
      brierCount++;
    }
    if (event.auroc !== undefined && event.auroc !== null) {
      aurocSum += event.auroc;
      aurocCount++;
    }
    
    // 에러
    if (event.error) {
      errorCount++;
    }
  }
  
  // 성능 백분위수
  tookMs.sort((a, b) => a - b);
  const p50 = tookMs[Math.floor(tookMs.length * 0.5)] || 0;
  const p95 = tookMs[Math.floor(tookMs.length * 0.95)] || 0;
  const p99 = tookMs[Math.floor(tookMs.length * 0.99)] || 0;
  
  return {
    date,
    total_count: events.length,
    mbti_distribution: mbtiDist,
    mbti_avg_confidence: mbtiCount > 0 ? mbtiConfidenceSum / mbtiCount : 0,
    ennea_distribution: enneaDist,
    avg_took_ms: tookMs.reduce((a, b) => a + b, 0) / tookMs.length,
    p50_took_ms: p50,
    p95_took_ms: p95,
    p99_took_ms: p99,
    avg_ece: eceCount > 0 ? eceSum / eceCount : undefined,
    avg_brier: brierCount > 0 ? brierSum / brierCount : undefined,
    avg_auroc: aurocCount > 0 ? aurocSum / aurocCount : undefined,
    error_rate: events.length > 0 ? errorCount / events.length : 0,
  };
}

