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
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

interface StatusResponse {
  reportId: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  progress?: number; // 0-100 (optional)
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  estimatedTimeRemaining?: number; // seconds
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }

    const userId = session.user.email;
    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json({
        error: { code: 'INVALID_REQUEST', message: 'Report ID is required' }
      }, { status: 400 });
    }

    // 2. Fetch report status
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

    // 3. Verify ownership
    if (report.user_id !== userId) {
      console.error('[GET /api/report/[id]/status] Ownership mismatch');
      return NextResponse.json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }, { status: 403 });
    }

    // 4. Calculate estimated time remaining
    let estimatedTimeRemaining: number | undefined;
    if (report.status === 'queued' || report.status === 'processing') {
      const createdAt = new Date(report.created_at).getTime();
      const now = Date.now();
      const elapsed = (now - createdAt) / 1000; // seconds

      if (report.status === 'queued') {
        // Average queue wait time: 5 seconds
        estimatedTimeRemaining = Math.max(5 - elapsed, 0);
      } else if (report.status === 'processing') {
        // Average processing time: 30-60 seconds
        const averageProcessingTime = 45;
        const startedAt = report.started_at ? new Date(report.started_at).getTime() : now;
        const processingElapsed = (now - startedAt) / 1000;
        estimatedTimeRemaining = Math.max(averageProcessingTime - processingElapsed, 0);
      }
    }

    // 5. Return status
    const response: StatusResponse = {
      reportId: report.id,
      status: report.status as StatusResponse['status'],
      error: report.error_msg || undefined,
      startedAt: report.started_at || undefined,
      finishedAt: report.finished_at || undefined,
      estimatedTimeRemaining: estimatedTimeRemaining ? Math.round(estimatedTimeRemaining) : undefined
    };

    return NextResponse.json(response);

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

