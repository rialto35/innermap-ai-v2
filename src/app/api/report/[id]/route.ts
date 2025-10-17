/**
 * GET /api/report/[id]
 * 
 * 리포트 데이터 조회
 * - 전체 리포트 정보 반환
 * - 본인 소유 리포트만 접근 가능
 * 
 * @version v1.1.0
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

    // 2. Fetch report
    console.log('[GET /api/report/[id]] Fetching report:', reportId, 'for user:', userId);
    const { data: report, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      console.error('[GET /api/report/[id]] Report not found:', fetchError);
      console.error('[GET /api/report/[id]] Query:', { reportId, userId });
      return NextResponse.json({
        error: { 
          code: 'NOT_FOUND', 
          message: 'Report not found',
          details: fetchError?.message,
          debug: { reportId, userId }
        }
      }, { status: 404 });
    }

    // 3. Verify ownership
    console.log('[GET /api/report/[id]] Verifying ownership:', { 
      reportUserId: report.user_id, 
      sessionUserId: userId,
      match: report.user_id === userId
    });
    
    if (report.user_id !== userId) {
      console.error('[GET /api/report/[id]] Ownership mismatch:', {
        expected: userId,
        actual: report.user_id
      });
      return NextResponse.json({
        error: { 
          code: 'FORBIDDEN', 
          message: 'Access denied',
          debug: {
            reportUserId: report.user_id,
            sessionUserId: userId
          }
        }
      }, { status: 403 });
    }

    // 4. Return report data
    return NextResponse.json(report);

  } catch (error) {
    console.error('[GET /api/report/[id]] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
