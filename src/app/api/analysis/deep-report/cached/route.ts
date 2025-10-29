/**
 * API endpoint for retrieving cached deep analysis reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 });
    }

    console.log('🔍 [API /deep-report/cached] Checking cache for assessment:', assessmentId);

    const supabase = await createClient();

    // Get user ID from session
    const userId = (session.user as any).id || session.user.email;

    // Fetch cached report
    const { data, error } = await supabase
      .from('deep_analysis_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('assessment_id', assessmentId)
      .single();

    if (error || !data) {
      console.log('⚠️ [API /deep-report/cached] No cached report found');
      return NextResponse.json({ error: 'No cached report found' }, { status: 404 });
    }

    console.log('✅ [API /deep-report/cached] Cached report found');

    return NextResponse.json({
      ok: true,
      report: {
        sections: data.report_sections,
        practicalCards: data.practical_cards,
        generatedAt: data.generated_at,
        modelVersion: data.model_version,
        tokenCount: data.token_count,
      },
    });
  } catch (error) {
    console.error('❌ [API /deep-report/cached] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

