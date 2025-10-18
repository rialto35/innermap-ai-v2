import { ReactNode } from 'react'

interface RightSidebarSectionProps {
  title: string
  children: ReactNode
  accent?: string
}

export default function RightSidebarSection({ title, children, accent = 'emerald' }: RightSidebarSectionProps) {
  const accentMap: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-200',
    sky: 'from-sky-500/20 to-sky-500/5 text-sky-200',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-200',
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-200'
  }

  const accentClass = accentMap[accent] ?? accentMap.emerald

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur">
      <div className={`mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accentClass} px-3 py-1 text-xs font-semibold`}>{title}</div>
      <div className="space-y-2 text-sm text-white/70">
        {children}
      </div>
    </div>
  )
}

