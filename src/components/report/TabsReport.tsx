import { ReactNode, useState } from 'react'

interface TabsReportProps {
  summary: ReactNode
  details: ReactNode
  onTabChange?: (tab: 'summary' | 'details') => void
  defaultTab?: 'summary' | 'details'
}

const tabs: Array<{ key: 'summary' | 'details'; label: string; description: string }> = [
  { key: 'summary', label: '요약 리포트', description: '하이라이트와 핵심 수치를 빠르게 확인합니다.' },
  { key: 'details', label: '심층 분석', description: 'LLM이 생성한 서사와 성장 인사이트를 제공합니다.' }
]

export default function TabsReport({ summary, details, defaultTab = 'summary', onTabChange }: TabsReportProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>(defaultTab)

  const handleSwitch = (tab: 'summary' | 'details') => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  const ActiveContent = activeTab === 'summary' ? summary : details

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 backdrop-blur">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">InnerMap Report</div>
          <h2 className="text-xl font-semibold text-white">리포트 보기</h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {tabs.map(({ key, label }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => handleSwitch(key)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
        <p className="mb-6 text-sm text-white/60">
          {tabs.find(t => t.key === activeTab)?.description}
        </p>
        <div className="text-sm text-white/80">
          {ActiveContent}
        </div>
      </div>
    </div>
  )
}

