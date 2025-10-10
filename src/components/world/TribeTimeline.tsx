import tribesData from '@/data/innermapTribes.json'

const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const SEASON_BADGE: Record<string, { label: string; className: string }> = {
  겨울: { label: '겨울 · Water', className: 'bg-sky-500/15 text-sky-100 border-sky-400/30' },
  봄: { label: '봄 · Wood', className: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/30' },
  여름: { label: '여름 · Fire', className: 'bg-rose-500/15 text-rose-100 border-rose-400/30' },
  가을: { label: '가을 · Earth/Metal', className: 'bg-amber-500/15 text-amber-100 border-amber-400/30' }
}

interface TribeDetail {
  id: string
  nameKor: string
  nameEng: string
  branch: string
  branchKor: string
  season: string
  seasonEng: string
  timeRange: string
  symbol: {
    icon: string
    iconEng: string
    color: {
      name: string
      nameEng: string
      hex: string
    }
  }
  essence: {
    coreValue: string
    archetype: string
    opposition?: string
    philosophy: string
  }
}

const orderedTribes = [...(tribesData as TribeDetail[])].sort(
  (a, b) => BRANCH_ORDER.indexOf(a.branch) - BRANCH_ORDER.indexOf(b.branch)
)

export default function TribeTimeline() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Twelve Tribes</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">12부족 시간의 고리</h2>
          <p className="mt-3 text-base md:text-lg text-slate-300/80">
            자정의 텐브라부터 황혼의 네바까지, 하루 24시간과 사주 12지지를 따라 흐르는 InnerMap 세계의 부족을 만나보세요.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <div className="relative flex min-w-[980px] gap-6 pb-4">
            <div className="pointer-events-none absolute left-6 right-6 top-14 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />

            {orderedTribes.map((tribe, index) => {
              const badge = SEASON_BADGE[tribe.season] ?? SEASON_BADGE['봄']

              return (
                <div
                  key={tribe.id}
                  className="relative flex-1 min-w-[260px] rounded-3xl border border-white/10 bg-white/5 px-6 pb-6 pt-16 transition hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/10 hover:shadow-2xl hover:shadow-sky-500/20"
                >
                  <span className="absolute left-1/2 top-6 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-100" style={{ borderColor: `${tribe.symbol.color.hex}40`, backgroundColor: `${tribe.symbol.color.hex}15` }}>
                    <span className="font-semibold">{String(index + 1).padStart(2, '0')}</span>
                    <span>{tribe.branchKor}({tribe.branch})</span>
                  </span>

                  <div className="flex items-center justify-between text-xs text-slate-300/70">
                    <span>{tribe.timeRange}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="text-2xl font-bold text-white">{tribe.nameKor}</div>
                    <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{tribe.nameEng}</div>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                      style={{ borderColor: `${tribe.symbol.color.hex}80`, backgroundColor: `${tribe.symbol.color.hex}20` }}
                    >
                      <span className="text-center text-[10px] font-semibold text-slate-100 leading-tight">
                        {tribe.symbol.icon.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                    <div className="text-sm text-slate-200/80">
                      <div className="font-medium text-white/90">{tribe.symbol.icon}</div>
                      <div>{tribe.essence.coreValue}</div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-slate-300/80 line-clamp-4">
                    {tribe.essence.philosophy}
                  </p>

                  {tribe.essence.opposition && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200/60">
                      <span className="font-semibold text-slate-200">대립 부족 · </span>
                      {tribe.essence.opposition}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
