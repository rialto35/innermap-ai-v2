/**
 * GET /api/reports/test
 * 테스트용 라우트
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Reports API is working',
    timestamp: new Date().toISOString()
  });
}
