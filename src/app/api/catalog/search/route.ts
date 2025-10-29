/**
 * InnerMap AI - 카탈로그 검색 API
 * 영웅/부족/결정석 검색 및 조회
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 직접 Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'hero', 'tribe', 'stone', 'all'
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('🔍 카탈로그 검색:', { query, type, limit });

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const results: any = {
      heroes: [],
      tribes: [],
      stones: [],
    };

    // 영웅 검색
    if (type === 'all' || type === 'hero') {
      console.log('🔍 영웅 검색 중...');
      const { data: heroes, error: heroError } = await supabaseAdmin
        .from('hero_catalog')
        .select('*')
        .or(`canonical_name.ilike.%${query}%,name_en.ilike.%${query}%,tagline.ilike.%${query}%`)
        .limit(limit);

      console.log('영웅 검색 결과:', { heroes: heroes?.length || 0, error: heroError });
      if (!heroError) {
        results.heroes = heroes || [];
      }
    }

    // 부족 검색
    if (type === 'all' || type === 'tribe') {
      const { data: tribes, error: tribeError } = await supabaseAdmin
        .from('tribe_catalog')
        .select('*')
        .or(`canonical_name.ilike.%${query}%,name_en.ilike.%${query}%,core_value.ilike.%${query}%`)
        .limit(limit);

      if (!tribeError) {
        results.tribes = tribes || [];
      }
    }

    // 결정석 검색
    if (type === 'all' || type === 'stone') {
      const { data: stones, error: stoneError } = await supabaseAdmin
        .from('stone_catalog')
        .select('*')
        .or(`canonical_name.ilike.%${query}%,name_en.ilike.%${query}%,core_value.ilike.%${query}%`)
        .limit(limit);

      if (!stoneError) {
        results.stones = stones || [];
      }
    }

    return NextResponse.json({
      query,
      type,
      limit,
      results,
      total: results.heroes.length + results.tribes.length + results.stones.length
    });

  } catch (error) {
    console.error('Error in catalog search API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 특정 코드로 조회
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codes } = body;

    if (!codes || !Array.isArray(codes)) {
      return NextResponse.json({ error: 'codes array is required' }, { status: 400 });
    }

    const results: any = {
      heroes: [],
      tribes: [],
      stones: [],
    };

    for (const code of codes) {
      if (code.startsWith('HERO_')) {
        const { data: hero } = await supabaseAdmin
          .from('hero_catalog')
          .select('*')
          .eq('code', code)
          .single();
        
        if (hero) results.heroes.push(hero);
      } else if (code.startsWith('TRIBE_')) {
        const { data: tribe } = await supabaseAdmin
          .from('tribe_catalog')
          .select('*')
          .eq('code', code)
          .single();
        
        if (tribe) results.tribes.push(tribe);
      } else if (code.startsWith('STONE_')) {
        const { data: stone } = await supabaseAdmin
          .from('stone_catalog')
          .select('*')
          .eq('code', code)
          .single();
        
        if (stone) results.stones.push(stone);
      }
    }

    return NextResponse.json({
      codes,
      results,
      found: results.heroes.length + results.tribes.length + results.stones.length
    });

  } catch (error) {
    console.error('Error in catalog lookup API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
