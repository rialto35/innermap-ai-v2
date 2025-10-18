import { ReactNode } from 'react'

interface SectionCardProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  tone?: 'default' | 'highlight'
}

const toneStyles: Record<'default' | 'highlight', string> = {
  default: 'bg-white/5 border-white/10',
  highlight: 'bg-gradient-to-br from-violet-500/15 via-cyan-500/10 to-white/5 border-violet-500/20'
}

export default function SectionCard({ title, icon, children, footer, tone = 'default' }: SectionCardProps) {
  return (
    <div className={`rounded-3xl border p-6 shadow-lg shadow-black/20 backdrop-blur ${toneStyles[tone]}`}>
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-3">
          {icon && <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white">{icon}</div>}
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        </div>
      )}

      <div className="space-y-4 text-sm text-white/80">
        {children}
      </div>

      {footer && <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/60">{footer}</div>}
    </div>
  )
}

