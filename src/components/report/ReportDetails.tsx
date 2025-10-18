import ReportMarkdown from '@/components/report/ReportMarkdown'
import SectionCard from '@/components/layout/SectionCard'
import RightSidebar from '@/components/layout/RightSidebar'
import RightSidebarSection from '@/components/layout/RightSidebarSection'

interface ReportDetailsProps {
  summaryMd?: string
  status: 'queued' | 'processing' | 'ready' | 'failed'
  error?: string | null
  hero?: { name: string; tribe?: string }
  reportId: string
  visuals?: {
    big5RadarUrl?: string | null
    auxBarsUrl?: string | null
    growthVectorUrl?: string | null
    generated_at?: string | null
  }
}

export default function ReportDetails({ summaryMd, status, error, hero, reportId, visuals }: ReportDetailsProps) {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,_1fr)_320px]">
      <div className="space-y-6">
        <SectionCard title="LLM 내러티브" icon="🧠" tone={status === 'ready' ? 'default' : 'highlight'}>
          {status === 'ready' && summaryMd ? (
            <ReportMarkdown content={summaryMd} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-sm text-white/60">
              {status === 'failed'
                ? error || '리포트 생성에 실패했습니다. 다시 시도해주세요.'
                : '리포트가 생성되면 상세 내러티브가 표시됩니다.'}
            </div>
          )}
        </SectionCard>

        <SectionCard title="시각화 리소스" icon="🖼️">
          <div className="grid gap-4 text-sm text-white/70">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="font-medium text-white/90">Big5 레이더</div>
                <div className="text-xs text-white/50">reports/{reportId}/charts/big5.svg</div>
              </div>
              {visuals?.big5RadarUrl ? (
                <a href={visuals.big5RadarUrl} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200">
                  열기 ↗
                </a>
              ) : (
                <span className="text-xs text-white/40">생성대기</span>
              )}
            </div>
            {/* 향후 aux/growth 시각화가 추가되면 여기에 배치 */}
          </div>
        </SectionCard>
      </div>

      <RightSidebar>
        <RightSidebarSection title="영웅 정보" accent="sky">
          <div className="space-y-2 text-sm">
            <div className="text-white/80">{hero?.name || '미지의 영웅'}</div>
            <div className="text-white/50">{hero?.tribe || 'Tribe 미정'}</div>
            {visuals?.generated_at && (
              <div className="text-xs text-white/40">
                Visuals generated: {new Date(visuals.generated_at).toLocaleString('ko-KR')}
              </div>
            )}
          </div>
        </RightSidebarSection>

        {status === 'failed' && error && (
          <RightSidebarSection title="오류 로그" accent="amber">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              {error}
            </div>
          </RightSidebarSection>
        )}
      </RightSidebar>
    </div>
  )
}

