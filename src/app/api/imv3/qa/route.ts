/**
 * IM-Core v3.0 QA 배치 엔드포인트
 * 
 * POST /api/imv3/qa
 * - 144×R 리그레션 테스트
 * - 관리자 전용
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { runCompleteBenchmark } from "@/core/im-core-v3/benchmark/index";

export async function POST(req: NextRequest) {
  try {
    // 인증 확인 (관리자만)
    const session = await getServerSession(authOptions as any) as any;
    
    // TODO: 관리자 권한 체크 로직 추가
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json(
    //     { error: "UNAUTHORIZED", message: "관리자 권한이 필요합니다." },
    //     { status: 403 }
    //   );
    // }
    
    console.log("[IMv3:QA] 144×R 벤치마크 시작...");
    
    const t0 = Date.now();
    
    // 벤치마크 실행 (R=20 기본)
    const report = runCompleteBenchmark();
    
    const took = Date.now() - t0;
    
    console.log(`[IMv3:QA] 완료 (${took}ms)`);
    
    // 성공 임계치 체크
    const mbtiAurocPass = report.phase2.mbti.auroc >= 0.70;
    const enneaTop3Pass = report.phase2.enneagram.top3 >= 0.56;
    
    const passed = mbtiAurocPass && enneaTop3Pass;
    
    return NextResponse.json({
      success: true,
      passed,
      report,
      thresholds: {
        mbti_auroc: { value: report.phase2.mbti.auroc, threshold: 0.70, passed: mbtiAurocPass },
        ennea_top3: { value: report.phase2.enneagram.top3, threshold: 0.56, passed: enneaTop3Pass },
      },
      took_ms: took,
    });
    
  } catch (error: any) {
    console.error("[IMv3:QA] Error:", error);
    return NextResponse.json(
      { 
        error: "QA_FAILED", 
        message: error?.message || "QA 실행 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/imv3/qa",
    method: "POST",
    description: "144×R 리그레션 테스트 (관리자 전용)",
    thresholds: {
      mbti_auroc: "≥ 0.70",
      ennea_top3: "≥ 0.56",
    },
  });
}

