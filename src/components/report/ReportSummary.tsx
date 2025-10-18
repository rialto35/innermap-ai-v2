import Big5RadarChart from '@/components/Big5RadarChart'
import SectionCard from '@/components/layout/SectionCard'

interface ReportSummaryProps {
  heroName: string
  heroTribe?: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  summaryMd?: string
  big5?: {
    O: number
    C: number
    E: number
    A: number
    N: number
  }
}

export default function ReportSummary({ heroName, heroTribe, status, summaryMd, big5 }: ReportSummaryProps) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="요약 인사이트"
        icon="✨"
        tone={status === 'ready' ? 'default' : 'highlight'}
        footer={<span className="text-white/50">InnerMap AI summary snapshot</span>}
      >
        <div className="space-y-3 text-sm text-white/70">
          <p>
            {heroName}과(와) 연결된 {heroTribe || '부족'} 기반 핵심 인사이트입니다.
          </p>
          {status !== 'ready' && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              리포트가 아직 생성 중입니다. 완료되면 자동으로 업데이트됩니다.
            </div>
          )}
          {status === 'ready' && summaryMd && (
            <div className="prose prose-invert max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: summaryMd }} />
          )}
        </div>
      </SectionCard>

      <SectionCard title="성향 프로필" icon="📊">
        {big5 ? (
          <Big5RadarChart big5={big5} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            분석 완료 후 Big5 그래프가 표시됩니다.
          </div>
        )}
      </SectionCard>
    </div>
  )
}

