/**
 * Test Results API
 * 저장된 분석 결과 조회
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toSummary, toPremium } from "@/lib/resultProjector";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 결과 조회
    const { data: result, error } = await supabaseAdmin
      .from("test_assessment_results")
      .select("*")
      .eq("assessment_id", id)
      .single();

    if (error || !result) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 타입 변환
    const assessmentResult = {
      mbti: result.mbti,
      big5: result.big5,
      keywords: result.keywords,
      confidence: result.confidence,
      inner9: result.inner9,
      world: result.world,
    };

    // 요약 + 심층 분리
    const summary = toSummary(assessmentResult);
    const premium = toPremium(assessmentResult);

    return NextResponse.json({
      ok: true,
      assessmentId: id,
      summary,
      premium,
      createdAt: result.created_at,
    });
  } catch (e: any) {
    console.error("❌ [API /test/results/:id] Error:", e);
    return NextResponse.json(
      { error: "FETCH_FAILED", message: e?.message || "조회 실패" },
      { status: 500 }
    );
  }
}

