import { NextRequest, NextResponse } from 'next/server';
import mbtiBoundary from '@/data/adaptive/mbti_boundary.json';
import mbtiExtra16 from '@/data/adaptive/mbti_extra16.json';
import retiTiebreak from '@/data/adaptive/reti_tiebreak.json';
import retiCore12 from '@/data/adaptive/reti_core12.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pack = (searchParams.get('pack') || 'boundary').toLowerCase();
  const limit = Math.max(1, Math.min(20, Number(searchParams.get('limit') || '4')));

  try {
    let payload: any = null;
    switch (pack) {
      case 'boundary':
        payload = (mbtiBoundary as any)?.items || [];
        break;
      case 'extra16':
        payload = (mbtiExtra16 as any)?.items || [];
        break;
      case 'reti_tiebreak':
        payload = (retiTiebreak as any)?.pairs?.flatMap((p: any) => p.items) || [];
        break;
      case 'reti_core12':
        payload = (retiCore12 as any)?.items || [];
        break;
      default:
        return NextResponse.json({ ok: false, error: 'UNKNOWN_PACK' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, items: payload.slice(0, limit) });
  } catch {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}


