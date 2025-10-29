/**
 * Test Analysis API
 * 55문항 답변 → IM-CORE 엔진 분석 → DB 저장
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { runIMCore } from "@/lib/imcore/analyze";
import { findOrCreateUser } from "@/lib/db/users";
import { getTribeFromBirthDate } from "@/lib/innermapLogic";
import { recommendStone } from "@/lib/data/tribesAndStones";

// 익명 검사 플래그 (기본값: false)
const ANON_ENABLED = process.env.IM_ANON_TEST_ENABLED === "true";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    
    // 🔒 익명 검사 가드: 로그인 없고 플래그도 OFF면 차단
    if (!session?.user && !ANON_ENABLED) {
      console.log("🚫 [API /test/analyze] Anonymous test blocked (flag OFF)");
      return NextResponse.json(
        { 
          error: "LOGIN_REQUIRED", 
          message: "로그인이 필요합니다. 익명 검사는 현재 비활성화되어 있습니다." 
        },
        { status: 401 }
      );
    }
    
    const { answers, profile, engineVersion = "imcore-1.0.0" } = await req.json();

    // 입력 검증
    if (!Array.isArray(answers) || answers.length !== 55) {
      return NextResponse.json(
        { error: "INVALID_ANSWERS", message: "55개 문항 답변이 필요합니다." },
        { status: 400 }
      );
    }

    // 사용자 ID (UUID로 통일) - /api/imcore/me와 동일한 이메일 형식 사용
    let userId = null;
    if (session?.user) {
      const provider = (session as any)?.provider
      const providerId = (session as any)?.providerId
      
      // /api/imcore/me와 동일한 이메일 형식 생성
      const email = (() => {
        const raw = session?.user?.email
        if (provider && provider !== 'google') {
          if (raw) return `${provider}:${raw}`
          if (providerId) return `${provider}:${providerId}`
        }
        return raw || (provider && providerId ? `${provider}:${providerId}` : undefined)
      })()
      
      const userResult = await findOrCreateUser({
        email: email!,
        name: session?.user?.name || null,
        image: session?.user?.image || null,
        provider: provider || 'google',
        providerId: providerId || '',
      });
      
      if (!userResult.user) {
        console.error('❌ [API /test/analyze] Failed to create/find user');
        return NextResponse.json(
          { error: 'USER_CREATE_FAILED', message: '사용자 정보를 생성할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      userId = userResult.user.id;
      console.log('✅ [API /test/analyze] User resolved:', { userId, isNew: userResult.isNewUser });
      
      // 명시적으로 user 존재 확인 (connection pool 격리 문제 해결)
      const { data: verifyUser, error: verifyError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (verifyError || !verifyUser) {
        console.error('❌ [API /test/analyze] User verification failed after findOrCreateUser!', { userId, error: verifyError });
        return NextResponse.json(
          { error: 'USER_VERIFY_FAILED', message: '사용자 확인에 실패했습니다.' },
          { status: 500 }
        );
      }
      
      console.log('✅ [API /test/analyze] User verified:', { userId });
    }

    console.log("📊 [API /test/analyze] Starting analysis", {
      userId,
      answersLength: answers.length,
      engineVersion,
    });

    // 1) assessments 생성
    const { data: assess, error: errAssess } = await supabaseAdmin
      .from("test_assessments")
      .insert({
        user_id: userId,
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

    const tribeMatch = profile?.birthdate ? getTribeFromBirthDate(profile.birthdate) : null;
    const worldInfo = output.premium?.world;
    const stoneInput = {
      openness: output.summary.big5.O,
      conscientiousness: output.summary.big5.C,
      extraversion: output.summary.big5.E,
      agreeableness: output.summary.big5.A,
      neuroticism: output.summary.big5.N,
    } as const;
    const stone = recommendStone(stoneInput);

    // 3) 결과 저장
    const { error: errRes } = await supabaseAdmin
      .from("test_assessment_results")
      .insert({
        assessment_id: assess.id,
        mbti: output.summary.mbti,
        big5: output.summary.big5,
        keywords: output.summary.keywords,
        inner9: output.premium?.inner9 ?? null,
        world: {
          ...worldInfo,
          reti: (worldInfo as any)?.reti ?? (worldInfo as any)?.retiTop ?? 1,
          birthdate: profile?.birthdate ?? null,
          tribe: tribeMatch?.tribe?.id ?? (worldInfo as any)?.tribe ?? null,
          stone: stone?.nameEn ?? (worldInfo as any)?.stone ?? null,
        },
        confidence: output.summary.confidence ?? null,
      });

    if (errRes) {
      console.error("❌ [API /test/analyze] Result insert error:", errRes);
      throw errRes;
    }

    console.log("✅ [API /test/analyze] Result saved");

    // 4) 프로필 저장/업서트 (FK 없이 애플리케이션 레벨에서 무결성 보장)
    if (userId) {
      const { error: errProfile } = await supabaseAdmin
        .from("user_profiles")
        .upsert({
          user_id: userId,
          gender: profile?.gender ?? null,
          birthdate: profile?.birthdate ?? null,
          email: profile?.email ?? null,
          consent_required_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (errProfile) {
        console.warn("⚠️ [API /test/analyze] Profile upsert failed:", errProfile);
        // 프로필 저장 실패는 치명적이지 않음 (FK 없으므로 다른 이유일 수 있음)
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

