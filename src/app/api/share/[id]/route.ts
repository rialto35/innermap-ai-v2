/**
 * POST /api/share/:id
 * 공유 링크 발급 (scope: "summary"|"full")
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ShareResponse } from '@/types/report';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { scope = "summary" } = body;

    // 권한 확인
    const { data: report } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.email)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // 공유 링크 생성 (실제로는 더 복잡한 토큰 시스템 필요)
    const shareId = `share_${id}_${Date.now()}`;
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shared/${shareId}`;
    
    // 공유 정보 저장 (실제 구현에서는 별도 테이블 필요)
    const { error } = await supabaseAdmin
      .from('reports')
      .update({
        share_id: shareId,
        share_scope: scope,
        share_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7일 후 만료
      })
      .eq('id', id);

    if (error) {
      console.error('Error creating share link:', error);
      return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
    }

    const response: ShareResponse = {
      shareId,
      url: shareUrl,
      scope,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}