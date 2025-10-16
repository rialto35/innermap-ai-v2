/**
 * GET /api/results/[id]
 * 
 * Result snapshot retrieval
 * PR #4: Supabase integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
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

    // Fetch from Supabase
    const { data: result, error } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !result) {
      return NextResponse.json({
        error: {
          code: 'NOT_FOUND',
          message: 'Result not found'
        }
      } as ErrorResponse, { status: 404 });
    }

    // Transform to ResultSnapshot format
    const snapshot = {
      id: result.id,
      userId: result.user_id,
      assessmentId: result.assessment_id,
      engineVersion: result.engine_version || 'v1.0.0',
      big5: result.big5_scores || {},
      mbti: result.mbti_scores || { type: 'INFP', confidence: { EI: 0.5, SN: 0.5, TF: 0.5, JP: 0.5 }, raw: {} },
      reti: result.reti_scores || { primaryType: '4', confidence: 0.5, rawScores: {} },
      tribe: result.tribe || { type: 'phoenix', score: 50, element: 'fire' },
      stone: result.stone || { type: 'diamond', score: 50, affinity: [] },
      hero: result.hero || { 
        id: 'default', 
        name: '미지의 영웅', 
        description: '당신의 영웅을 발견해보세요', 
        image: '/heroes/default.png',
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

