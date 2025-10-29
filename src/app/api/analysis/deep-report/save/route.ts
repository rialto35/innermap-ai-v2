/**
 * API endpoint for saving deep analysis reports to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assessmentId, reportSections, practicalCards, tokenCount } = await req.json();

    if (!assessmentId || !reportSections || !practicalCards) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('💾 [API /deep-report/save] Saving report for assessment:', assessmentId);

    // Get user UUID from email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('❌ [API /deep-report/save] User not found:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;
    console.log('✅ [API /deep-report/save] Resolved user UUID:', userId);

    // Upsert report (update if exists, insert if not)
    const { data, error } = await supabaseAdmin
      .from('deep_analysis_reports')
      .upsert(
        {
          user_id: userId,
          assessment_id: assessmentId,
          report_sections: reportSections,
          practical_cards: practicalCards,
          token_count: tokenCount,
          generated_at: new Date().toISOString(),
          model_version: 'claude-sonnet-4-20250514',
        },
        {
          onConflict: 'user_id,assessment_id', // Specify unique constraint columns
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ [API /deep-report/save] Database error:', error);
      console.error('❌ [API /deep-report/save] Error details:', JSON.stringify(error, null, 2));
      // Don't throw on duplicate key - it's expected when regenerating
      if (error.code !== '23505') {
        throw error;
      }
      console.log('⚠️ [API /deep-report/save] Duplicate report - this is normal for regeneration');
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

