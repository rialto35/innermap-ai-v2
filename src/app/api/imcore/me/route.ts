import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser } from '@/lib/db/users'
import { supabaseAdmin } from '@/lib/supabase'
import { matchHero } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    const provider = (session as any)?.provider
    const providerId = (session as any)?.providerId
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

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let user
    try {
      const result = await findOrCreateUser({
        email,
        name,
        image,
        provider: provider || 'google',
        providerId,
      })
      user = result.user
      if (!user) {
        return NextResponse.json({ error: 'Failed to resolve user' }, { status: 500 })
      }
    } catch (error) {
      console.error('User lookup error:', error)
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    // 1. 최신 assessment 조회
    const { data: latest, error: latestError } = await supabaseAdmin
      .from('test_assessments')
      .select('id, user_id, created_at, raw_answers')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    console.log('🔍 [imcore/me] Latest assessment:', { id: latest?.id, created_at: latest?.created_at })

    if (latestError) {
      console.error('[imcore/me] latest assessment fetch error', latestError)
      return NextResponse.json({ error: 'Failed to fetch test result' }, { status: 500 })
    }

    // 2. result 조회 (FK 없이 명시적 조회)
    let latestResult = null
    if (latest) {
      const { data: result, error: resultError } = await supabaseAdmin
        .from('test_assessment_results')
        .select('assessment_id, mbti, big5, keywords, inner9, world, confidence, created_at')
        .eq('assessment_id', latest.id)
        .maybeSingle()
      
      console.log('🔍 [imcore/me] Result:', { mbti: result?.mbti, big5: result?.big5, error: resultError })
      
      if (!resultError && result) {
        latestResult = result
      }
    }

    if (!latest || !latestResult) {
      const responseData = {
        user: {
          id: user.id,
          name: user.name || name || undefined,
          email: user.email,
          image: user.image || image || undefined,
        },
        hasTestResult: false,
      }
      return NextResponse.json(responseData)
    }

    // birthdate 가져오기 (우선순위: user_profiles > raw_answers > world)
    let birthdate = latest.raw_answers?.profile?.birthdate || latestResult.world?.birthdate || null
    
    // user_profiles에서 birthdate 확인 (추가)
    if (!birthdate) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('birthdate')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (profile?.birthdate) {
        birthdate = profile.birthdate
        console.log('📅 [imcore/me] Birthdate from user_profiles:', birthdate)
      }
    }
    
    const tribeMatch = birthdate ? getTribeFromBirthDate(birthdate) : null
    const hero = matchHero(
      latestResult.mbti,
      latestResult.world?.reti ?? latestResult.world?.retiTop ?? latestResult.world?.reti_type ?? '1'
    )
    const stoneInput = {
      openness: latestResult.big5?.O ?? latestResult.big5?.openness ?? 50,
      conscientiousness: latestResult.big5?.C ?? latestResult.big5?.conscientiousness ?? 50,
      extraversion: latestResult.big5?.E ?? latestResult.big5?.extraversion ?? 50,
      agreeableness: latestResult.big5?.A ?? latestResult.big5?.agreeableness ?? 50,
      neuroticism: latestResult.big5?.N ?? latestResult.big5?.neuroticism ?? 50,
    } as const
    const stone = recommendStone(stoneInput)

    const responseData = {
      user: {
        id: user.id,
        name: user.name || name || undefined,
        email: user.email,
        image: user.image || image || undefined,
      },
      hasTestResult: true,
      assessmentId: latest.id,
      testDate: latest.created_at,
      birthDate: birthdate ?? null, // ← 생년월일 추가
      mbti: {
        type: latestResult.mbti,
        confidence: latestResult.confidence ?? null,
      },
      big5: latestResult.big5 ?? null,
      keywords: latestResult.keywords ?? [],
      inner9: latestResult.inner9 ?? null,
      world: latestResult.world ?? null,
      hero: hero
        ? {
            id: hero.id,
            name: hero.name,
            nameEn: hero.nameEn,
            tagline: hero.tagline,
            description: hero.description,
            abilities: hero.abilities,
          }
        : null,
      tribe: tribeMatch
        ? {
            id: tribeMatch.tribe.id,
            name: tribeMatch.tribe.nameKo,
            nameEn: tribeMatch.tribe.nameEn,
            symbol: tribeMatch.tribe.symbol,
            color: tribeMatch.tribe.colorHex,
            essence: tribeMatch.tribe.essence ?? null,
          }
        : null,
      gem: stone
        ? {
            id: stone.id,
            name: stone.nameKo,
            nameEn: stone.nameEn,
            icon: stone.icon ?? '💎',
            color: stone.color ?? '#8B5CF6',
            keywords: stone.keywords ?? [],
            summary: stone.summary ?? stone.description,
            coreValue: stone.coreValue,
            effect: stone.effect,
          }
        : null,
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}