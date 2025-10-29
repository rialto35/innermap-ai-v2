import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { findOrCreateUser } from '@/lib/db/users'
import { supabaseAdmin } from '@/lib/supabase'
import { matchHero } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'
import { generateInner9Narrative } from '@/lib/analysis/inner9Narrative'
import { detailedMBTIAnalysis, detailedRETIAnalysis } from '@/data/detailedAnalysis.js'

export const dynamic = 'force-dynamic'

// Big5 기반 강점/약점 추출 함수
function extractBig5StrengthsWeaknesses(big5: any): {
  strengths: string[];
  weaknesses: string[];
} {
  const traitNames: Record<string, string> = {
    O: '개방성',
    C: '성실성',
    E: '외향성',
    A: '친화성',
    N: '신경성 관리',
  };
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (!big5) return { strengths, weaknesses };
  
  for (const [trait, score] of Object.entries(big5) as Array<[string, number]>) {
    if (typeof score === 'number') {
      if (score >= 70) strengths.push(traitNames[trait] || trait);
      else if (score <= 30) weaknesses.push(traitNames[trait] || trait);
    }
  }
  
  return { strengths, weaknesses };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any

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
      
      console.log('🔍 [imcore/me] Result:', { 
        mbti: result?.mbti, 
        big5: result?.big5, 
        inner9: result?.inner9,
        keywords: result?.keywords,
        world: result?.world,
        error: resultError 
      })
      
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

    // 통합 분석 데이터 생성
    const big5Analysis = extractBig5StrengthsWeaknesses(latestResult.big5 || {})
    
    // Convert Inner9 data from { axes: [...], labels: [...] } to Record<string, number>
    let inner9Scores: Record<string, number> | null = null
    if (latestResult.inner9) {
      const inner9Data = latestResult.inner9 as any
      if (inner9Data.axes && inner9Data.labels) {
        // 한글 라벨 매핑
        const labelMap: Record<string, string> = {
          'creation': '창조',
          'balance': '균형',
          'intuition': '직관',
          'analysis': '분석',
          'harmony': '조화',
          'drive': '추진력',
          'reflection': '성찰',
          'empathy': '공감',
          'discipline': '절제'
        }
        
        inner9Scores = {}
        for (let i = 0; i < inner9Data.labels.length; i++) {
          const label = inner9Data.labels[i].toLowerCase() // 'Creation' -> 'creation'
          const koreanLabel = labelMap[label] || label // 한글로 변환
          inner9Scores[koreanLabel] = inner9Data.axes[i]
        }
        console.log('🔍 [imcore/me] Converted inner9Scores:', inner9Scores)
      }
    }
    
    const inner9Narrative = inner9Scores 
      ? generateInner9Narrative(inner9Scores) 
      : null
    
    const mbtiType = latestResult.mbti
    const retiCode = String(latestResult.world?.reti ?? '1')

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
      analysis: {
      big5: {
          strengths: big5Analysis.strengths,
          weaknesses: big5Analysis.weaknesses,
        },
        inner9: inner9Narrative ? {
          strengths: inner9Narrative.strengths.map(s => s.dimension),
          growthAreas: inner9Narrative.growthAreas.map(g => g.dimension),
        } : null,
        mbti: detailedMBTIAnalysis[mbtiType as keyof typeof detailedMBTIAnalysis] ? {
          strengths: detailedMBTIAnalysis[mbtiType as keyof typeof detailedMBTIAnalysis].strengths,
          challenges: detailedMBTIAnalysis[mbtiType as keyof typeof detailedMBTIAnalysis].challenges,
        } : null,
        reti: detailedRETIAnalysis[retiCode as keyof typeof detailedRETIAnalysis] ? {
          coreTraits: detailedRETIAnalysis[retiCode as keyof typeof detailedRETIAnalysis].coreTraits,
          challenges: detailedRETIAnalysis[retiCode as keyof typeof detailedRETIAnalysis].challenges,
        } : null,
      },
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