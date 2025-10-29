/**
 * InnerMap AI - 통합 결과 저장 API
 * 카탈로그 코드 기반으로 결과 저장
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface SaveResultRequest {
  mbti: string;
  reti: string;
  big5: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  inner9: Record<string, number>;
  heroCode: string;
  tribeCode: string;
  stoneCode: string;
  engineVersion?: string;
  confidence?: number;
  rawAnswers?: any[];
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SaveResultRequest = await req.json();

    // 입력 검증
    if (!body.mbti || !body.reti || !body.big5 || !body.inner9) {
      return NextResponse.json({ 
        error: 'Missing required fields: mbti, reti, big5, inner9' 
      }, { status: 400 });
    }

    if (!body.heroCode || !body.tribeCode || !body.stoneCode) {
      return NextResponse.json({ 
        error: 'Missing required catalog codes: heroCode, tribeCode, stoneCode' 
      }, { status: 400 });
    }

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 카탈로그 코드 검증
    const { data: heroExists } = await supabaseAdmin
      .from('hero_catalog')
      .select('code')
      .eq('code', body.heroCode)
      .single();

    const { data: tribeExists } = await supabaseAdmin
      .from('tribe_catalog')
      .select('code')
      .eq('code', body.tribeCode)
      .single();

    const { data: stoneExists } = await supabaseAdmin
      .from('stone_catalog')
      .select('code')
      .eq('code', body.stoneCode)
      .single();

    if (!heroExists || !tribeExists || !stoneExists) {
      return NextResponse.json({ 
        error: 'Invalid catalog codes',
        details: {
          heroCode: !!heroExists,
          tribeCode: !!tribeExists,
          stoneCode: !!stoneExists,
        }
      }, { status: 400 });
    }

    // 통합 결과 저장
    const { data: result, error: insertError } = await supabaseAdmin
      .from('test_results_unified')
      .insert({
        user_id: user.id,
        hero_code: body.heroCode,
        tribe_code: body.tribeCode,
        stone_code: body.stoneCode,
        mbti: body.mbti,
        reti: body.reti,
        big5: body.big5,
        inner9: body.inner9,
        engine_version: body.engineVersion || 'imcore-1.0.0',
        confidence: body.confidence || 0.8,
        raw_answers: body.rawAnswers,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error saving unified result:', insertError);
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }

    console.log('✅ Unified result saved:', result.id);

    return NextResponse.json({
      success: true,
      resultId: result.id,
      message: 'Result saved successfully'
    });

  } catch (error) {
    console.error('Error in unified result save API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

