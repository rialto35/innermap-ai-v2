/**
 * GET /api/results/:id
 * Unified Result bundle endpoint (summary/detail/dashboard/coaching)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { toSummary, toPremium } from "@/lib/resultProjector";
import type { ResultBundle, ResultDashboard, ResultCoaching, ResultHoroscope } from "@/types/result-bundle";
import type { AssessmentResult } from "@/types/assessment";
import {
  ensureDashboardCache,
  ensureCoachingCache,
  ensureHoroscopeCache,
} from "@/lib/results/orchestrator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BUNDLE_KEYS = ["summary", "detail", "dashboard", "coaching"] as const;
type BundleKey = (typeof BUNDLE_KEYS)[number];

function parseBundle(searchParams: URLSearchParams): Set<BundleKey | "all"> {
  const raw = searchParams.get("bundle");
  if (!raw || raw.trim() === "") {
    return new Set(["summary"]);
  }
  const parts = raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  const set = new Set<BundleKey | "all">();
  for (const part of parts) {
    if (part === "all") {
      set.add("all");
      continue;
    }
    if ((BUNDLE_KEYS as readonly string[]).includes(part)) {
      set.add(part as BundleKey);
    }
  }
  if (set.size === 0) {
    set.add("summary");
  }
  return set;
}

function wants(set: Set<BundleKey | "all">, key: BundleKey) {
  return set.has("all") || set.has(key);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { id } = params;
    const bundleSet = parseBundle(new URL(request.url).searchParams);

    // 1) Assessments 기본 정보 확인 및 소유권 검증
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

    const bundle: ResultBundle = {
      id,
    };

    // 2) Summary / Detail 기본 데이터 로드
    let resultRow: any | null = null;
    if (!resultRow && (wants(bundleSet, "summary") || wants(bundleSet, "detail") || wants(bundleSet, "dashboard") || wants(bundleSet, "coaching") || wants(bundleSet, "horoscope"))) {
      const { data, error } = await supabaseAdmin
        .from("test_assessment_results")
        .select("mbti, big5, keywords, confidence, inner9, world, created_at")
        .eq("assessment_id", id)
        .maybeSingle();

      if ((!data || error) && (wants(bundleSet, "summary") || wants(bundleSet, "detail"))) {
        return NextResponse.json(
          { error: "NOT_FOUND", message: "분석 결과를 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      resultRow = data;
    }

    let summaryBundle = bundle.summary;
    let detailBundle = bundle.detail;

    if (resultRow) {
      const assessmentResult: AssessmentResult = {
        mbti: resultRow?.mbti,
        big5: resultRow?.big5,
        keywords: resultRow?.keywords ?? [],
        confidence: resultRow?.confidence ?? undefined,
        inner9: resultRow?.inner9 ?? undefined,
        world: resultRow?.world ?? undefined,
      } as AssessmentResult;

      if (!summaryBundle && wants(bundleSet, "summary")) {
        summaryBundle = toSummary(assessmentResult);
        bundle.summary = summaryBundle;
      }

      if (!detailBundle && wants(bundleSet, "detail")) {
        const premium = toPremium(assessmentResult);
        if (premium) {
          detailBundle = {
            inner9: premium.inner9,
            world: premium.world,
            growthVector: premium.growthVector,
          };
          bundle.detail = detailBundle;
        }
      }
    }

    let dashboardGenerated = false;
    if (wants(bundleSet, "dashboard")) {
      const { data: viewRow } = await supabaseAdmin
        .from("result_views")
        .select("level, xp_current, xp_max, strengths, growth_areas, quests")
        .eq("result_id", id)
        .maybeSingle();

      if (viewRow) {
        const dashboard: ResultDashboard = {
          level: viewRow.level ?? 1,
          xp: {
            current: viewRow.xp_current ?? 0,
            max: viewRow.xp_max ?? 100,
          },
          strengths: Array.isArray(viewRow.strengths) ? viewRow.strengths : [],
          growthAreas: Array.isArray(viewRow.growth_areas) ? viewRow.growth_areas : [],
          quests: Array.isArray(viewRow.quests)
            ? (viewRow.quests as ResultDashboard["quests"])
            : [],
        };
        bundle.dashboard = dashboard;
      } else if (resultRow && (bundle.summary || bundle.detail)) {
        const summary = bundle.summary!;
        const detail = bundle.detail ?? null;
        bundle.dashboard = await ensureDashboardCache(id, summary, detail);
        dashboardGenerated = true;
      }
    }

    if (wants(bundleSet, "coaching")) {
      const { data: coachingRow } = await supabaseAdmin
        .from("result_coaching")
        .select("daily_coaching, weekly_plan, narrative")
        .eq("result_id", id)
        .maybeSingle();

      if (coachingRow && coachingRow.daily_coaching && coachingRow.weekly_plan && coachingRow.narrative) {
        const coaching: ResultCoaching = {
          daily: coachingRow.daily_coaching,
          weeklyPlan: coachingRow.weekly_plan,
          narrative: coachingRow.narrative,
        };
        bundle.coaching = coaching;
      } else if (resultRow && (bundle.summary || bundle.detail)) {
        const summary = bundle.summary!;
        const detail = bundle.detail ?? null;
        bundle.coaching = await ensureCoachingCache(id, summary, detail);
      }
    }

    if (wants(bundleSet, "horoscope")) {
      const { data: horoscopeRow } = await supabaseAdmin
        .from("result_horoscope")
        .select("date, fortune")
        .eq("result_id", id)
        .maybeSingle();

      if (horoscopeRow?.fortune) {
        const horoscope: ResultHoroscope = {
          date: horoscopeRow.date ?? new Date().toISOString().slice(0, 10),
          fortune: horoscopeRow.fortune,
        };
        bundle.horoscope = horoscope;
      } else {
        const detail = bundle.detail ?? null;
        bundle.horoscope = await ensureHoroscopeCache(id, detail, undefined);
      }
    }

    return NextResponse.json(bundle, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        pragma: "no-cache",
        expires: "0",
      },
    });
  } catch (error) {
    console.error("❌ [API /results/:id] Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "결과 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

