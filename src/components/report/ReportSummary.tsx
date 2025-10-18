import Big5RadarChart from '@/components/Big5RadarChart'
import SectionCard from '@/components/layout/SectionCard'

interface ReportSummaryProps {
  heroName: string
  heroTribe?: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  summaryMd?: string
}

export default function ReportSummary({ heroName, heroTribe, status, summaryMd }: ReportSummaryProps) {
  return (
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
  )
}

