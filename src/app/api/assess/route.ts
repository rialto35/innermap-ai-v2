/**
 * POST /api/assess
 * 
 * Assessment submission endpoint
 * - Validates auth & answers
 * - Calculates scores & mappings
 * - Creates result snapshot with idempotency
 * 
 * @version v1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { AssessRequest, AssessResponse, ErrorResponse } from '@innermap/types';
import { calculateAnswerHash, runScoringPipeline, createResultSnapshot } from '@/lib/engine';
import { 
  createAssessment, 
  findAssessmentByHash, 
  createResult,
  findResultByAssessment 
} from '@/lib/db/assessments';

export async function POST(request: NextRequest) {
  try {
    // 1. Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      } as ErrorResponse, { status: 401 });
    }

    const userId = session.user.email; // TODO: Use proper user ID from DB

    // 2. Parse & validate request
    const body: AssessRequest = await request.json();
    
    if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Answers array is required and must not be empty'
        }
      } as ErrorResponse, { status: 400 });
    }

    const testType = body.testType || 'full';

    // 3. Calculate hash for idempotency
    const answersHash = calculateAnswerHash(body.answers);
    const engineVersion = 'v1.0.0'; // From @innermap/engine

    // 4. Check for existing assessment with same hash
    const existingAssessment = await findAssessmentByHash(userId, answersHash, engineVersion);
    
    if (existingAssessment) {
      // Return existing result
      const existingResult = await findResultByAssessment(existingAssessment.id);
      
      if (existingResult) {
        return NextResponse.json({
          assessmentId: existingAssessment.id,
          resultId: existingResult.id,
          result: {
            id: existingResult.id,
            userId: existingResult.user_id,
            assessmentId: existingResult.assessment_id,
            engineVersion: existingResult.engine_version,
            big5: existingResult.big5_scores as any,
            mbti: existingResult.mbti_scores as any,
            reti: existingResult.reti_scores as any,
            tribe: existingResult.tribe as any,
            stone: existingResult.stone as any,
            hero: existingResult.hero as any,
            createdAt: existingResult.created_at
          }
        });
      }
    }

    // 5. Run scoring pipeline
    // TODO: Load actual question metadata from database
    const scoringResult = await runScoringPipeline({
      answers: body.answers,
      birthDate: undefined, // TODO: Get from user profile
      big5Meta: {}, // TODO: Load from question bank
      mbtiWeights: {},
      retiWeights: {}
    });

    // 6. Create assessment record
    const assessment = await createAssessment(
      userId,
      body.answers,
      answersHash,
      engineVersion,
      testType
    );

    // 7. Create result record
    const result = await createResult(
      userId,
      assessment.id,
      engineVersion,
      scoringResult.big5,
      scoringResult.mbti,
      scoringResult.reti,
      scoringResult.tribe,
      scoringResult.stone,
      scoringResult.hero
    );

    // 8. Return snapshot
    const snapshot = createResultSnapshot(
      result.id,
      userId,
      assessment.id,
      scoringResult
    );

    return NextResponse.json({
      assessmentId: assessment.id,
      resultId: result.id,
      result: snapshot
    } as AssessResponse);

  } catch (error) {
    console.error('[POST /api/assess] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to process assessment',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    } as ErrorResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Use POST to submit assessment'
    }
  } as ErrorResponse, { status: 405 });
}

