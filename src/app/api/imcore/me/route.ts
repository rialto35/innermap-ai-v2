import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser } from '@/lib/db/users'
import { getLatestTestResult } from '@/lib/db/testResults'
import { HEROES_144 } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'
import { computeBig5Percentiles, computeMBTIRatios } from '@/lib/psychometrics'
import { toInner9 } from '@/core/im-core/inner9'
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
    console.log('Creating/finding user for:', email, 'provider:', provider, 'providerId:', providerId)
    let user, isNewUser;
    try {
      const result = await findOrCreateUser({
        email,
        name,
        image,
        provider: provider || 'google',
        providerId
      })
      user = result.user;
      isNewUser = result.isNewUser;

      if (!user) {
        console.error('Failed to create/find user for:', email)
        return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
      }
      
      console.log('User found/created:', user.id, 'isNewUser:', isNewUser)
    } catch (error) {
      console.error('User lookup error:', error)
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    // 최신 검사 결과 조회 (test_assessment_results 테이블에서)
    console.log('Fetching latest test result for user:', user.id)
    
    // 먼저 test_assessment_results에서 조회 시도
    const { data: assessmentResult, error: assessmentError } = await supabaseAdmin
      .from('test_assessment_results')
      .select(`
        assessment_id,
        mbti,
        big5,
        keywords,
        inner9,
        world,
        confidence,
        created_at,
        test_assessments!inner(
          user_id,
          raw_answers,
          completed_at
        )
      `)
      .eq('test_assessments.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let latestResult = null
    if (!assessmentError && assessmentResult) {
      // test_assessment_results 데이터를 test_results 형식으로 변환
      latestResult = {
        id: assessmentResult.assessment_id,
        user_id: user.id,
        test_type: 'imcore',
        name: user.name || '사용자',
        birth_date: null,
        gender_preference: 'male',
        mbti_type: assessmentResult.mbti,
        mbti_confidence: {},
        reti_top1: 'r5', // 기본값
        reti_top2: null,
        reti_scores: {},
        big5_openness: assessmentResult.big5?.O ? Math.round(assessmentResult.big5.O * 100) : 50,
        big5_conscientiousness: assessmentResult.big5?.C ? Math.round(assessmentResult.big5.C * 100) : 50,
        big5_extraversion: assessmentResult.big5?.E ? Math.round(assessmentResult.big5.E * 100) : 50,
        big5_agreeableness: assessmentResult.big5?.A ? Math.round(assessmentResult.big5.A * 100) : 50,
        big5_neuroticism: assessmentResult.big5?.N ? Math.round(assessmentResult.big5.N * 100) : 50,
        growth_innate: 50,
        growth_acquired: 50,
        growth_conscious: 50,
        growth_unconscious: 50,
        growth_growth: 50,
        growth_stability: 50,
        growth_harmony: 50,
        growth_individual: 50,
        hero_id: assessmentResult.world?.hero || 'unknown',
        hero_name: assessmentResult.world?.hero || 'Unknown Hero',
        tribe_name: assessmentResult.world?.tribe || null,
        tribe_name_en: assessmentResult.world?.tribe || null,
        stone_name: assessmentResult.world?.stone || null,
        raw_scores: {},
        created_at: assessmentResult.created_at
      }
      console.log('✅ Found assessment result:', latestResult.mbti_type)
    } else {
      // 기존 test_results 테이블에서도 조회 시도 (fallback)
      console.log('Assessment result not found, trying test_results table...')
      latestResult = await getLatestTestResult(user.id, 'imcore')
    }
    
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

    // 검사 결과가 없는 경우 최소한의 사용자 정보만 반환
    if (!latestResult) {
      const responseData = {
        user: {
          id: user.id,
          name: user.name || name || undefined,
          email: user.email,
          image: user.image || image || undefined
        },
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
    
    // 🔍 디버깅: DB에 저장된 실제 값 확인
    console.log('🔍 DB saved values (raw):', {
      mbti_type: latestResult.mbti_type,
      reti_top1: latestResult.reti_top1,
      reti_top1_type: typeof latestResult.reti_top1,
      hero_name: latestResult.hero_name
    })
    
    // 영웅 매칭 (MBTI + RETI 조합으로 정확한 매칭)
    // RETI 값에서 숫자만 추출 (r7, R7, 7 등 모두 처리)
    const retiValue = latestResult.reti_top1?.toString().replace(/[^0-9]/g, '') || '1';
    
    // 1차 시도: MBTI + RETI 정확한 매칭
    let hero = HEROES_144.find(h => 
      h.mbti === latestResult.mbti_type && 
      h.reti === retiValue
    );
    
    // 2차 시도: MBTI만으로 매칭 (RETI 매칭 실패 시)
    if (!hero) {
      console.warn('⚠️ MBTI+RETI 매칭 실패, MBTI만으로 재시도');
      hero = HEROES_144.find(h => h.mbti === latestResult.mbti_type);
    }
    
    // 3차 시도: 최종 fallback
    if (!hero) {
      console.error('❌ Hero 매칭 완전 실패, 기본값 사용');
      hero = HEROES_144[0];
    }
    
    console.log('✅ Hero matching result:', {
      savedMBTI: latestResult.mbti_type,
      savedRETI: latestResult.reti_top1,
      extractedRETI: retiValue,
      foundHero: hero ? `${hero.mbti}-${hero.reti}` : 'Not found',
      heroName: hero?.name,
      matchingStrategy: HEROES_144.find(h => h.mbti === latestResult.mbti_type && h.reti === retiValue) 
        ? 'exact (MBTI+RETI)' 
        : (HEROES_144.find(h => h.mbti === latestResult.mbti_type) ? 'fallback (MBTI only)' : 'default')
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
    const savedInner9Scores = toInner9({
      big5: { o: latestResult.big5_openness, c: latestResult.big5_conscientiousness, e: latestResult.big5_extraversion, a: latestResult.big5_agreeableness, n: latestResult.big5_neuroticism },
      mbti: latestResult.mbti_type as string,
      reti: 5, // 기본값
      weights: { big5: 1, mbti: 0, reti: 0 }
    })
    
    // Inner9 분석 실행 (results 테이블에 없으면 실시간 계산)
    let savedInner9: any = latestInner9Result?.inner_nine
    console.log('Inner9 check:', { 
      hasInner9Result: !!latestInner9Result, 
      hasInner9Data: !!savedInner9,
      inner9Keys: savedInner9 ? Object.keys(savedInner9) : []
    })
    
    if (!savedInner9) {
      console.log('Calculating Inner9 from test_results...')
      try {
        const analysis = await runAnalysis({ 
          big5: savedBig5, 
          mbti: latestResult.mbti_type as any, 
          locale: 'ko-KR' 
        })
        savedInner9 = analysis.inner9
        console.log('Inner9 calculated successfully:', !!savedInner9)
      } catch (error) {
        console.error('Error calculating Inner9:', error)
        savedInner9 = null
      }
    } else {
      console.log('Using existing Inner9 from results table')
    }

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
      inner9: savedInner9,
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