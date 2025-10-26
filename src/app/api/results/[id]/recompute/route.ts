/**
 * POST /api/results/:id/recompute?target=dashboard|coaching|horoscope|all
 * 캐시된 파생 데이터를 재계산/업데이트
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { toSummary, toPremium } from "@/lib/resultProjector";
import {
  ensureDashboardCache,
  ensureCoachingCache,
  ensureHoroscopeCache,
} from "@/lib/results/orchestrator";
import type { AssessmentResult } from "@/types/assessment";

const TARGETS = new Set(["dashboard", "coaching", "horoscope", "all"]);

type Target = "dashboard" | "coaching" | "horoscope" | "all";

function parseTarget(searchParams: URLSearchParams): Target {
  const value = searchParams.get("target")?.toLowerCase();
  if (value && TARGETS.has(value as Target)) {
    return value as Target;
  }
  return "all";
}

async function fetchSummaryDetail(resultId: string) {
  const { data, error } = await supabaseAdmin
    .from("test_assessment_results")
    .select("mbti, big5, keywords, confidence, inner9, world")
    .eq("assessment_id", resultId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("분석 결과를 찾을 수 없습니다.");
  }

  const summary = toSummary({
    mbti: data.mbti,
    big5: data.big5,
    keywords: data.keywords ?? [],
    confidence: data.confidence ?? undefined,
  } as AssessmentResult);

  const detailData = toPremium({
    mbti: data.mbti,
    big5: data.big5,
    keywords: data.keywords ?? [],
    confidence: data.confidence ?? undefined,
    inner9: data.inner9 ?? undefined,
    world: data.world ?? undefined,
  } as AssessmentResult);

  return {
    summary,
    detail: detailData
      ? {
          inner9: detailData.inner9,
          world: detailData.world,
          growthVector: detailData.growthVector,
        }
      : null,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const target = parseTarget(new URL(request.url).searchParams);

    const { data: assessment, error: assessmentError } = await supabaseAdmin
      .from("test_assessments")
      .select("id, user_id, engine_version, completed_at")
      .eq("id", id)
      .maybeSingle();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "검사 결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (assessment.user_id && assessment.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "해당 검사에 접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const needSummaryDetail =
      target === "all" || target === "dashboard" || target === "coaching";

    let summary: Awaited<ReturnType<typeof fetchSummaryDetail>>["summary"] | null = null;
    let detail: Awaited<ReturnType<typeof fetchSummaryDetail>>["detail"] | null = null;

    if (needSummaryDetail) {
      const data = await fetchSummaryDetail(id);
      summary = data.summary;
      detail = data.detail;
    }

    const results: Record<Target, unknown> = {
      all: null,
      dashboard: null,
      coaching: null,
      horoscope: null,
    };

    if (target === "all" || target === "dashboard") {
      if (summary) {
        results.dashboard = await ensureDashboardCache(id, summary, detail);
      } else {
        throw new Error("대시보드를 재계산하려면 summary 데이터가 필요합니다.");
      }
    }

    if (target === "all" || target === "coaching") {
      if (summary) {
        results.coaching = await ensureCoachingCache(id, summary, detail);
      } else {
        throw new Error("코칭을 재계산하려면 summary 데이터가 필요합니다.");
      }
    }

    if (target === "all" || target === "horoscope") {
      results.horoscope = await ensureHoroscopeCache(id, detail, undefined);
    }

    return NextResponse.json(
      {
        ok: true,
        target,
        results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [POST /api/results/:id/recompute] Error:", error);
    return NextResponse.json(
      {
        error: "RECOMPUTE_FAILED",
        message: error?.message || "재계산 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
