/**
 * IM-Core v3.0 API 엔드포인트
 * 
 * POST /api/infer/v3
 * - 60문항 응답 → MBTI + Enneagram Top-3 + Inner9
 * - 텔레메트리 로깅
 * - 연구용 베타 (의료/채용 사용 금지)
 */

import { NextRequest, NextResponse } from "next/server";
import { inferOnce } from "@/core/im-core-v3/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 입력 검증
    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "answers 필드가 필요합니다." },
        { status: 400 }
      );
    }
    
    // 문항 수 검증 (60문항)
    const answerCount = Object.keys(body.answers).length;
    if (answerCount !== 60) {
      return NextResponse.json(
        { error: "INVALID_ITEM_COUNT", message: `60문항이 필요합니다. (현재: ${answerCount})` },
        { status: 400 }
      );
    }
    
    const t0 = Date.now();
    
    // v3.0 엔진 실행
    const result = inferOnce(body.answers);
    
    const took = Date.now() - t0;
    
    // 텔레메트리 로깅
    const log = {
      ts: new Date().toISOString(),
      version: "v3.0",
      seed: parseInt(process.env.IM_V3_SEED || "42", 10),
      tau: parseFloat(process.env.IM_V3_TAU || "1.5"),
      result_id: body.result_id ?? null,
      mbti: result.mbti.type,
      mbti_confidence: result.mbti.confidence,
      ennea_primary: result.enneaTop3[0]?.type,
      took_ms: took,
    };
    
    console.log("[IMv3]", JSON.stringify(log));
    
    // 응답
    return NextResponse.json({
      success: true,
      data: result,
      disclaimer: "연구용 베타 버전입니다. 의료/채용 목적 사용 금지. 전문가 상담을 권장합니다.",
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("[IMv3] Error:", error);
    return NextResponse.json(
      { 
        error: "INFERENCE_FAILED", 
        message: error?.message || "추론 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    version: "v3.0",
    status: "active",
    enabled: process.env.IM_V3_ENABLED === "true",
    seed: parseInt(process.env.IM_V3_SEED || "42", 10),
    tau: parseFloat(process.env.IM_V3_TAU || "1.5"),
    disclaimer: "연구용 베타 버전입니다. 의료/채용 목적 사용 금지.",
  });
}

