/**
 * GET /api/reports/:id?include=deep
 * 단일 리포트 조회 (요약 또는 심층 포함)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ReportV1 } from '@/types/report';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeDeep = searchParams.get('include') === 'deep';

    console.log('🔍 [API /reports/:id] Debug info:', {
      id,
      userEmail: session.user.email,
      includeDeep
    });

    // 리포트 기본 정보 조회 (RLS 우회를 위해 supabaseAdmin 사용)
    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    // 수동으로 권한 확인
    if (report && report.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (reportError || !report) {
      console.log('❌ [API /reports/:id] Report not found:', { reportError, report });
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    console.log('✅ [API /reports/:id] Report found:', {
      id: report.id,
      userId: report.user_id,
      userEmail: session.user.email,
      match: report.user_id === session.user.email
    });

    // ReportV1 포맷으로 변환
    const reportV1: ReportV1 = {
      id: report.id,
      ownerId: report.user_id,
      meta: {
        version: "v1.3.1",
        engineVersion: report.engine_version || "IM-Core 1.3.1",
        weightsVersion: "v1.3",
        generatedAt: report.created_at
      },
      scores: {
        big5: report.big5_scores,
        mbti: report.mbti_scores?.type || "XXXX",
        reti: report.reti_scores?.score || 5,
        inner9: report.inner9_scores || []
      },
      summary: {
        highlight: report.summary?.highlight || "분석 결과를 확인해보세요.",
        bullets: report.summary?.bullets || ["분석 완료", "결과 확인 가능"]
      }
    };

    // 심층 데이터 포함 요청 시
    if (includeDeep) {
      const { data: deepData } = await supabaseAdmin
        .from('reports_deep')
        .select('*')
        .eq('report_id', id)
        .single();

      if (deepData) {
        reportV1.deep = {
          modules: deepData.modules,
          narrative: deepData.narrative,
          resources: deepData.resources
        };
      }
    }

    return NextResponse.json(reportV1);

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
