import { ReactNode } from 'react'

interface PageSectionProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function PageSection({ title, description, action, children }: PageSectionProps) {
  return (
    <section className="space-y-4">
      {(title || description || action) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            {description && <p className="text-sm text-white/60">{description}</p>}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
        {children}
      </div>
    </section>
  )
}

