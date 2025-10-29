/**
 * InnerMap AI - 통합 마이페이지 API (카탈로그 기반)
 * 기존 /api/imcore/me를 카탈로그 기반으로 리팩토링
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// 메모리 캐시 (개발용)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 0; // 개발 중 캐시 비활성화

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 캐시 확인
    const cacheKey = `mypage:${session.user.email}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, image')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 최신 통합 결과 조회 (카탈로그 정보 포함)
    const { data: result, error: resultError } = await supabaseAdmin
      .from('test_results_with_catalog')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (resultError) {
      console.error('Error fetching unified result:', resultError);
      return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
    }

    // 결과가 없는 경우
    if (!result) {
      const responseData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        },
        hasTestResult: false
      };

      // 캐시에 저장
      cache.set(cacheKey, { data: responseData, timestamp: now });
      return NextResponse.json(responseData);
    }

    // 통합 결과 반환
    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      hasTestResult: true,
      result: {
        id: result.id,
        mbti: result.mbti,
        reti: result.reti,
        big5: result.big5,
        inner9: result.inner9,
        engineVersion: result.engine_version,
        confidence: result.confidence,
        createdAt: result.created_at,
        
        // 영웅 정보
        hero: {
          code: result.hero_code,
          name: result.hero_name,
          nameEn: result.hero_name_en,
          tagline: result.hero_tagline,
          description: result.hero_description,
          abilities: result.hero_abilities,
        },
        
        // 부족 정보
        tribe: {
          code: result.tribe_code,
          name: result.tribe_name,
          nameEn: result.tribe_name_en,
          symbol: result.tribe_symbol,
          color: result.tribe_color,
          coreValue: result.tribe_core_value,
        },
        
        // 결정석 정보
        stone: {
          code: result.stone_code,
          name: result.stone_name,
          nameEn: result.stone_name_en,
          symbol: result.stone_symbol,
          color: result.stone_color,
          coreValue: result.stone_core_value,
          effect: result.stone_effect,
        }
      }
    };

    // 캐시에 저장
    cache.set(cacheKey, { data: responseData, timestamp: now });
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in unified mypage API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

