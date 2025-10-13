import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { findOrCreateUser } from '@/lib/db/users'
import { getLatestTestResult } from '@/lib/db/testResults'
import { selectHero, HEROES_144 } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자 조회 또는 생성
    const user = await findOrCreateUser({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider: 'google' // TODO: session에서 provider 가져오기
    })

    if (!user) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }

    // 최신 검사 결과 조회
    const latestResult = await getLatestTestResult(user.id, 'imcore')

    // 검사 결과가 없는 경우 기본값 반환
    if (!latestResult) {
      // 기본 영웅 (ENFP-7)
      const defaultHero = HEROES_144.find(h => h.mbti === 'ENFP' && h.reti === '7') || HEROES_144[0]
      const defaultTribe = getTribeFromBirthDate('1990-01-01')
      const defaultStone = recommendStone({
        openness: 70,
        conscientiousness: 50,
        extraversion: 80,
        agreeableness: 90,
        neuroticism: 20
      })

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name || session.user.name,
          email: user.email,
          image: user.image || session.user.image,
          level: user.level,
          exp: {
            current: user.exp_current,
            next: user.exp_next
          }
        },
        hero: {
          id: defaultHero.id,
          name: defaultHero.name,
          mbti: defaultHero.mbti,
          reti: defaultHero.reti,
          tagline: defaultHero.tagline,
          level: user.level,
          exp: { current: user.exp_current, next: user.exp_next }
        },
        mbti: {
          type: 'ENFP',
          confidence: { EI: 0.75, SN: 0.80, TF: 0.85, JP: 0.70 }
        },
        reti: {
          top1: ['r7', 0.85],
          top2: ['r3', 0.72]
        },
        big5: {
          O: 70,
          C: 50,
          E: 80,
          A: 90,
          N: 20
        },
        growth: {
          innate: 60,
          acquired: 70,
          conscious: 50,
          unconscious: 80,
          growth: 75,
          stability: 65,
          harmony: 85,
          individual: 55
        },
        gem: {
          name: defaultStone.name,
          icon: defaultStone.icon,
          keywords: defaultStone.keywords,
          summary: defaultStone.summary,
          color: defaultStone.color
        },
        tribe: {
          name: defaultTribe.tribe.nameKo,
          nameEn: defaultTribe.tribe.nameEn,
          color: defaultTribe.tribe.color,
          essence: defaultTribe.tribe.essence
        },
        strengths: defaultHero.strengths || ['영감 전파', '공감 리더십', '창의적 시도'],
        weaknesses: defaultHero.weaknesses || ['지속성 저하', '우선순위 분산', '감정 과몰입'],
        hasTestResult: false
      })
    }

    // 검사 결과가 있는 경우 DB 데이터 반환
    const hero = HEROES_144.find(h => h.id === latestResult.hero_id) || HEROES_144[0]
    const tribe = getTribeFromBirthDate(latestResult.birth_date || '1990-01-01')
    const stone = recommendStone({
      openness: latestResult.big5_openness,
      conscientiousness: latestResult.big5_conscientiousness,
      extraversion: latestResult.big5_extraversion,
      agreeableness: latestResult.big5_agreeableness,
      neuroticism: latestResult.big5_neuroticism
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || session.user.name,
        email: user.email,
        image: user.image || session.user.image,
        level: user.level,
        exp: {
          current: user.exp_current,
          next: user.exp_next
        }
      },
      hero: {
        id: hero.id,
        name: hero.name,
        mbti: hero.mbti,
        reti: hero.reti,
        tagline: hero.tagline,
        level: user.level,
        exp: { current: user.exp_current, next: user.exp_next }
      },
      mbti: {
        type: latestResult.mbti_type,
        confidence: latestResult.mbti_confidence
      },
      reti: {
        top1: [latestResult.reti_top1, latestResult.reti_scores?.[latestResult.reti_top1] || 0],
        top2: latestResult.reti_top2 ? [latestResult.reti_top2, latestResult.reti_scores?.[latestResult.reti_top2] || 0] : null
      },
      big5: {
        O: latestResult.big5_openness,
        C: latestResult.big5_conscientiousness,
        E: latestResult.big5_extraversion,
        A: latestResult.big5_agreeableness,
        N: latestResult.big5_neuroticism
      },
      growth: {
        innate: latestResult.growth_innate,
        acquired: latestResult.growth_acquired,
        conscious: latestResult.growth_conscious,
        unconscious: latestResult.growth_unconscious,
        growth: latestResult.growth_growth,
        stability: latestResult.growth_stability,
        harmony: latestResult.growth_harmony,
        individual: latestResult.growth_individual
      },
      gem: {
        name: stone.name,
        icon: stone.icon,
        keywords: stone.keywords,
        summary: stone.summary,
        color: stone.color
      },
      tribe: {
        name: tribe.tribe.nameKo,
        nameEn: tribe.tribe.nameEn,
        color: tribe.tribe.color,
        essence: tribe.tribe.essence
      },
      strengths: hero.strengths || ['영감 전파', '공감 리더십', '창의적 시도'],
      weaknesses: hero.weaknesses || ['지속성 저하', '우선순위 분산', '감정 과몰입'],
      hasTestResult: true,
      testResultId: latestResult.id,
      testDate: latestResult.created_at
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
