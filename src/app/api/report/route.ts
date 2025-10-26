/**
 * POST /api/report
 * 
 * 심층 리포트 생성 요청 (비동기 큐 방식 - PR #5.1)
 * - 결과 ID를 받아 리포트 생성 큐에 등록
 * - 즉시 reportId 반환 (status='queued')
 * - Edge Function에서 백그라운드 처리
 * 
 * @version v1.1.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

interface ReportRequest {
  resultId: string;
}

interface ReportResponse {
  reportId: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  message?: string;
  existingReport?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.email) {
      console.log('[POST /api/report] Unauthorized access attempt');
      return NextResponse.json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }

    const userEmail = session.user.email;

    // 2. Parse request
    const body: ReportRequest = await request.json();
    const { resultId } = body;

    if (!resultId) {
      return NextResponse.json({
        error: { code: 'INVALID_REQUEST', message: 'resultId is required' }
      }, { status: 400 });
    }

    console.log(`[POST /api/report] User ${userEmail} requesting report for result ${resultId}`);

    // 3. Get user UUID from email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      console.error('[POST /api/report] User not found:', userError);
      return NextResponse.json({
        error: { code: 'NOT_FOUND', message: 'User not found' }
      }, { status: 404 });
    }

    const userId = user.id;
    console.log(`[POST /api/report] Resolved user UUID: ${userId}`);

    // 4. Verify result exists and belongs to user
    const { data: result, error: resultError } = await supabaseAdmin
      .from('test_results')
      .select('id, user_id')
      .eq('id', resultId)
      .single();

    if (resultError || !result) {
      console.error('[POST /api/report] Result not found:', resultError);
      return NextResponse.json({
        error: { code: 'NOT_FOUND', message: 'Result not found' }
      }, { status: 404 });
    }

    // Verify ownership
    if (result.user_id !== userId) {
      console.error(`[POST /api/report] Ownership mismatch: user ${userId} vs result.user_id ${result.user_id}`);
      return NextResponse.json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }, { status: 403 });
    }

    // 4. Check for existing report (idempotency)
    const { data: existingReports, error: checkError } = await supabaseAdmin
      .from('reports')
      .select('id, status, finished_at')
      .eq('result_id', resultId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error('[POST /api/report] Error checking existing reports:', checkError);
      // Continue anyway - better to create duplicate than fail
    }

    // If report exists and is ready/processing/queued, return it
    if (existingReports && existingReports.length > 0) {
      const existing = existingReports[0];
      
      if (existing.status === 'ready') {
        console.log(`[POST /api/report] Returning existing ready report: ${existing.id}`);
        return NextResponse.json({
          reportId: existing.id,
          status: 'ready',
          message: '이미 생성된 리포트가 있습니다.',
          existingReport: true
        } as ReportResponse);
      }

      if (existing.status === 'processing' || existing.status === 'queued') {
        console.log(`[POST /api/report] Returning existing ${existing.status} report: ${existing.id}`);
        return NextResponse.json({
          reportId: existing.id,
          status: existing.status,
          message: '리포트 생성 중입니다.',
          existingReport: true
        } as ReportResponse);
      }

      // If failed, allow retry by creating new report
      if (existing.status === 'failed') {
        console.log(`[POST /api/report] Previous report failed, allowing retry: ${existing.id}`);
      }
    }

    // 5. Create new report record with status='queued'
    const { data: newReport, error: insertError } = await supabaseAdmin
      .from('reports')
      .insert({
        user_id: userEmail, // reports.user_id is TEXT (email)
        result_id: resultId,
        status: 'queued',
        created_at: new Date().toISOString()
      })
      .select('id, status')
      .single();

    if (insertError || !newReport) {
      console.error('[POST /api/report] Failed to create report:', insertError);
      return NextResponse.json({
        error: { 
          code: 'DB_ERROR', 
          message: 'Failed to create report',
          details: insertError?.message 
        }
      }, { status: 500 });
    }

    console.log(`[POST /api/report] Report queued successfully: ${newReport.id}`);

    // 6. Trigger edge function (best-effort)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        const functionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/generate-report`;
        fetch(functionUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trigger: 'api-report', reportId: newReport.id }),
        }).catch(() => {});
      }
    } catch (triggerError) {
      console.warn('[POST /api/report] Edge function trigger failed (non-fatal):', triggerError);
    }

    // 7. Return report ID immediately
    return NextResponse.json({
      reportId: newReport.id,
      status: 'queued',
      message: '리포트 생성이 시작되었습니다. 약 30-120초 소요됩니다.',
      existingReport: false
    } as ReportResponse);

  } catch (error) {
    console.error('[POST /api/report] Unexpected error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

/**
 * Trigger edge function for report generation
 * (Optional - can also rely on cron/polling)
 */
async function triggerReportGeneration(reportId: string): Promise<void> {
  // TODO: Implement edge function trigger
  // For now, just log
  console.log(`[triggerReportGeneration] Would trigger for report ${reportId}`);
  
  // Example with Supabase Edge Functions:
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // const functionUrl = `${supabaseUrl}/functions/v1/generate-report`;
  // await fetch(functionUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ reportId })
  // });
}

export async function GET() {
  return NextResponse.json({
    error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST to request report generation' }
  }, { status: 405 });
}
