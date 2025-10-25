import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(`/api/reports/${id}?include=deep`, request.url).toString();
  const r = await fetch(url, { cache: 'no-store' });
  return new NextResponse(r.body, { status: r.status, headers: r.headers });
}


