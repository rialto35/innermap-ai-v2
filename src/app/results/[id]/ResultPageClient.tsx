'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamicImport from 'next/dynamic'
import { motion } from 'framer-motion'
import PageContainer from '@/components/layout/PageContainer'
import PageSection from '@/components/layout/PageSection'
import SectionCard from '@/components/layout/SectionCard'
import ResultSkeleton from '@/components/ui/ResultSkeleton'
import ResultBottomBar from '@/components/mobile/ResultBottomBar'
import type { ResultSnapshot } from '@innermap/engine'

// Dynamic imports for charts (client-only)
const Big5RadarChart = dynamicImport(() => import('@/components/Big5RadarChart'), { ssr: false })
const GrowthVectorChart = dynamicImport(() => import('@/components/GrowthVectorChart'), { ssr: false })

export default function ResultPageClient({ id }: { id: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [result, setResult] = useState<ResultSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (!session) return
    const fetchResult = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/results/${id}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
          headers: { 'x-im-client': 'web', 'cache-control': 'no-cache' },
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `Failed to fetch result (${response.status})`)
        }
        const data = await response.json()
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [id, session])

  if (loading || status === 'loading') {
    return <ResultSkeleton />
  }

  if (error || !result) {
    return (
      <PageContainer>
        <SectionCard title="결과를 찾을 수 없습니다" icon="😕" tone="highlight">
          <div className="space-y-3 text-sm text-white/70">
            <p>{error}</p>
            <p className="text-xs text-white/40">검사 ID: {id}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => router.push('/mypage')} className="rounded-xl border border-white/10 px-4 py-2 text-white/80 transition hover:border-white/20 hover:text-white">마이페이지로 돌아가기</button>
              <button onClick={() => router.push('/analyze')} className="rounded-xl border border-violet-500/40 px-4 py-2 text-violet-200 transition hover:border-violet-400/70 hover:text-violet-100">새로운 검사 시작하기</button>
            </div>
            <p className="text-xs text-white/40">💡 검사를 완료하지 않았거나 아직 처리 중일 수 있습니다.</p>
          </div>
        </SectionCard>
      </PageContainer>
    )
  }

  return (
    <>
      <PageContainer>
        <div className="flex flex-col gap-6 pb-24">
          <PageSection
            title="분석 결과 요약"
            description="MBTI · RETI · Big5 기반 인사이트"
            action={
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/report', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ resultId: (result as any).id }),
                    })
                    if (!response.ok) throw new Error('리포트 생성 실패')
                    const data = await response.json()
                    router.push(`/report/${data.reportId}`)
                  } catch (error) {
                    alert('리포트 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
                  }
                }}
                className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
              >
                심층 리포트 생성
              </button>
            }
          >
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl font-semibold text-white mb-2">{(result as any).hero.name}</h1>
              <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                <span className="rounded-full bg-white/10 px-3 py-1">{(result as any).tribe?.type}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{(result as any).stone?.type}</span>
                <span>{new Date((result as any).createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mt-6">
              <SectionCard title="영웅 프로필" icon="🧙" tone="default">
                <div className="flex flex-col items-center gap-4 text-sm text-white/70">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-4xl text-white">
                    {(result as any).hero.name.charAt(0)}
                  </div>
                  <p className="text-center text-white/80">{(result as any).hero.description}</p>
                </div>
              </SectionCard>
            </motion.div>
          </PageSection>

          <PageSection title="성향 지표" description="Big5 기준의 현재 성향 분포를 살펴보세요">
            <div className="grid gap-6 md:grid-cols-2">
              <SectionCard title="Big5 레이더" icon="🌌">
                <div className="h-64">
                  <Big5RadarChart
                    big5={{
                      O: (result as any).big5.openness,
                      C: (result as any).big5.conscientiousness,
                      E: (result as any).big5.extraversion,
                      A: (result as any).big5.agreeableness,
                      N: (result as any).big5.neuroticism,
                    }}
                  />
                </div>
              </SectionCard>
            </div>
          </PageSection>
        </div>
      </PageContainer>

      <ResultBottomBar
        heroThumb={(result as any).hero?.image || '/heroes/default.svg'}
        title={(result as any).hero.name}
        subtitle={`${(result as any).mbti?.type} • Type ${(result as any).reti?.primaryType}`}
        shareUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://innermap-ai-v2.vercel.app'}/results/${id}`}
      />
    </>
  )
}


