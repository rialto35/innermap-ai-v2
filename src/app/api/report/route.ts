/**
 * POST /api/report
 * 
 * Report generation endpoint
 * - Queues report generation job
 * - Returns report ID and status
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ReportRequest, ReportResponse, ErrorResponse } from '@innermap/types';

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    
    // TODO M2: Implement report queueing
    // 1. Validate auth
    // 2. Validate result ownership
    // 3. Check plan limits
    // 4. Queue report generation
    // 5. Return report ID
    
    return NextResponse.json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Report endpoint not yet implemented'
      }
    } as ErrorResponse, { status: 501 });
    
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to queue report'
      }
    } as ErrorResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Use POST to request report generation'
    }
  } as ErrorResponse, { status: 405 });
}
