import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser } from '@/lib/db/users'
import { getLatestTestResult } from '@/lib/db/testResults'
import { selectHero, HEROES_144 } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'

export const dynamic = 'force-dynamic'

// abilities 기반으로 strengths/weaknesses 추출
function extractStrengthsWeaknesses(abilities: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number }) {
  const abilityMap = {
    openness: '개방성',
    conscientiousness: '성실성',
    extraversion: '외향성',
    agreeableness: '친화성',
    neuroticism: '신경성'
  }
  
  const entries = Object.entries(abilities)
  const strengths = entries.filter(([_, v]) => v >= 70).map(([k]) => abilityMap[k as keyof typeof abilityMap])
  const weaknesses = entries.filter(([_, v]) => v <= 30).map(([k]) => abilityMap[k as keyof typeof abilityMap])
  
  return {
    strengths: strengths.length > 0 ? strengths : ['균형잡힌 성향'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['특별한 약점 없음']
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 사용자 조회 또는 생성
    console.log('Creating/finding user for:', session.user.email)
    const user = await findOrCreateUser({
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider: 'google'
    })

    if (!user) {
      console.error('Failed to create/find user for:', session.user.email)
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }
    
    console.log('User found/created:', user.id)

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
          image: user.image || session.user.image
        },
        hero: {
          name: defaultHero.name,
          mbti: defaultHero.mbti,
          reti: defaultHero.reti,
          tagline: defaultHero.tagline || defaultHero.description,
          level: user.level,
          exp: { current: user.exp_current, next: user.exp_next }
        },
        mbti: { type: defaultHero.mbti, confidence: { EI: 0.5, SN: 0.5, TF: 0.5, JP: 0.5 } },
        reti: { top1: [`r${defaultHero.reti}`, 0.5], top2: [`r${defaultHero.reti}`, 0.5] },
        big5: { O: 70, C: 50, E: 80, A: 90, N: 20 },
        growth: { innate: 50, acquired: 50, conscious: 50, unconscious: 50, growth: 50, stability: 50, harmony: 50, individual: 50 },
        gem: {
          name: defaultStone.name,
          icon: defaultStone.icon || '💎',
          keywords: defaultStone.keywords || ['성장', '발전'],
          summary: defaultStone.summary || defaultStone.description,
          color: defaultStone.color || '#8B5CF6'
        },
        tribe: {
          name: defaultTribe.tribe.nameKo,
          nameEn: defaultTribe.tribe.nameEn,
          color: defaultTribe.tribe.color,
          essence: defaultTribe.tribe.essence || {
            coreValue: defaultTribe.tribe.coreValue,
            philosophy: defaultTribe.tribe.description
          }
        },
        ...extractStrengthsWeaknesses(defaultHero.abilities),
        genderPreference: 'male',
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
        image: user.image || session.user.image
      },
      hero: {
        name: hero.name,
        mbti: hero.mbti,
        reti: hero.reti,
        tagline: hero.tagline || hero.description,
        level: user.level,
        exp: { current: user.exp_current, next: user.exp_next }
      },
      mbti: {
        type: latestResult.mbti_type,
        confidence: latestResult.mbti_confidence
      },
      reti: {
        top1: [latestResult.reti_top1, latestResult.reti_scores[latestResult.reti_top1]],
        top2: latestResult.reti_top2 ? [latestResult.reti_top2, latestResult.reti_scores[latestResult.reti_top2]] : null
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
        icon: stone.icon || '💎',
        keywords: stone.keywords || ['성장', '발전'],
        summary: stone.summary || stone.description,
        color: stone.color || '#8B5CF6'
      },
      tribe: {
        name: tribe.tribe.nameKo,
        nameEn: tribe.tribe.nameEn,
        color: tribe.tribe.color,
        essence: tribe.tribe.essence || {
          coreValue: tribe.tribe.coreValue,
          philosophy: tribe.tribe.description
        }
      },
      ...extractStrengthsWeaknesses(hero.abilities),
      genderPreference: latestResult.gender_preference || 'male',
      hasTestResult: true,
      testResultId: latestResult.id,
      testDate: latestResult.created_at
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}