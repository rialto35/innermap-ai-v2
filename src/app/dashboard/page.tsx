'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import HeroGrowthCard from "@/components/HeroGrowthCard"
import Big5RadarChart from "@/components/Big5RadarChart"
import GrowthVectorChart from "@/components/GrowthVectorChart"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [heroData, setHeroData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchHeroData()
    }
  }, [status, router, fetchHeroData])

  const fetchHeroData = useCallback(async () => {
    try {
      setLoading(true)
      
      // DB에서 최신 검사 결과 가져오기
      const response = await fetch('/api/imcore/me')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch hero data')
      }

      const data = await response.json()
      setHeroData(data)
    } catch (error) {
      console.error('Error fetching hero data:', error)
      // 에러 시 기본 데이터 사용
      setHeroData({
        user: {
          name: session?.user?.name || 'Guest',
          email: session?.user?.email || '',
          image: session?.user?.image || ''
        },
        hero: {
          name: "비전의 불꽃",
          subtitle: "감정의 에너지로 세상을 움직이는 영혼의 점화자",
          level: 12,
          exp: { current: 340, next: 500 },
          mbti: "ENFP",
          reti: { code: "R7", score: 1.80 }
        },
        gem: { 
          name: "아우레아", 
          icon: "", 
          keywords: ["균형", "평형", "통합"], 
          summary: "조화로운 중심을 만드는 결정.",
          color: "#8B5CF6"
        },
        tribe: {
          name: "화염의 부족",
          nameEn: "flame",
          color: "#F59E0B",
          essence: { coreValue: "열정", philosophy: "불꽃처럼 타오르는 의지" }
        },
        growth: { innate: 62, acquired: 74, harmony: 68, individual: 55 },
        strengths: ["영감 전파", "공감 리더십", "창의적 시도"],
        weaknesses: ["지속성 저하", "우선순위 분산", "감정 과몰입"]
      })
    } finally {
      setLoading(false)
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p>영웅 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <p>데이터를 불러올 수 없습니다.</p>
          <button 
            onClick={fetchHeroData}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 상단: 영웅 카드 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HeroGrowthCard 
            hero={heroData.hero}
            gem={heroData.gem}
            tribe={heroData.tribe}
            growth={heroData.growth}
            strengths={heroData.strengths}
            weaknesses={heroData.weaknesses}
            genderPreference={heroData.genderPreference || 'male'}
          />
        </div>
        
        {/* 우측 사이드: 최근 활동 */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">최근 활동</h3>
          <div className="space-y-3 text-sm text-white/70">
            {heroData.hasTestResult ? (
              <>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-medium text-emerald-300">✓ 검사 완료</div>
                  <div className="text-xs text-white/50 mt-1">
                    {heroData.testDate ? new Date(heroData.testDate).toLocaleDateString('ko-KR') : '최근'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                  <div className="font-medium text-sky-300">🎯 레벨 {heroData.hero.level}</div>
                  <div className="text-xs text-white/50 mt-1">경험치 {heroData.hero.exp.current}/{heroData.hero.exp.next}</div>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="font-medium text-amber-300">검사를 시작하세요</div>
                <div className="text-xs text-white/50 mt-1">나만의 영웅을 발견하세요</div>
              </div>
            )}
          </div>
          
          {/* 추천 루틴 */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3">오늘의 추천</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer">
                <div className="text-white/80">💭 마음 질문 카드</div>
                <div className="text-white/50">오늘의 질문 확인하기</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer">
                <div className="text-white/80">📊 성장 리포트</div>
                <div className="text-white/50">AI 분석 보기</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단: 차트 섹션 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {heroData.big5 && <Big5RadarChart big5={heroData.big5} />}
        {heroData.growth && <GrowthVectorChart growth={heroData.growth} />}
      </div>
    </div>
  )
}