import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const HoroscopeBodySchema = z.object({
  lunarBirth: z.string().optional(),
  solarBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  birthTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:MM or HH:MM:SS)'),
  location: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle()

    if (userError || !user) {
      console.error('User lookup error:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 요청 본문 파싱 및 검증
    const json = await req.json()
    const validationResult = HoroscopeBodySchema.safeParse(json)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // TODO: 실제 만세력 계산 로직 또는 외부 API 연동
    // 현재는 placeholder 데이터 사용
    const sajuData = {
      year: { heavenlyStem: '甲', earthlyBranch: '子' },
      month: { heavenlyStem: '乙', earthlyBranch: '丑' },
      day: { heavenlyStem: '丙', earthlyBranch: '寅' },
      time: { heavenlyStem: '丁', earthlyBranch: '卯' },
      elements: {
        wood: 2,
        fire: 1,
        earth: 1,
        metal: 0,
        water: 0,
      },
      dominantElement: 'wood',
    }

    const dailyFortune = generateDailyFortune(sajuData)

    // DB에 저장
    const { data: horoscope, error: insertError } = await supabaseAdmin
      .from('horoscope')
      .insert({
        user_id: user.id,
        lunar_birth: data.lunarBirth ?? null,
        solar_birth: data.solarBirth,
        birth_time: data.birthTime,
        location: data.location ?? null,
        saju_data: sajuData,
        daily_fortune: dailyFortune,
      })
      .select()
      .single()

    if (insertError) {
      console.error('DB insert error:', insertError)
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      horoscope: {
        id: horoscope.id,
        solarBirth: horoscope.solar_birth,
        lunarBirth: horoscope.lunar_birth,
        birthTime: horoscope.birth_time,
        location: horoscope.location,
        sajuData: horoscope.saju_data,
        dailyFortune: horoscope.daily_fortune,
        createdAt: horoscope.created_at,
      },
    })
  } catch (error) {
    console.error('Horoscope API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 임시 운세 생성 함수 (나중에 실제 알고리즘으로 교체)
function generateDailyFortune(sajuData: any): string {
  const fortunes = [
    '오늘은 새로운 시작에 좋은 날입니다. 긍정적인 마음으로 도전하세요.',
    '인간관계에서 좋은 소식이 있을 것입니다. 주변 사람들과 소통하세요.',
    '재물운이 상승하는 날입니다. 투자나 계약에 유리합니다.',
    '건강에 유의하세요. 충분한 휴식이 필요한 시기입니다.',
    '창의력이 발휘되는 날입니다. 새로운 아이디어를 실행에 옮기세요.',
  ]
  
  const index = Math.floor(Math.random() * fortunes.length)
  return fortunes[index]
}

