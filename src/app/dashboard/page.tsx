'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import HeroGrowthCard from "@/components/HeroGrowthCard"

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
  }, [status, router])

  const fetchHeroData = async () => {
    try {
      setLoading(true)
      
      // sessionStorage에서 검사 결과 가져오기
      const storedResult = typeof window !== 'undefined' ? sessionStorage.getItem('result') : null
      
      let resultParam = ''
      if (storedResult) {
        resultParam = `?result=${encodeURIComponent(storedResult)}`
      }

      const response = await fetch(`/api/imcore/me${resultParam}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero data')
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
  }

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
    <div className="max-w-6xl mx-auto p-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <HeroGrowthCard 
          hero={heroData.hero}
          gem={heroData.gem}
          tribe={heroData.tribe}
          growth={heroData.growth}
          strengths={heroData.strengths}
          weaknesses={heroData.weaknesses}
        />
      </div>
      {/* 우측 사이드: 최근 리포트, 추천 루틴 등 추가 */}
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">최근 활동</h3>
        <div className="space-y-3 text-sm text-white/70">
          <div className="p-3 rounded-lg bg-white/5">
            <div className="font-medium">검사 완료</div>
            <div className="text-xs text-white/50">방금 전</div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <div className="font-medium">레벨 업!</div>
            <div className="text-xs text-white/50">2시간 전</div>
          </div>
        </div>
      </div>
    </div>
  )
}