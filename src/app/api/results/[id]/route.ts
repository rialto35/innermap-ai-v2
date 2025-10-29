/**
 * GET /api/results/[id]
 * 
 * Result snapshot retrieval
 * PR #4: Supabase integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { matchHero } from '@/lib/data/heroes144';
import { getTribeFromBirthDate } from '@/lib/innermapLogic';
import { recommendStone } from '@/lib/data/tribesAndStones';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }

    const { id } = await params;

    const { data: row, error } = await supabaseAdmin
      .from('test_assessments')
      .select(`
        id,
        user_id,
        created_at,
        raw_answers,
        test_assessment_results (
          assessment_id,
          mbti,
          big5,
          keywords,
          inner9,
          world,
          confidence
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !row || !row.test_assessment_results?.[0]) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Result not found' } }, { status: 404 });
    }

    const result = row.test_assessment_results[0];

    const birthdate = row.raw_answers?.profile?.birthdate || result.world?.birthdate || null;
    const tribeMatch = birthdate ? getTribeFromBirthDate(birthdate) : null;
    const hero = matchHero(result.mbti, result.world?.reti ?? result.world?.retiTop ?? result.world?.reti_type ?? '1');
    const stoneInput = {
      openness: result.big5?.O ?? result.big5?.openness ?? 50,
      conscientiousness: result.big5?.C ?? result.big5?.conscientiousness ?? 50,
      extraversion: result.big5?.E ?? result.big5?.extraversion ?? 50,
      agreeableness: result.big5?.A ?? result.big5?.agreeableness ?? 50,
      neuroticism: result.big5?.N ?? result.big5?.neuroticism ?? 50,
    } as const;
    const stone = recommendStone(stoneInput);

    const snapshot = {
      id: row.id,
      userId: row.user_id,
      assessmentId: row.id,
      engineVersion: 'imcore-1.0.0',
      big5: result.big5 ?? null,
      mbti: {
        type: result.mbti,
        confidence: result.confidence ?? null,
      },
      reti: result.world?.reti ?? null,
      keywords: result.keywords ?? [],
      inner9: result.inner9 ?? null,
      world: result.world ?? null,
      hero: hero
        ? {
            id: hero.id,
            name: hero.name,
            nameEn: hero.nameEn,
            tagline: hero.tagline,
            description: hero.description,
            abilities: hero.abilities,
          }
        : null,
      tribe: tribeMatch
        ? {
            id: tribeMatch.tribe.id,
            name: tribeMatch.tribe.nameKo,
            nameEn: tribeMatch.tribe.nameEn,
            symbol: tribeMatch.tribe.symbol,
            color: tribeMatch.tribe.colorHex,
            essence: tribeMatch.tribe.essence ?? null,
          }
        : null,
      stone: stone
        ? {
            id: stone.id,
            name: stone.nameKo,
            nameEn: stone.nameEn,
            icon: stone.icon ?? '💎',
            color: stone.color ?? '#8B5CF6',
            keywords: stone.keywords ?? [],
            summary: stone.summary ?? stone.description,
            coreValue: stone.coreValue,
            effect: stone.effect,
          }
        : null,
      createdAt: row.created_at,
    };

    return NextResponse.json(snapshot, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
    });
  } catch (error) {
    console.error('[GET /api/results/:id] Error:', error);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch result' } }, { status: 500 });
  }
}

