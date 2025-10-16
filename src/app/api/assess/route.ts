/**
 * POST /api/assess
 * 
 * Assessment submission endpoint
 * - Validates answers
 * - Generates scores & mappings
 * - Creates result snapshot
 * 
 * Placeholder for PR #3 implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AssessRequest, AssessResponse, ErrorResponse } from '@innermap/types';

export async function POST(request: NextRequest) {
  try {
    const body: AssessRequest = await request.json();
    
    // TODO PR #3: Implement assessment logic
    // 1. Validate auth
    // 2. Validate answers
    // 3. Calculate hash for idempotency
    // 4. Run scoring engine
    // 5. Create assessment & result records
    // 6. Return snapshot
    
    return NextResponse.json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Assessment endpoint not yet implemented'
      }
    } as ErrorResponse, { status: 501 });
    
  } catch (error) {
    console.error('Assessment error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process assessment'
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

