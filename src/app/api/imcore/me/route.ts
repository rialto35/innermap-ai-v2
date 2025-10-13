import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { score, mbtiFromScores, retiTop2, retiTieBreak, big5Scaled } from '@/lib/scoring'
import { selectHero } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'
import { questions } from '@/lib/questions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: 실제 DB에서 사용자의 최신 검사 결과 조회
    // 현재는 sessionStorage 기반으로 임시 구현
    const searchParams = request.nextUrl.searchParams
    const testResult = searchParams.get('result')
    
    if (!testResult) {
      // 검사 결과가 없는 경우 기본값 반환
      const defaultScores = {
        MBTI: { E: 0.5, I: -0.5, S: 0.2, N: 0.8, T: 0.1, F: 0.9, J: 0.7, P: 0.3 },
        Big5: { O: 0.7, C: 0.5, E_b5: 0.8, A: 0.9, N_b5: 0.2 },
        RETI: { r1: 0.1, r2: 0.2, r3: 0.3, r4: 0.4, r5: 0.5, r6: 0.6, r7: 0.7, r8: 0.8, r9: 0.9 },
        Growth: { innate: 60, acquired: 70, conscious: 50, unconscious: 80, growth: 75, stability: 65, harmony: 85, individual: 55 },
      }
      
      const mbti = mbtiFromScores(defaultScores)
      const reti = retiTop2(defaultScores)
      const baseR = Number(reti.top1[0].slice(1))
      const tiebroken = retiTieBreak(mbti.type, defaultScores, baseR)
      const big5 = big5Scaled(defaultScores)
      const hero = selectHero(mbti.type, tiebroken, defaultScores)
      const tribe = getTribeFromBirthDate('1990-01-01')
      const stone = recommendStone({
        openness: big5.O,
        conscientiousness: big5.C,
        extraversion: big5.E,
        agreeableness: big5.A,
        neuroticism: big5.N
      })

      return NextResponse.json({
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
        hero: {
          name: hero.name,
          mbti: hero.mbti,
          reti: hero.reti,
          tagline: hero.description || '당신의 내면 영웅',
          level: 12,
          exp: { current: 340, next: 500 }
        },
        mbti: {
          type: mbti.type,
          confidence: mbti.conf
        },
        reti: {
          top1: reti.top1,
          top2: reti.top2
        },
        big5: big5,
        growth: defaultScores.Growth,
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
        weaknesses: hero.weaknesses || ['지속성 저하', '우선순위 분산', '감정 과몰입']
      })
    }

    // 검사 결과가 있는 경우 파싱하여 반환
    let result
    try {
      result = JSON.parse(testResult)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid test result format' }, { status: 400 })
    }

    const mbti = mbtiFromScores(result.scores)
    const reti = retiTop2(result.scores)
    const baseR = Number(reti.top1[0].slice(1))
    const tiebroken = retiTieBreak(mbti.type, result.scores, baseR)
    const big5 = big5Scaled(result.scores)
    const hero = selectHero(mbti.type, tiebroken, result.scores)
    const tribe = getTribeFromBirthDate(result.birthDate || '1990-01-01')
    const stone = recommendStone({
      openness: big5.O,
      conscientiousness: big5.C,
      extraversion: big5.E,
      agreeableness: big5.A,
      neuroticism: big5.N
    })

    return NextResponse.json({
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      hero: {
        name: hero.name,
        mbti: hero.mbti,
        reti: hero.reti,
        tagline: hero.description || '당신의 내면 영웅',
        level: 12,
        exp: { current: 340, next: 500 }
      },
      mbti: {
        type: mbti.type,
        confidence: mbti.conf
      },
      reti: {
        top1: reti.top1,
        top2: reti.top2
      },
      big5: big5,
      growth: result.scores.Growth,
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
      weaknesses: hero.weaknesses || ['지속성 저하', '우선순위 분산', '감정 과몰입']
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
