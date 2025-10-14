import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser, updateUserExp } from '@/lib/db/users'
import { saveTestResult } from '@/lib/db/testResults'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 요청 바디 파싱
    const body = await request.json()
    const {
      name,
      birthDate,
      genderPreference,
      mbtiType,
      mbtiConfidence,
      retiTop1,
      retiTop2,
      retiScores,
      big5,
      growth,
      hero,
      tribe,
      stone,
      rawScores
    } = body

    // 필수 필드 검증
    if (!name || !mbtiType || !retiTop1 || !hero || !big5 || !growth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 사용자 조회 또는 생성
    const user = await findOrCreateUser({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider: 'google'
    })

    if (!user) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }

    // 검사 결과 저장
    console.log('Saving test result for user:', user.id)
    console.log('Test data:', { mbtiType, retiTop1, hero: hero.name })
    const result = await saveTestResult({
      userId: user.id,
      testType: 'imcore',
      name,
      birthDate,
      genderPreference: genderPreference || 'male',
      mbtiType,
      mbtiConfidence,
      retiTop1,
      retiTop2,
      retiScores,
      big5,
      growth,
      hero,
      tribe,
      stone,
      rawScores
    })

    if (!result) {
      console.error('Failed to save test result - result is null')
      return NextResponse.json({ error: 'Failed to save test result' }, { status: 500 })
    }
    
    console.log('Test result saved successfully:', result.id)

    // 경험치 추가 (검사 완료 시 100 exp)
    const expResult = await updateUserExp(user.id, 100)

    return NextResponse.json({
      success: true,
      resultId: result.id,
      levelUp: expResult?.levelUp || false,
      newLevel: expResult?.newLevel || user.level,
      message: '검사 결과가 저장되었습니다.'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

