/**
 * Test Assessments List API
 * 로그인 사용자의 검사 목록 조회
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 사용자의 검사 목록 조회 (최신순)
    const { data: assessments, error } = await supabaseAdmin
      .from("test_assessments")
      .select(`
        id,
        engine_version,
        completed_at,
        created_at,
        test_assessment_results (
          mbti,
          big5,
          keywords,
          confidence
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("❌ [API /test/assessments] Error:", error);
      throw error;
    }

    // 결과 포맷팅
    const formattedResults = (assessments || []).map((assessment: any) => {
      const result = assessment.test_assessment_results?.[0];
      return {
        id: assessment.id,
        createdAt: assessment.created_at,
        completedAt: assessment.completed_at,
        engineVersion: assessment.engine_version,
        summary: result
          ? {
              mbti: result.mbti,
              big5: result.big5,
              keywords: result.keywords?.slice(0, 3) || [],
              confidence: result.confidence,
            }
          : null,
      };
    });

    return NextResponse.json({
      ok: true,
      assessments: formattedResults,
      total: formattedResults.length,
    });
  } catch (e: any) {
    console.error("❌ [API /test/assessments] Error:", e);
    return NextResponse.json(
      { error: "FETCH_FAILED", message: e?.message || "조회 실패" },
      { status: 500 }
    );
  }
}

