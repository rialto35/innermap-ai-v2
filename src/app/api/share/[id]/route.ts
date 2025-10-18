import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

function generateToken(len = 24) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

// POST /api/share/:id -> issue share token for report
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const { id: reportId } = await params;
  if (!reportId) return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 });

  // Ownership check
  const { data: report } = await supabaseAdmin
    .from('reports')
    .select('id, user_id, share_token')
    .eq('id', reportId)
    .single();

  if (!report || report.user_id !== session.user.email) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const newToken = report.share_token || generateToken(28);
  await supabaseAdmin
    .from('reports')
    .update({ share_token: newToken, share_issued_at: new Date().toISOString() })
    .eq('id', reportId);

  return NextResponse.json({ ok: true, share_token: newToken, share_url: `/report/${reportId}?t=${newToken}` });
}


