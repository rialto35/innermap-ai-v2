/**
 * /report/[id] - Deep Report Page
 *
 * 심층 리포트 페이지 (비동기 큐 방식)
 * - 상태 폴링 (queued/processing/ready/failed)
 * - Markdown 렌더링
 * - 시각화 (Big5 레이더, 성장 벡터)
 *
 * @version v1.2.0
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import PageContainer from '@/components/layout/PageContainer'
import PageSection from '@/components/layout/PageSection'
import SectionCard from '@/components/layout/SectionCard'
import TabsReport from '@/components/report/TabsReport'
import ReportSummary from '@/components/report/ReportSummary'
import ReportDetails from '@/components/report/ReportDetails'
import ReportHeader from '@/components/report/ReportHeader'
import ReportStatus from '@/components/report/ReportStatus'
import ReportActions from '@/components/report/ReportActions'

interface ReportData {
  id: string
  user_id: string
  result_id: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  summary_md?: string
  visuals_json?: any
  error_msg?: string
  started_at?: string
  finished_at?: string
  created_at: string
  user?: { name: string }
  hero?: { name: string; tribe: string }
}

interface ResultData {
  id: string
  hero_id: string
  hero_name: string
  engine_version: string
  big5_openness: number
  big5_conscientiousness: number
  big5_extraversion: number
  big5_agreeableness: number
  big5_neuroticism: number
}

interface StatusResponse {
  reportId: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  error?: string
  estimatedTimeRemaining?: number
  startedAt?: string
  finishedAt?: string
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [reportId, setReportId] = useState<string | null>(null)
  const [report, setReport] = useState<ReportData | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)
  const [statusData, setStatusData] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => setReportId(id))
  }, [params])

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirect=/report/' + reportId)
    }
  }, [sessionStatus, router, reportId])

  useEffect(() => {
    if (!reportId) return

    const fetchReport = async () => {
      try {
        setLoading(true)

        const reportRes = await fetch(`/api/report/${reportId}${session ? '' : `?t=${new URLSearchParams(window.location.search).get('t') ?? ''}`}`)
        if (!reportRes.ok) {
          const detail = await reportRes.json().catch(() => null)
          throw new Error(detail?.error?.message || '리포트를 찾을 수 없습니다.')
        }

        const reportData = await reportRes.json()
        setReport(reportData)

        const resultRes = await fetch(`/api/results/${reportData.result_id}`)
        if (resultRes.ok) {
          const raw = await resultRes.json()
          const normalized: ResultData = {
            id: raw.id,
            hero_id: raw.hero?.id || 'default',
            hero_name: raw.hero?.name || '미지의 영웅',
            engine_version: raw.engineVersion || 'v1.0.0',
            big5_openness: raw.big5?.openness ?? 50,
            big5_conscientiousness: raw.big5?.conscientiousness ?? 50,
            big5_extraversion: raw.big5?.extraversion ?? 50,
            big5_agreeableness: raw.big5?.agreeableness ?? 50,
            big5_neuroticism: raw.big5?.neuroticism ?? 50
          }
          setResult(normalized)
        }
      } catch (err) {
        console.error('[ReportPage] Error fetching report:', err)
        setError(err instanceof Error ? err.message : '리포트를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [reportId, session])

  useEffect(() => {
    if (!report || !reportId) return
    if (report.status !== 'queued' && report.status !== 'processing') return

    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await fetch(`/api/report/${reportId}/status`)
        if (statusRes.ok) {
          const status: StatusResponse = await statusRes.json()
          setStatusData(status)

          if (status.status !== report.status) {
            setReport({ ...report, status: status.status })

            if (status.status === 'ready' || status.status === 'failed') {
              const reportRes = await fetch(`/api/report/${reportId}`)
              if (reportRes.ok) {
                const updatedReport = await reportRes.json()
                setReport(updatedReport)
              }
            }
          }
        }
      } catch (err) {
        console.error('[ReportPage] Polling error:', err)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [report, reportId])

  const handleRetry = async () => {
    if (!result) return

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: result.id })
      })

      if (!res.ok) {
        throw new Error('재시도 요청 실패')
      }

      const data = await res.json()
      router.push(`/report/${data.reportId}`)
    } catch (err) {
      console.error('[ReportPage] Retry error:', err)
      alert('재시도 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const big5Scores = useMemo(() => {
    if (!result) return undefined
    return {
      O: result.big5_openness,
      C: result.big5_conscientiousness,
      E: result.big5_extraversion,
      A: result.big5_agreeableness,
      N: result.big5_neuroticism
    }
  }, [result])

  const summaryContent = (
    <ReportSummary
      heroName={report?.hero?.name || result?.hero_name || '영웅'}
      heroTribe={report?.hero?.tribe}
      status={report?.status || 'processing'}
      summaryMd={report?.summary_md}
      big5={big5Scores}
    />
  )

  const detailsContent = report ? (
    <ReportDetails
      summaryMd={report.summary_md}
      status={report.status}
      error={report.error_msg}
      hero={report.hero}
      reportId={report.id}
      visuals={report.visuals_json}
    />
  ) : null

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[40vh] items-center justify-center text-white/70">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white/20" />
            <p>리포트를 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error || !report) {
    return (
      <PageContainer>
        <SectionCard title="리포트를 불러오지 못했습니다" icon="⚠️" tone="highlight">
          <div className="space-y-4 text-sm text-white/70">
            <p>{error || '알 수 없는 오류가 발생했습니다.'}</p>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => router.push('/mypage')}
                className="rounded-xl border border-white/10 px-4 py-2 text-white/80 transition hover:border-white/20 hover:text-white"
              >
                마이페이지로 돌아가기
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl border border-violet-500/40 px-4 py-2 text-violet-200 transition hover:border-violet-400/70 hover:text-violet-100"
              >
                다시 시도
              </button>
            </div>
          </div>
        </SectionCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageSection
          title="AI 리포트"
          description="요약과 심층 분석을 탭으로 전환하며 확인하세요"
          action={<ReportActions reportId={report.id} status={report.status} />}
        >
          {(result || report.hero) && (
            <div className="mb-6">
              <ReportHeader
                heroId={result?.hero_id || 'unknown'}
                heroName={report.hero?.name || result?.hero_name || '영웅'}
                heroTribe={report.hero?.tribe}
                engineVersion={result?.engine_version || 'v1.0'}
                createdAt={report.created_at}
                finishedAt={report.finished_at}
                reportId={report.id}
              />
            </div>
          )}

          <ReportStatus
            status={report.status}
            error={report.error_msg}
            estimatedTimeRemaining={statusData?.estimatedTimeRemaining}
            onRetry={report.status === 'failed' ? handleRetry : undefined}
          />

          <TabsReport summary={summaryContent} details={detailsContent ?? summaryContent} />
        </PageSection>

        <SectionCard title="리포트 안내" icon="ℹ️" footer={<span>© {new Date().getFullYear()} InnerMap AI</span>}>
          <ul className="list-disc space-y-2 pl-5 text-xs text-white/60">
            <li>이 리포트는 개인적 인사이트 제공을 목적으로 하며 의료적 진단이 아닙니다.</li>
            <li>공유 링크는 `/api/share/:id` 엔드포인트를 통해 발급/관리할 수 있습니다.</li>
            <li>시각화 이미지는 Supabase Storage의 `reports/{reportId}/charts` 경로에 저장됩니다.</li>
          </ul>
        </SectionCard>
      </div>
    </PageContainer>
  )
}

