/**
 * MBTI Refine API
 * 경계 영역 사용자를 위한 3문항 정밀화
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;

    if (!session?.user) {
      return NextResponse.json(
        { error: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { answers, email } = await req.json();

    // 입력 검증
    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "INVALID_ANSWERS", message: "답변 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    console.log("📊 [API /test/refine] Refine request:", {
      email,
      answersCount: Object.keys(answers).length,
    });

    // 3문항 답변 분석
    // Q1 (EI): 0-1 → I, 3-4 → E, 2 → 중립
    // Q2 (SN): 0-1 → S, 3-4 → N, 2 → 중립
    // Q3 (TF): 0-1 → T, 3-4 → F, 2 → 중립

    const q1 = answers[1] ?? 2;
    const q2 = answers[2] ?? 2;
    const q3 = answers[3] ?? 2;

    const EI = q1 <= 1 ? "I" : q1 >= 3 ? "E" : null;
    const SN = q2 <= 1 ? "S" : q2 >= 3 ? "N" : null;
    const TF = q3 <= 1 ? "T" : q3 >= 3 ? "F" : null;

    // 사용자의 최신 분석 결과 조회
    const provider = (session as any)?.provider;
    const providerId = (session as any)?.providerId;
    const userEmail = (() => {
      const raw = session?.user?.email;
      if (provider && provider !== "google") {
        if (raw) return `${provider}:${raw}`;
        if (providerId) return `${provider}:${providerId}`;
      }
      return raw || (provider && providerId ? `${provider}:${providerId}` : undefined);
    })();

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", userEmail!)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 최신 assessment 조회
    const { data: assessment } = await supabaseAdmin
      .from("test_assessments")
      .select("id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!assessment) {
      return NextResponse.json(
        { error: "NO_ASSESSMENT", message: "분석 결과가 없습니다." },
        { status: 404 }
      );
    }

    // 최신 result 조회
    const { data: result } = await supabaseAdmin
      .from("test_assessment_results")
      .select("mbti, confidence")
      .eq("assessment_id", assessment.id)
      .single();

    if (!result) {
      return NextResponse.json(
        { error: "NO_RESULT", message: "분석 결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const currentMbti = result.mbti as string;
    let refinedMbti = currentMbti;

    // MBTI 타입 수정 (경계 영역만)
    const mbtiArray = currentMbti.split("");
    if (EI) mbtiArray[0] = EI;
    if (SN) mbtiArray[1] = SN;
    if (TF) mbtiArray[2] = TF;
    refinedMbti = mbtiArray.join("");

    console.log("✅ [API /test/refine] MBTI refined:", {
      before: currentMbti,
      after: refinedMbti,
      adjustments: { EI, SN, TF },
    });

    // 결과 업데이트
    const { error: updateError } = await supabaseAdmin
      .from("test_assessment_results")
      .update({
        mbti: refinedMbti,
        confidence: {
          ...(result.confidence as any),
          refined: true,
          refinedAt: new Date().toISOString(),
        },
      })
      .eq("assessment_id", assessment.id);

    if (updateError) {
      console.error("❌ [API /test/refine] Update error:", updateError);
      throw updateError;
    }

    // 🔥 캐시 무효화: localStorage 키 삭제 트리거
    console.log("🗑️ [API /test/refine] Cache invalidation triggered");

    return NextResponse.json({
      ok: true,
      mbti: {
        before: currentMbti,
        after: refinedMbti,
        changed: currentMbti !== refinedMbti,
      },
    });
  } catch (e: any) {
    console.error("❌ [API /test/refine] Error:", e);
    return NextResponse.json(
      {
        error: "REFINE_FAILED",
        message: e?.message || "정밀화 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "MBTI Refine API",
    version: "1.0.0",
    endpoints: {
      POST: "/api/test/refine - 3문항 정밀화 실행",
    },
  });
}

