'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

import PageContainer from '@/components/layout/PageContainer'
import PageSection from '@/components/layout/PageSection'
import SectionCard from '@/components/layout/SectionCard'
import RightSidebar from '@/components/layout/RightSidebar'
import RightSidebarSection from '@/components/layout/RightSidebarSection'
import HeroGrowthCard from '@/components/HeroGrowthCard'
import Big5RadarChart from '@/components/Big5RadarChart'
import GrowthVectorChart from '@/components/GrowthVectorChart'

interface GrowthScores {
  innate: number
  acquired: number
  conscious: number
  unconscious: number
  growth: number
  stability: number
  harmony: number
  individual: number
}

interface HeroData {
  hero: any
  gem?: any
  tribe?: any
  growth?: GrowthScores
  strengths?: string[]
  weaknesses?: string[]
  genderPreference?: 'male' | 'female'
  testResultId?: string
  hasTestResult?: boolean
  testDate?: string
  big5?: {
    O: number
    C: number
    E: number
    A: number
    N: number
  }
}

interface RecentReport {
  id: string
  title: string
  tribe: string
  createdAt: string
  status: 'ready' | 'queued' | 'processing' | 'failed'
}

interface UpcomingQuest {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'mid' | 'hard'
}

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [recentReports, setRecentReports] = useState<RecentReport[]>([])
  const [upcomingQuests, setUpcomingQuests] = useState<UpcomingQuest[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    sessionStorage.removeItem('hero_data_cache')
    await signOut({ redirect: false })
    router.push('/')
  }

  const fetchHeroData = useCallback(async () => {
    if (!session?.user?.email) return

    const cacheKey = 'hero_data_cache'
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        const now = Date.now()
        const CACHE_DURATION = 5 * 60 * 1000
        if (now - timestamp < CACHE_DURATION) {
          setHeroData(cachedData)
          setLoading(false)
          return
        }
      } catch {
        /* ignore */
      }
    }

    try {
      setLoading(true)
      const response = await fetch('/api/imcore/me')
      if (!response.ok) {
        throw new Error('Failed to fetch hero data')
      }
      const data = await response.json()
      sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }))
      setHeroData(data)
    } catch (error) {
      console.error('Error fetching hero data:', error)
      setHeroData(null)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.email])

  // TODO: Replace with actual API endpoints
  const fetchRecentReports = useCallback(async () => {
    // Placeholder data
    setRecentReports([
      {
        id: 'demo-report-1',
        title: '탐험가의 성장 리포트',
        tribe: 'Water 부족',
        createdAt: '2025-10-15T12:00:00Z',
        status: 'ready'
      }
    ])
  }, [])

  const fetchUpcomingQuests = useCallback(async () => {
    setUpcomingQuests([
      {
        id: 'quest-1',
        title: '매일 10분 아이디어 노트 작성',
        description: '자유로운 발상을 기록하며 사고 확장 하기',
        difficulty: 'easy'
      },
      {
        id: 'quest-2',
        title: '감정 코칭 세션 예약',
        description: '프로 코치와 1:1 세션으로 감정 밸런스 잡기',
        difficulty: 'mid'
      }
    ])
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/mypage')
      return
    }
    if (status === 'authenticated') {
      fetchHeroData()
      fetchRecentReports()
      fetchUpcomingQuests()
    }
  }, [status, fetchHeroData, fetchRecentReports, fetchUpcomingQuests, router])

  const creationDisplay = useMemo(() => {
    if (!session?.user?.name) return 'InnerMap Explorer'
    return session.user.name
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white/20" />
          <p>마이페이지 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,_1fr)_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-sm uppercase tracking-widest text-white/40">InnerMap Hub</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {creationDisplay}님의 여정
            </h1>
            <p className="mt-2 text-sm text-white/60">
              최근 리포트, 성장 지표, 추천 퀘스트를 한눈에 확인하세요.
            </p>
          </div>

          <PageSection
            title="핵심 요약"
            description="최근 분석 결과를 기반으로 한 영웅 프로필"
            action={(
              <Link
                href="/analyze"
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
              >
                신규 분석 시작
              </Link>
            )}
          >
            {heroData ? (
              <HeroGrowthCard
                hero={heroData.hero}
                gem={heroData.gem}
                tribe={heroData.tribe}
                growth={heroData.growth}
                strengths={heroData.strengths}
                weaknesses={heroData.weaknesses}
                genderPreference={heroData.genderPreference}
                testResultId={heroData.testResultId}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-white/60">
                아직 저장된 분석이 없습니다. 첫 검사를 시작해보세요!
              </div>
            )}
          </PageSection>

          <PageSection
            title="시각화 리포트"
            description="Big5 성향과 성장 벡터를 시각적으로 확인하세요"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {heroData?.big5 ? (
                <SectionCard title="Big5 레이더" icon="🌌">
                  <Big5RadarChart big5={heroData.big5} />
                </SectionCard>
              ) : (
                <SectionCard title="Big5 레이더" icon="🌌" tone="highlight">
                  <div className="text-sm text-white/60">
                    분석을 완료하면 당신만의 Big5 레이더가 자동 생성됩니다.
                  </div>
                </SectionCard>
              )}

              {heroData?.growth ? (
                <SectionCard title="성장 벡터" icon="📈">
                  <GrowthVectorChart growth={heroData.growth} />
                </SectionCard>
              ) : (
                <SectionCard title="성장 벡터" icon="📈" tone="highlight">
                  <div className="text-sm text-white/60">
                    성장 영역을 파악해 맞춤 퀘스트를 추천받으세요.
                  </div>
                </SectionCard>
              )}
            </div>
          </PageSection>

          <PageSection
            title="최근 리포트"
            description="완료된 리포트와 생성 상태를 확인합니다"
            action={(
              <Link
                href="/report"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
              >
                전체 보기
              </Link>
            )}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentReports.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                  아직 생성된 리포트가 없습니다. 분석을 완료하면 자동으로 저장됩니다.
                </div>
              )}
              {recentReports.map(report => (
                <SectionCard
                  key={report.id}
                  title={report.title}
                  icon="📄"
                  footer={(
                    <div className="flex items-center justify-between">
                      <span className="text-white/50">{new Date(report.createdAt).toLocaleString('ko-KR')}</span>
                      <Link href={`/report/${report.id}`} className="text-violet-300 hover:text-violet-200">
                        자세히 보기 →
                      </Link>
                    </div>
                  )}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{report.tribe}</span>
                    <span className={`text-xs ${report.status === 'ready' ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {report.status === 'ready' ? '완료' : '생성 중'}
                    </span>
                  </div>
                </SectionCard>
              ))}
            </div>
          </PageSection>
        </div>

        <RightSidebar>
          <RightSidebarSection title="계정 관리" accent="violet">
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-white/80">{session?.user?.name}</span>
              <span className="text-white/50">{session?.user?.email}</span>
              <button
                onClick={handleLogout}
                className="mt-3 rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300 transition hover:border-red-300/60 hover:text-red-200"
              >
                로그아웃
              </button>
            </div>
          </RightSidebarSection>

          <RightSidebarSection title="추천 퀘스트" accent="emerald">
            {upcomingQuests.length === 0 ? (
              <div className="text-sm text-white/60">현재 추천 퀘스트가 없습니다.</div>
            ) : (
              <div className="space-y-3">
                {upcomingQuests.map(quest => (
                  <div key={quest.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>#{quest.id}</span>
                      <span
                        className={`rounded-full px-2 py-1 ${
                          quest.difficulty === 'easy'
                            ? 'bg-emerald-500/10 text-emerald-200'
                            : quest.difficulty === 'mid'
                              ? 'bg-amber-500/10 text-amber-200'
                              : 'bg-rose-500/10 text-rose-200'
                        }`}
                      >
                        {quest.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-white/90">{quest.title}</div>
                    <p className="mt-1 text-xs text-white/60">{quest.description}</p>
                    <Link
                      href="/analyze"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      실행하기 →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </RightSidebarSection>

          <RightSidebarSection title="리포트 도구" accent="sky">
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href="/report" className="rounded-xl border border-white/10 px-4 py-2 transition hover:border-white/20 hover:text-white">
                리포트 목록 보기
              </Link>
              <Link href="/report" className="rounded-xl border border-white/10 px-4 py-2 transition hover:border-white/20 hover:text-white">
                공유 링크 관리
              </Link>
              <Link href="/report" className="rounded-xl border border-white/10 px-4 py-2 transition hover:border-white/20 hover:text-white">
                PDF 다운로드 기록
              </Link>
            </div>
          </RightSidebarSection>
        </RightSidebar>
      </div>
    </PageContainer>
  )
}
