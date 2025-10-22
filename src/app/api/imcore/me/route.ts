import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser } from '@/lib/db/users'
import { getLatestTestResult } from '@/lib/db/testResults'
import { HEROES_144 } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'
import { computeBig5Percentiles, computeMBTIRatios } from '@/lib/psychometrics'
import { computeInner9Scores } from '@/core/im-core/inner9'
import { supabaseAdmin } from '@/lib/supabase'
import { runAnalysis } from '@/core/im-core'

export const dynamic = 'force-dynamic'

// 메모리 캐시 (개발용 - 프로덕션에서는 Redis 등 사용 권장)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 0 // 개발 중 캐시 비활성화 (프로덕션에서는 30000으로 변경)

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
  const strengths = entries.filter(([, v]) => v >= 70).map(([k]) => abilityMap[k as keyof typeof abilityMap])
  const weaknesses = entries.filter(([, v]) => v <= 30).map(([k]) => abilityMap[k as keyof typeof abilityMap])
  
  return {
    strengths: strengths.length > 0 ? strengths : ['균형잡힌 성향'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['특별한 약점 없음']
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // 세션 안전 추출
    const provider = (session as any)?.provider
    const providerId = (session as any)?.providerId
    // 이메일이 같아도 소셜별로 계정을 분리하기 위해 prefix된 effectiveEmail 사용
    const email = (() => {
      const raw = session?.user?.email
      if (provider && provider !== 'google') {
        if (raw) return `${provider}:${raw}`
        if (providerId) return `${provider}:${providerId}`
      }
      return raw || (provider && providerId ? `${provider}:${providerId}` : undefined)
    })()
    const name = session?.user?.name || null
    const image = session?.user?.image || null

    // 일부 소셜(Kakao 등)은 이메일 제공이 없을 수 있음 → providerId로 식별 허용
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 캐시 확인
    const cacheKey = `user_${email}`
    const cached = cache.get(cacheKey)
    const now = Date.now()
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('Returning cached data for:', email)
      return NextResponse.json(cached.data)
    }

    // 사용자 조회 또는 생성
    console.log('Creating/finding user for:', email)
    const user = await findOrCreateUser({
      email,
      name,
      image,
      provider: provider || 'google',
      providerId
    })

    if (!user) {
      console.error('Failed to create/find user for:', email)
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
    }
    
    console.log('User found/created:', user.id)

    // 최신 검사 결과 조회
    console.log('Fetching latest test result for user:', user.id)
    const latestResult = await getLatestTestResult(user.id, 'imcore')
    console.log('Latest test result:', latestResult ? 'Found' : 'Not found')

    // 최신 Inner9 분석 결과 조회 (results 테이블에서)
    let latestInner9Result = null;
    if (latestResult) {
      try {
        const { data: inner9Data, error: inner9Error } = await supabaseAdmin
          .from('results')
          .select('inner9_scores, inner_nine, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (!inner9Error && inner9Data) {
          latestInner9Result = inner9Data;
          console.log('Latest Inner9 result:', latestInner9Result);
        }
      } catch (error) {
        console.error('Error fetching Inner9 result:', error);
      }
    }

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

      // Calculate percentiles and ratios for default data
      const defaultBig5 = { O: 0.70, C: 0.50, E: 0.80, A: 0.90, N: 0.20 }
      const defaultBig5Percentiles = computeBig5Percentiles(defaultBig5)
      const defaultMBTIRatios = computeMBTIRatios(defaultHero.mbti)
      // Compute Inner9 using engine for default preview
      let defaultInner9: any = undefined
      try {
        const analysis = await runAnalysis({ big5: defaultBig5, mbti: defaultHero.mbti as any, locale: 'ko-KR' })
        defaultInner9 = analysis.inner9
      } catch {}
      const defaultInner9Scores = computeInner9Scores(defaultBig5Percentiles, defaultHero.mbti as any, undefined, false)

      const responseData = {
        user: {
          id: user.id,
          name: user.name || name || undefined,
          email: user.email,
          image: user.image || image || undefined
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
        inner9: defaultInner9,
        inner9_scores: defaultInner9Scores,
        big5Percentiles: defaultBig5Percentiles,
        mbtiRatios: defaultMBTIRatios,
        growth: { innate: 50, acquired: 50, conscious: 50, unconscious: 50, growth: 50, stability: 50, harmony: 50, individual: 50 },
      gem: {
        name: defaultStone.name,
        nameEn: defaultStone.nameEn?.toLowerCase() || 'arche',
        icon: defaultStone.icon || '💎',
        keywords: defaultStone.keywords || ['성장', '발전'],
        summary: defaultStone.summary || defaultStone.description,
        color: defaultStone.color || '#8B5CF6'
      },
      tribe: {
        name: defaultTribe.tribe.nameKo,
        nameEn: defaultTribe.tribe.nameEn?.split(' ')[0].toLowerCase() || 'lumin',
        color: defaultTribe.tribe.color,
        essence: defaultTribe.tribe.essence || {
          coreValue: defaultTribe.tribe.coreValue,
          philosophy: defaultTribe.tribe.description
        }
      },
        ...extractStrengthsWeaknesses(defaultHero.abilities),
        genderPreference: 'male',
        hasTestResult: false
      }

      // 캐시에 저장
      cache.set(cacheKey, { data: responseData, timestamp: now })
      return NextResponse.json(responseData)
    }

    // 검사 결과가 있는 경우 DB 데이터 반환
    console.log('Using saved test result:', {
      mbti: latestResult.mbti_type,
      reti: latestResult.reti_top1,
      hero: latestResult.hero_name,
      birthDate: latestResult.birth_date
    })
    
    // 영웅 매칭 (MBTI + RETI 조합으로 정확한 매칭)
    const hero = HEROES_144.find(h => 
      h.mbti === latestResult.mbti_type && 
      h.reti === latestResult.reti_top1.replace('r', '')
    ) || HEROES_144[0]
    
    console.log('Hero matching:', {
      savedMBTI: latestResult.mbti_type,
      savedRETI: latestResult.reti_top1,
      foundHero: hero ? `${hero.mbti}-${hero.reti}` : 'Not found',
      heroName: hero?.name
    })
    const tribe = getTribeFromBirthDate(latestResult.birth_date || '1990-01-01')
    const stone = recommendStone({
      openness: latestResult.big5_openness,
      conscientiousness: latestResult.big5_conscientiousness,
      extraversion: latestResult.big5_extraversion,
      agreeableness: latestResult.big5_agreeableness,
      neuroticism: latestResult.big5_neuroticism
    })

    // Calculate percentiles and ratios from saved data
    const savedBig5 = {
      O: latestResult.big5_openness / 100,
      C: latestResult.big5_conscientiousness / 100,
      E: latestResult.big5_extraversion / 100,
      A: latestResult.big5_agreeableness / 100,
      N: latestResult.big5_neuroticism / 100
    }
    const savedBig5Percentiles = computeBig5Percentiles(savedBig5)
    const savedMBTIRatios = computeMBTIRatios(latestResult.mbti_type)
    const savedInner9Scores = computeInner9Scores(savedBig5Percentiles, latestResult.mbti_type as any, undefined, false)

    const responseData = {
      user: {
        id: user.id,
        name: user.name || name || undefined,
        email: user.email,
        image: user.image || image || undefined
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
        O: latestResult.big5_openness ?? null,
        C: latestResult.big5_conscientiousness ?? null,
        E: latestResult.big5_extraversion ?? null,
        A: latestResult.big5_agreeableness ?? null,
        N: latestResult.big5_neuroticism ?? null
      },
      big5Percentiles: savedBig5Percentiles,
      mbtiRatios: savedMBTIRatios,
      inner9_scores: latestInner9Result?.inner9_scores || savedInner9Scores,
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
        nameEn: stone.nameEn?.toLowerCase() || 'arche',
        icon: stone.icon || '💎',
        keywords: stone.keywords || ['성장', '발전'],
        summary: stone.summary || stone.description,
        color: stone.color || '#8B5CF6'
      },
      tribe: {
        name: tribe.tribe.nameKo,
        nameEn: tribe.tribe.nameEn?.split(' ')[0].toLowerCase() || 'lumin',
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
    }

    // 캐시에 저장
    cache.set(cacheKey, { data: responseData, timestamp: now })
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}