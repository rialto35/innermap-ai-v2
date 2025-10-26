import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ReportV1 } from '@/types/report';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  console.log('🔍 [API /reports] Request params:', {
    owner,
    limit,
    offset,
    userEmail: session.user.email
  });

  // 사용자의 리포트 목록 조회
  const { data: reports, error: reportsError } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('user_id', session.user.email)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (reportsError) {
    console.log('❌ [API /reports] Reports fetch error:', reportsError);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }

  console.log('✅ [API /reports] Reports found:', reports?.length || 0);

  // ReportV1 형식으로 변환
  const reportV1List: ReportV1[] = (reports || []).map(report => ({
    id: report.id,
    ownerId: report.user_id,
    meta: {
      version: "v1.3.1" as const,
      engineVersion: report.engine_version || "IM-Core 1.3.1",
      weightsVersion: "v1.3",
      generatedAt: report.created_at
    },
    scores: {
      big5: report.big5_scores || { o: 0, c: 0, e: 0, a: 0, n: 0 },
      mbti: report.mbti_scores?.type || "XXXX",
      reti: report.reti_scores?.score || 5,
      inner9: report.inner9_scores || []
    },
    summary: {
      highlight: report.summary?.highlight || "분석 결과를 확인해보세요.",
      bullets: report.summary?.bullets || ["분석 완료", "결과 확인 가능"]
    }
  }));

  return NextResponse.json({
    reports: reportV1List,
    total: reportV1List.length,
    hasMore: reportV1List.length === limit
  });

} catch (err) {
  console.error('❌ [API /reports] Error:', err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : 'Unknown error' },
    { status: 500 }
  );
}
