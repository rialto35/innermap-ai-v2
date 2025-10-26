import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // params를 await로 해결
    const { id } = await params

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

    // 특정 운세 조회 (본인 것만)
    const { data: horoscope, error: fetchError } = await supabaseAdmin
      .from('horoscope')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // 본인 운세만 조회
      .maybeSingle()

    if (fetchError) {
      console.error('Horoscope fetch error:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch horoscope' }, { status: 500 })
    }

    // 데이터가 없거나 권한이 없음
    if (!horoscope) {
      return NextResponse.json({ error: 'Horoscope not found' }, { status: 404 })
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
    console.error('Horoscope detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

