/**
 * GET /api/results/:id
 * Unified Result bundle endpoint (summary/detail/dashboard/coaching)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
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

const BUNDLE_KEYS = ["summary", "detail", "dashboard", "coaching", "horoscope"] as const;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    const { id } = await params;
    const bundleSet = parseBundle(new URL(request.url).searchParams);

    // 1) Assessments 기본 정보 확인 및 소유권 검증
    const { data: assessment, error: assessmentError } = await supabaseAdmin
      .from("test_assessments")
      .select("id, user_id, owner_token, engine_version, completed_at")
      .eq("id", id)
      .maybeSingle();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "검사 결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 소유권 검증
    let isOwner = false;
    let isAnonymous = false;
    let isLimited = false;

    // Case 1: 로그인 사용자 + 본인 데이터
    if (session?.user?.id && assessment.user_id === session.user.id) {
      isOwner = true;
      isAnonymous = false;
    }
    // Case 2: 익명 데이터 + 쿠키 토큰 일치
    else if (!assessment.user_id && assessment.owner_token) {
      const cookieToken = request.cookies.get(`result_${id}_owner`)?.value;
      if (cookieToken === assessment.owner_token) {
        isOwner = true;
        isAnonymous = true;
        isLimited = true; // 익명 사용자는 제한된 데이터만
      }
    }

    // 소유권 없음
    if (!isOwner) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "이 결과에 접근할 권한이 없습니다. 로그인하거나 검사를 진행한 브라우저에서 접속해주세요." },
        { status: 401 }
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
    // 익명 사용자는 dashboard, coaching, horoscope 접근 제한
    if (wants(bundleSet, "dashboard") && !isLimited) {
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

    if (wants(bundleSet, "coaching") && !isLimited) {
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

    if (wants(bundleSet, "horoscope") && !isLimited) {
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

    return NextResponse.json(
      {
        ...bundle,
        _meta: {
          isAnonymous,
          isLimited,
          message: isLimited
            ? "익명 사용자는 요약 정보만 확인할 수 있습니다. 로그인하고 전체 리포트를 확인하세요!"
            : undefined,
        },
      },
      {
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          pragma: "no-cache",
          expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("❌ [API /results/:id] Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "결과 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

