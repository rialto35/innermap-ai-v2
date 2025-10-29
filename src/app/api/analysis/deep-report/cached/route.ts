/**
 * API endpoint for retrieving cached deep analysis reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 });
    }

    console.log('🔍 [API /deep-report/cached] Checking cache for assessment:', assessmentId);

    // Get user UUID from email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('❌ [API /deep-report/cached] User not found:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    // Fetch cached report
    const { data, error } = await supabaseAdmin
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

    return NextResponse.json(
      {
        ok: true,
        report: {
          sections: data.report_sections,
          practicalCards: data.practical_cards,
          generatedAt: data.generated_at,
          modelVersion: data.model_version,
          tokenCount: data.token_count,
        },
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=86400, stale-while-revalidate=604800',
          'CDN-Cache-Control': 'private, max-age=86400',
        },
      }
    );
  } catch (error) {
    console.error('❌ [API /deep-report/cached] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

