import Link from 'next/link'

interface InsightCardProps {
  title: string
  description: string
  icon: string
  href?: string
  status?: 'default' | 'coming'
  accent?: 'blue' | 'green' | 'purple'
}

const accentStyles = {
  blue: {
    card: 'border-blue-400/40 bg-blue-500/10 hover:bg-blue-500/15',
    badge: 'bg-blue-400/20 text-blue-100 border-blue-300/30',
    shadow: 'hover:shadow-blue-500/20'
  },
  green: {
    card: 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15',
    badge: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30',
    shadow: 'hover:shadow-emerald-500/20'
  },
  purple: {
    card: 'border-violet-400/40 bg-violet-500/10 hover:bg-violet-500/15',
    badge: 'bg-violet-400/20 text-violet-100 border-violet-300/30',
    shadow: 'hover:shadow-violet-500/20'
  }
}

export default function InsightCard({
  title,
  description,
  icon,
  href,
  status = 'default',
  accent = 'blue'
}: InsightCardProps) {
  const Wrapper = status === 'coming' || !href ? 'div' : Link
  const wrapperProps =
    status === 'coming' || !href
      ? {}
      : { href, prefetch: false }

  const accentClass = accentStyles[accent]
  const baseCardClass = `group flex flex-col justify-between rounded-3xl border px-8 py-10 text-left transition-all duration-300 ${accentClass.card}`
  const stateClass =
    status === 'coming' || !href
      ? 'cursor-default opacity-70 hover:translate-y-0 hover:shadow-none'
      : `cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${accentClass.shadow}`

  return (
    <Wrapper
      {...wrapperProps}
      className={`${baseCardClass} ${stateClass}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-4xl" aria-hidden>
            {icon}
          </span>
          {status === 'coming' && (
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${accentClass.badge}`}>
              Coming Soon
            </span>
          )}
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-200/80">
          {description}
        </p>
      </div>

      {status !== 'coming' && (
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition group-hover:translate-x-2">
          시작하기
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}

      {status === 'coming' && (
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-200/60">
          준비 중입니다
        </span>
      )}
    </Wrapper>
  )
}
