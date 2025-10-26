/**
 * GET /api/report/[id] - ReportV1 형식으로 통일
 * 
 * 리포트 데이터 조회 (확장)
 * - 리포트 + 사용자/영웅 메타 + 시각화 URL 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ReportV1 } from '@/types/report';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;
    if (!reportId) {
      return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Report ID is required' } }, { status: 400 });
    }

    // 공유 토큰 파라미터
    const token = request.nextUrl.searchParams.get('t');

    // reports 조회(공유 토큰 검증 위해 share_token 포함)
    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select('id, user_id, result_id, status, summary_md, visuals_json, created_at, finished_at, share_token, share_issued_at')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Report not found', details: error?.message } }, { status: 404 });
    }

    // 1) 공유 토큰이 있으면 토큰 검증으로 접근 허용(비로그인 허용)
    if (token) {
      if (!report.share_token || report.share_token !== token) {
        return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Invalid share token' } }, { status: 403 });
      }
      // (선택) 만료 검사: 필요 시 활성화
      // const ttlMs = 30 * 24 * 60 * 60 * 1000; // 30일
      // if (report.share_issued_at && Date.now() - new Date(report.share_issued_at).getTime() > ttlMs) {
      //   return NextResponse.json({ error: { code: 'EXPIRED', message: 'Share token expired' } }, { status: 403 });
      // }
    } else {
      // 2) 토큰이 없으면 로그인 사용자 소유권 검증
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
      }
      const sessionUserId = session.user.email;
      if (report.user_id !== sessionUserId) {
        return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
      }
    }

    // 사용자 이름 (reports.user_id는 email이므로 email로 조회)
    const { data: userMeta } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .eq('email', report.user_id)
      .maybeSingle();

    // 영웅 메타(가정: results 또는 hero 테이블에서 조회)
    const { data: resultMeta } = await supabaseAdmin
      .from('test_results')
      .select('hero_name, tribe_name')
      .eq('id', report.result_id)
      .maybeSingle();

    const heroName = resultMeta?.hero_name ?? '영웅';
    const heroTribe = resultMeta?.tribe_name ?? 'Water';

    // visuals_json URL 정리(이미 값이 있으면 그대로, 없으면 null)
    const visuals = report.visuals_json || {} as any;

    // 비주얼이 비어 있고 아직 생성한 적 없으면 Edge Function에 비차단 trigger
    try {
      const needVisuals = !visuals?.big5RadarUrl || !visuals?.generated_at;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (needVisuals && supabaseUrl && serviceKey) {
        const functionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/generate-visuals`;
        fetch(functionUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportId }),
        }).catch(() => {});
      }
    } catch {}

    const payload = {
      id: report.id,
      result_id: report.result_id,
      status: report.status,
      summary_md: report.summary_md,
      created_at: report.created_at,
      finished_at: report.finished_at,
      user: { name: userMeta?.name ?? (userMeta?.email ?? 'User') },
      hero: { name: heroName, tribe: heroTribe },
      visuals_json: {
        big5RadarUrl: visuals.big5RadarUrl || null,
        auxBarsUrl: visuals.auxBarsUrl || null,
        growthVectorUrl: visuals.growthVectorUrl || null,
        generated_at: visuals.generated_at || null,
      },
    };

    // 공유 페이지는 캐시 방지
    const headers = new Headers({ 'Cache-Control': 'private, no-store' });
    return NextResponse.json(payload, { headers });
  } catch (err) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unknown error' } }, { status: 500 });
  }
}
