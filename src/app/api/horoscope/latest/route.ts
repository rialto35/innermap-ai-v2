import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자 ID 조회 (다양한 방식으로 시도)
    let userData = null;
    
    // 1) provider + providerId로 조회 (우선)
    const provider = (session as any)?.provider;
    const providerId = (session as any)?.providerId;
    
    if (provider && providerId) {
      const { data: byProv } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('provider', provider)
        .eq('provider_id', providerId)
        .maybeSingle();
      if (byProv?.id) userData = byProv;
    }
    
    // 2) 이메일로 조회 (fallback)
    if (!userData && session.user?.email) {
      const { data: byEmail } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .maybeSingle();
      if (byEmail?.id) userData = byEmail;
    }

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 사용자의 최신 검사 결과에서 생년월일 조회
    const { data: testResult } = await supabaseAdmin
      .from('test_results')
      .select('birth_date')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!testResult?.birth_date) {
      // 생년월일 데이터가 없으면 null 반환 (입력 모달 표시)
      return NextResponse.json({ horoscope: null });
    }

    // 생년월일 기반 운세 데이터 생성
    const birthDate = new Date(testResult.birth_date);
    const today = new Date();
    
    // 간단한 운세 계산 (실제로는 더 복잡한 사주 로직 사용)
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const birthDayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    const fortuneScore = Math.abs(dayOfYear - birthDayOfYear) % 5 + 1; // 1-5 점수
    const fortuneMessages = [
      "조심스럽게 접근해야 할 날입니다.",
      "평범한 하루가 될 것 같습니다.",
      "좋은 기운이 느껴지는 날입니다.",
      "매우 좋은 운세가 따를 것입니다.",
      "최고의 운세입니다! 중요한 결정에 적합한 날입니다."
    ];

    const horoscopeData = {
      horoscope: {
        id: `horoscope-${userData.id}`,
        solarBirth: testResult.birth_date,
        birthTime: '12:00', // 기본값, 나중에 시간도 입력받을 수 있음
        sajuData: {
          year: { heavenlyStem: '庚', earthlyBranch: '午' },
          month: { heavenlyStem: '戊', earthlyBranch: '寅' },
          day: { heavenlyStem: '甲', earthlyBranch: '子' },
          hour: { heavenlyStem: '丙', earthlyBranch: '寅' },
          elements: {
            wood: 2,
            fire: 3,
            earth: 1,
            metal: 1,
            water: 1
          },
          dominantElement: 'fire'
        },
        dailyFortune: fortuneMessages[fortuneScore - 1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(horoscopeData)
  } catch (error) {
    console.error('Horoscope API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}