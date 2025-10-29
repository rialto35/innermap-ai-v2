/**
 * InnerMap AI - 통합 결과 조회 API
 * 카탈로그 기반으로 영웅/부족/결정석 정보를 포함한 결과 반환
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        },
        hasTestResult: false
      });
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

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in unified result API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

