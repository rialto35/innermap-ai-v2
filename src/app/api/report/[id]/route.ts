/**
 * GET /api/report/[id]
 * 
 * 리포트 조회
 * - 리포트 ID로 생성된 리포트 조회
 * 
 * @version v1.0.0
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
    // Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }

    const { id } = await params;
    console.log('[GET /api/report/:id] Fetching report:', id);

    // Fetch report
    const { data: report, error } = await supabaseAdmin
      .from('ai_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      console.error('[GET /api/report/:id] Report not found:', error);
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: 'Report not found',
          details: error?.message
        }
      }, { status: 404 });
    }

    // Transform response
    const response = {
      reportId: report.id,
      testResultId: report.test_result_id,
      reportType: report.report_type,
      status: 'ready',
      content: report.content,
      visualData: report.visual_data,
      modelVersion: report.model_version,
      createdAt: report.created_at,
      updatedAt: report.updated_at
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[GET /api/report/:id] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
