/**
 * POST /api/reports/:id/deep
 * 전체 심층 생성 트리거 (비용 높음이면 금지)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // 권한 확인
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.email)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // 모든 모듈을 "running" 상태로 업데이트
    const { error } = await supabaseAdmin
      .from('reports_deep')
      .upsert({
        report_id: id,
        modules: {
          cognition: "running",
          communication: "running",
          goal: "running",
          relation: "running",
          energy: "running",
          growth: "running"
        },
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating deep modules:', error);
      return NextResponse.json({ error: 'Failed to start deep analysis' }, { status: 500 });
    }

    // TODO: 실제 LLM/차트 생성 로직 구현
    // 현재는 시뮬레이션
    setTimeout(async () => {
      await supabaseAdmin
        .from('reports_deep')
        .update({
          modules: {
            cognition: "ready",
            communication: "ready",
            goal: "ready",
            relation: "ready",
            energy: "ready",
            growth: "ready"
          },
          narrative: "심층 분석이 완료되었습니다. 각 모듈의 상세 내용을 확인해보세요.",
          updated_at: new Date().toISOString()
        })
        .eq('report_id', id);
    }, 5000);

    return NextResponse.json({ 
      message: 'Deep analysis started',
      status: 'running'
    });

  } catch (error) {
    console.error('Error starting deep analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
