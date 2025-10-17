/**
 * GET /api/report/[id]
 * 
 * 리포트 데이터 조회 (확장)
 * - 리포트 + 사용자/영웅 메타 + 시각화 URL 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }

    const sessionUserId = session.user.email;
    const { id: reportId } = await params;
    if (!reportId) {
      return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Report ID is required' } }, { status: 400 });
    }

    // reports + users + heroes 조인(뷰가 없다는 가정하 조립)
    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select('id, user_id, result_id, status, summary_md, visuals_json, created_at, finished_at')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Report not found', details: error?.message } }, { status: 404 });
    }

    if (report.user_id !== sessionUserId) {
      return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
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

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Unknown error' } }, { status: 500 });
  }
}
