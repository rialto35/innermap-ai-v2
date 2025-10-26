/**
 * GET /api/report/[id]/status
 * 
 * 리포트 생성 상태 폴링 엔드포인트
 * - 프론트엔드에서 2-3초 간격으로 폴링
 * - 상태 변경 추적 (queued → processing → ready | failed)
 * 
 * @version v1.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

interface StatusResponse {
  reportId: string;
  status: 'pending' | 'running' | 'ready' | 'error';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const userId = session.user.email;
    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json({
        error: { code: 'INVALID_REQUEST', message: 'Report ID is required' }
      }, { status: 400 });
    }

    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('id, user_id, status, error_msg, started_at, finished_at, created_at')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      console.error('[GET /api/report/[id]/status] Report not found:', fetchError);
      return NextResponse.json({
        error: { code: 'NOT_FOUND', message: 'Report not found' }
      }, { status: 404 });
    }

    if (report.user_id !== userId) {
      console.error('[GET /api/report/[id]/status] Ownership mismatch');
      return NextResponse.json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }, { status: 403 });
    }

    let estimatedTimeRemaining: number | undefined;
    if (report.status === 'queued' || report.status === 'processing') {
      const createdAt = new Date(report.created_at).getTime();
      const now = Date.now();
      const elapsed = (now - createdAt) / 1000;
      if (report.status === 'queued') {
        estimatedTimeRemaining = Math.max(5 - elapsed, 0);
      } else {
        const averageProcessingTime = 45;
        const startedAt = report.started_at ? new Date(report.started_at).getTime() : now;
        const processingElapsed = (now - startedAt) / 1000;
        estimatedTimeRemaining = Math.max(averageProcessingTime - processingElapsed, 0);
      }
    }

    return NextResponse.json({
      reportId: report.id,
      status: report.status as StatusResponse['status'],
      estimatedTimeRemaining: estimatedTimeRemaining ? Math.round(estimatedTimeRemaining) : undefined
    });
  } catch (error) {
    console.error('[GET /api/report/[id]/status] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

