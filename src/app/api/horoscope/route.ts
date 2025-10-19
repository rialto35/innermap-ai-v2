import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateHoroscope } from '@/lib/horoscope'

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

    // 실제 만세력 계산 및 AI 해석 수행
    const { saju, analysis } = await calculateHoroscope({
      solarBirth: data.solarBirth,
      lunarBirth: data.lunarBirth,
      birthTime: data.birthTime,
      location: data.location,
    })

    const sajuData = saju
    const dailyFortune = analysis

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


