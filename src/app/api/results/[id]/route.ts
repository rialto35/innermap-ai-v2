/**
 * GET /api/results/[id]
 * 
 * Result snapshot retrieval
 * PR #4: Supabase integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import type { ErrorResponse } from '@innermap/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      } as ErrorResponse, { status: 401 });
    }

    const { id } = await params;
    
    console.log('[GET /api/results/:id] Fetching result for ID:', id);
    console.log('[GET /api/results/:id] User email:', session.user.email);

    // Fetch from Supabase (using test_results table with Service Role Key)
    const { data: result, error } = await supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('id', id)
      .single();

    console.log('[GET /api/results/:id] Supabase query result:', { 
      found: !!result, 
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details
    });

    if (error || !result) {
      console.error('[GET /api/results/:id] Failed to find result:', {
        id,
        error: error?.message,
        code: error?.code,
        details: error?.details
      });
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: 'Result not found',
          details: error?.message,
          supabaseError: error
        }
      } as ErrorResponse, { status: 404 });
    }
    
    console.log('[GET /api/results/:id] Successfully found result:', result.id);

    // Transform test_results to ResultSnapshot format
    const snapshot = {
      id: result.id,
      userId: result.user_id,
      assessmentId: result.id, // test_results doesn't have assessment_id
      engineVersion: 'v1.0.0',
      big5: {
        openness: result.big5_openness || 50,
        conscientiousness: result.big5_conscientiousness || 50,
        extraversion: result.big5_extraversion || 50,
        agreeableness: result.big5_agreeableness || 50,
        neuroticism: result.big5_neuroticism || 50
      },
      mbti: {
        type: result.mbti_type || 'INFP',
        confidence: result.mbti_confidence || { EI: 0.5, SN: 0.5, TF: 0.5, JP: 0.5 },
        raw: {
          EI: { letter: result.mbti_type?.[0] || 'I', prob: 0.5, pairProb: [0.5, 0.5] },
          SN: { letter: result.mbti_type?.[1] || 'N', prob: 0.5, pairProb: [0.5, 0.5] },
          TF: { letter: result.mbti_type?.[2] || 'F', prob: 0.5, pairProb: [0.5, 0.5] },
          JP: { letter: result.mbti_type?.[3] || 'P', prob: 0.5, pairProb: [0.5, 0.5] }
        }
      },
      reti: {
        primaryType: result.reti_top1?.replace('r', '') || '4',
        secondaryType: result.reti_top2?.replace('r', ''),
        confidence: 0.7,
        rawScores: result.reti_scores || {}
      },
      tribe: {
        type: 'phoenix',
        score: 50,
        element: 'fire'
      },
      stone: {
        type: 'diamond',
        score: 50,
        affinity: []
      },
      hero: {
        id: result.hero_id || 'default',
        name: result.hero_name || '미지의 영웅',
        description: '당신의 영웅을 발견해보세요',
        image: `/heroes/${result.gender_preference || 'male'}/${result.mbti_type?.toLowerCase() || 'infp'}-${result.reti_top1?.replace('r', '') || '4'}.png`,
        score: 50,
        traits: ['탐험가', '개척자']
      },
      createdAt: result.created_at
    };

    return NextResponse.json(snapshot);

  } catch (error) {
    console.error('[GET /api/results/:id] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch result'
      }
    } as ErrorResponse, { status: 500 });
  }
}

