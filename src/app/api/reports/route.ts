/**
 * GET /api/reports?owner=me&limit=...
 * 리포트 리스트 조회 (요약 필드만)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ReportListResponse } from '@/types/report';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 리포트 리스트 조회 (요약 필드만)
    const { data: reports, error, count } = await supabaseAdmin
      .from('reports')
      .select('id, created_at, big5_scores, mbti_scores, reti_scores, inner9_scores, summary, engine_version', { count: 'exact' })
      .eq('user_id', session.user.email)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }

    // ReportV1 포맷으로 변환 (요약만)
    const reportList = reports?.map(report => ({
      id: report.id,
      meta: {
        version: "v1.3.1" as const,
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
    })) || [];

    const response: ReportListResponse = {
      reports: reportList,
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching reports list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
