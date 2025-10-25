/**
 * POST /api/reports/:id/deep/:module
 * 모듈 단일 생성 트리거
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { DeepKey } from '@/types/report';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; module: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, module } = await params;
    const moduleKey = module as DeepKey;
    
    // 유효한 모듈 키 확인
    const validModules: DeepKey[] = ['cognition', 'communication', 'goal', 'relation', 'energy', 'growth'];
    if (!validModules.includes(moduleKey)) {
      return NextResponse.json({ error: 'Invalid module' }, { status: 400 });
    }

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

    // 기존 심층 데이터 조회
    const { data: existingDeep } = await supabaseAdmin
      .from('reports_deep')
      .select('*')
      .eq('report_id', id)
      .single();

    const currentModules = existingDeep?.modules || {
      cognition: "pending",
      communication: "pending",
      goal: "pending",
      relation: "pending",
      energy: "pending",
      growth: "pending"
    };

    // 해당 모듈을 "running" 상태로 업데이트
    const updatedModules = {
      ...currentModules,
      [moduleKey]: "running"
    };

    const { error } = await supabaseAdmin
      .from('reports_deep')
      .upsert({
        report_id: id,
        modules: updatedModules,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating module:', error);
      return NextResponse.json({ error: 'Failed to start module analysis' }, { status: 500 });
    }

    // TODO: 실제 모듈별 LLM/차트 생성 로직 구현
    // 현재는 시뮬레이션
    setTimeout(async () => {
      const finalModules = {
        ...updatedModules,
        [moduleKey]: "ready"
      };

      await supabaseAdmin
        .from('reports_deep')
        .update({
          modules: finalModules,
          narrative: `${moduleKey} 모듈 분석이 완료되었습니다.`,
          updated_at: new Date().toISOString()
        })
        .eq('report_id', id);
    }, 3000);

    return NextResponse.json({ 
      message: `Module ${moduleKey} analysis started`,
      status: 'running'
    });

  } catch (error) {
    console.error('Error starting module analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
