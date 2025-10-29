/**
 * API endpoint for saving deep analysis reports to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId, reportSections, practicalCards, tokenCount } = await req.json();

    if (!assessmentId || !reportSections || !practicalCards) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('💾 [API /deep-report/save] Saving report for assessment:', assessmentId);

    const supabase = await createClient();

    // Get user ID from session
    const userId = (session.user as any).id || session.user.email;

    // Upsert report (update if exists, insert if not)
    const { data, error } = await supabase
      .from('deep_analysis_reports')
      .upsert({
        user_id: userId,
        assessment_id: assessmentId,
        report_sections: reportSections,
        practical_cards: practicalCards,
        token_count: tokenCount,
        generated_at: new Date().toISOString(),
        model_version: 'claude-sonnet-4-20250514',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [API /deep-report/save] Database error:', error);
      throw error;
    }

    console.log('✅ [API /deep-report/save] Report saved successfully');

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('❌ [API /deep-report/save] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

