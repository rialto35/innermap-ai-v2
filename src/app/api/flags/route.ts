import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFlags } from '@/lib/flags';

function isProd() {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
  return env === 'production' || env === 'prod';
}

function isAdmin(session: Session | null) {
  const admins = (process.env.IM_FLAG_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = (session?.user as any)?.email?.toLowerCase();
  return !!email && admins.includes(email);
}

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;

  // In production, restrict to admins only
  if (isProd() && !isAdmin(session)) {
    return NextResponse.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
  }

  const flags = getFlags();
  return NextResponse.json({ ok: true, flags });
}


