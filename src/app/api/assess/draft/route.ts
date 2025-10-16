/**
 * POST /api/assess/draft
 * 
 * Save assessment draft for auto-save functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { ErrorResponse } from '@innermap/types';

export async function POST(request: NextRequest) {
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

    const userId = session.user.email;
    const body = await request.json();
    const { draftId, answers, timestamp } = body;

    // Validate
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Answers object is required'
        }
      } as ErrorResponse, { status: 400 });
    }

    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) {
      return NextResponse.json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'At least one answer is required'
        }
      } as ErrorResponse, { status: 400 });
    }

    // Check if draft exists
    if (draftId) {
      // Update existing draft
      const { error } = await supabase
        .from('assessments')
        .update({
          answers,
          updated_at: new Date(timestamp || Date.now()).toISOString()
        })
        .eq('id', draftId)
        .eq('user_id', userId)
        .eq('draft', true);

      if (error) {
        console.error('Draft update error:', error);
        throw error;
      }

      return NextResponse.json({ draftId });
    } else {
      // Create new draft
      const newDraftId = uuidv4();
      
      const { error } = await supabase
        .from('assessments')
        .insert({
          id: newDraftId,
          user_id: userId,
          answers,
          draft: true,
          test_type: 'full',
          engine_version: 'v1.1.0',
          answers_hash: '', // Will be set on final submit
          created_at: new Date(timestamp || Date.now()).toISOString()
        });

      if (error) {
        console.error('Draft creation error:', error);
        throw error;
      }

      return NextResponse.json({ draftId: newDraftId });
    }

  } catch (error) {
    console.error('[POST /api/assess/draft] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to save draft',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    } as ErrorResponse, { status: 500 });
  }
}

