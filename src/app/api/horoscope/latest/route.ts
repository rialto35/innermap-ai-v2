import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
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

    // 최신 운세 조회
    const { data: horoscope, error: fetchError } = await supabaseAdmin
      .from('horoscope')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('Horoscope fetch error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch horoscope' }, { status: 500 })
    }

    // 데이터가 없으면 null 반환
    if (!horoscope) {
      return NextResponse.json({ horoscope: null })
    }

    return NextResponse.json({
      horoscope: {
        id: horoscope.id,
        solarBirth: horoscope.solar_birth,
        lunarBirth: horoscope.lunar_birth,
        birthTime: horoscope.birth_time,
        location: horoscope.location,
        sajuData: horoscope.saju_data,
        dailyFortune: horoscope.daily_fortune,
        createdAt: horoscope.created_at,
        updatedAt: horoscope.updated_at,
      },
    })
  } catch (error) {
    console.error('Horoscope latest API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

