/**
 * GET /api/me/latest
 * Returns the latest result_id for the authenticated user
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

    const { data, error } = await supabaseAdmin
      .from("user_latest_result")
      .select("result_id, latest_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ [API /me/latest] Error:", error);
      return NextResponse.json(
        { error: "FETCH_FAILED", message: "최신 검사 정보를 불러오지 못했습니다." },
        { status: 500 }
      );
    }

    if (!data?.result_id) {
      return NextResponse.json(
        { result_id: null, latest_at: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { result_id: data.result_id, latest_at: data.latest_at },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("❌ [API /me/latest] Error:", e);
    return NextResponse.json(
      { error: "UNEXPECTED_ERROR", message: e?.message || "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
