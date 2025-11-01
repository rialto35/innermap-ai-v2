/**
 * Test Results API
 * 저장된 분석 결과 조회
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toSummary, toPremium } from "@/lib/resultProjector";
import { matchHero } from '@/lib/data/heroes144';
import { getTribeFromBirthDate } from '@/lib/innermapLogic';
import { recommendStone } from '@/lib/data/tribesAndStones';
import { getFlags } from '@/lib/flags';
import mbtiBoundary from '@/data/adaptive/mbti_boundary.json';

// local helper
const clamp = (v?: number) => Math.max(0, Math.min(100, typeof v === 'number' ? v : 0));

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. assessment 조회
    const { data: assessment, error: assessError } = await supabaseAdmin
      .from("test_assessments")
      .select("id, created_at, raw_answers")
      .eq("id", id)
      .maybeSingle();

    if (assessError || !assessment) {
      return NextResponse.json({ error: "NOT_FOUND", message: "결과를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. result 조회 (FK 없이 명시적 조회)
    const { data: results, error: resultError } = await supabaseAdmin
      .from("test_assessment_results")
      .select("assessment_id, mbti, big5, keywords, inner9, world, confidence")
      .eq("assessment_id", id)
      .maybeSingle();

    if (resultError || !results) {
      return NextResponse.json({ error: "NOT_FOUND", message: "분석 결과를 찾을 수 없습니다." }, { status: 404 });
    }

    const row = { ...assessment, test_assessment_results: [results] };
    const result = results;

    const birthdate = row.raw_answers?.profile?.birthdate || result.world?.birthdate || null;
    const tribeMatch = birthdate ? getTribeFromBirthDate(birthdate) : null;
    const hero = matchHero(result.mbti, result.world?.reti ?? result.world?.retiTop ?? result.world?.reti_type ?? '1');
    const stoneInput = {
      openness: result.big5?.O ?? result.big5?.openness ?? 50,
      conscientiousness: result.big5?.C ?? result.big5?.conscientiousness ?? 50,
      extraversion: result.big5?.E ?? result.big5?.extraversion ?? 50,
      agreeableness: result.big5?.A ?? result.big5?.agreeableness ?? 50,
      neuroticism: result.big5?.N ?? result.big5?.neuroticism ?? 50,
    } as const;
    const stone = recommendStone(stoneInput);

    const assessmentResult = {
      mbti: result.mbti,
      big5: result.big5,
      keywords: result.keywords,
      confidence: result.confidence,
      inner9: result.inner9,
      world: result.world,
      hero: hero
        ? {
            id: hero.id,
            name: hero.name,
            nameEn: hero.nameEn,
            tagline: hero.tagline,
            description: hero.description,
            abilities: hero.abilities,
          }
        : null,
      tribe: tribeMatch
        ? {
            id: tribeMatch.tribe.id,
            name: tribeMatch.tribe.nameKo,
            nameEn: tribeMatch.tribe.nameEn,
            symbol: tribeMatch.tribe.symbol,
            color: tribeMatch.tribe.colorHex,
            essence: tribeMatch.tribe.essence ?? null,
          }
        : null,
      stone: stone
        ? {
            id: stone.id,
            name: stone.nameKo,
            nameEn: stone.nameEn,
            icon: stone.icon ?? '💎',
            color: stone.color ?? '#8B5CF6',
            keywords: stone.keywords ?? [],
            summary: stone.summary ?? stone.description,
            coreValue: stone.coreValue,
            effect: stone.effect,
          }
        : null,
    };

    const summary = toSummary(assessmentResult as any);
    const premium = toPremium(assessmentResult as any);

    // Mini-adaptive hint (boundary only, flag-guarded)
    const flags = getFlags();
    const adaptiveHint = (() => {
      if (!flags.miniAdaptive) return null;
      const b5 = result.big5 || {} as any;
      const EI = clamp(b5.E);
      const SN = clamp(100 - (b5.O ?? 0));
      const TF = clamp(100 - (b5.A ?? 0));
      const JP = clamp(b5.C);
      const boundary = [EI, SN, TF, JP].some((v) => v >= 45 && v <= 55);
      if (!boundary) return null;
      try {
        const items = (mbtiBoundary as any)?.items || [];
        return { type: 'mbti', items: items.slice(0, 2) };
      } catch { return null; }
    })();

    return NextResponse.json({
      ok: true,
      assessmentId: row.id,
      summary,
      premium,
      createdAt: row.created_at,
      adaptiveHint,
    }, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
    });
  } catch (e: any) {
    console.error("❌ [API /test/results/:id] Error:", e);
    return NextResponse.json({ error: "FETCH_FAILED", message: e?.message || "조회 실패" }, { status: 500 });
  }
}

