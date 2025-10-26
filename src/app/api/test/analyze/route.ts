/**
 * Test Analysis API
 * 55문항 답변 → IM-CORE 엔진 분석 → DB 저장
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { runIMCore } from "@/lib/imcore/analyze";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { answers, profile, engineVersion = "imcore-1.0.0" } = await req.json();

    // 입력 검증
    if (!Array.isArray(answers) || answers.length !== 55) {
      return NextResponse.json(
        { error: "INVALID_ANSWERS", message: "55개 문항 답변이 필요합니다." },
        { status: 400 }
      );
    }

    // 사용자 ID (UUID 타입 또는 NULL)
    // - 로그인: session.user.id (Supabase UUID)
    // - 비로그인: null
    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || null;
    const isAnonymous = !userId;

    console.log("📊 [API /test/analyze] Starting analysis", {
      userId: userId || '(anonymous)',
      userEmail: userEmail || '(none)',
      isAnonymous,
      answersLength: answers.length,
      engineVersion,
    });

    // 1) assessments 생성 (비로그인 사용자는 user_id = NULL)
    const { data: assess, error: errAssess } = await supabaseAdmin
      .from("test_assessments")
      .insert({
        user_id: userId, // NULL 허용
        engine_version: engineVersion,
        raw_answers: answers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (errAssess) {
      console.error("❌ [API /test/analyze] Assessment insert error:", errAssess);
      throw errAssess;
    }

    console.log("✅ [API /test/analyze] Assessment created:", assess.id);

    // 2) IM-CORE 엔진 실행
    const output = await runIMCore({ answers, profile, engineVersion });

    console.log("✅ [API /test/analyze] Engine output:", {
      mbti: output.summary.mbti,
      big5: output.summary.big5,
      keywordsCount: output.summary.keywords.length,
    });

    // 3) 결과 저장
    const { error: errRes } = await supabaseAdmin
      .from("test_assessment_results")
      .insert({
        assessment_id: assess.id,
        mbti: output.summary.mbti,
        big5: output.summary.big5,
        keywords: output.summary.keywords,
        inner9: output.premium.inner9,
        world: output.premium.world,
        confidence: output.summary.confidence ?? null,
      });

    if (errRes) {
      console.error("❌ [API /test/analyze] Result insert error:", errRes);
      throw errRes;
    }

    console.log("✅ [API /test/analyze] Result saved");

    // 4) 프로필 저장/업서트 (userId가 UUID일 때만)
    if (userId) {
      const { error: errProfile } = await supabaseAdmin
        .from("user_profiles")
        .upsert({
          user_id: userId, // UUID
          gender: profile?.gender ?? null,
          birthdate: profile?.birthdate ?? null,
          email: profile?.email ?? userEmail, // 프로필 이메일 또는 세션 이메일
          consent_required_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (errProfile) {
        console.warn("⚠️ [API /test/analyze] Profile upsert warning:", errProfile);
        // 프로필 저장 실패는 치명적이지 않음
      } else {
        console.log("✅ [API /test/analyze] Profile saved");
      }
    }

    return NextResponse.json({
      ok: true,
      assessmentId: assess.id,
      summary: output.summary,
    });
  } catch (e: any) {
    console.error("❌ [API /test/analyze] Error:", e);
    return NextResponse.json(
      {
        error: "ANALYZE_FAILED",
        message: e?.message || "분석 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test Analysis API",
    version: "1.0.0",
    engine: "IM-CORE",
    endpoints: {
      POST: "/api/test/analyze - 55문항 분석 실행",
    },
  });
}

