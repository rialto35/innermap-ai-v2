import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL('/api/reports', request.url);
  const owner = request.nextUrl.searchParams.get('owner');
  if (owner) url.searchParams.set('owner', owner);
  if (request.nextUrl.searchParams.has('limit')) url.searchParams.set('limit', request.nextUrl.searchParams.get('limit')!);
  const r = await fetch(url.toString(), { cache: 'no-store' });
  return new NextResponse(r.body, { status: r.status, headers: r.headers });
}


