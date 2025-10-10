'use client'

import { Hero } from '@/lib/data/heroes144'

interface HeroModalProps {
  hero: Hero | null
  onClose: () => void
}

const ABILITY_LABELS: Array<{ key: keyof Hero['abilities']; label: string }> = [
  { key: 'openness', label: '개방' },
  { key: 'conscientiousness', label: '성실' },
  { key: 'extraversion', label: '외향' },
  { key: 'agreeableness', label: '우호' },
  { key: 'neuroticism', label: '정서 안정' }
]

export default function HeroModal({ hero, onClose }: HeroModalProps) {
  if (!hero) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900/95 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 h-10 w-10 rounded-full border border-white/10 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/20"
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="grid gap-8 p-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              #{hero.number.toString().padStart(3, '0')} · {hero.mbti} · RETI {hero.reti}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white">{hero.name}</h2>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{hero.nameEn}</p>
            <p className="mt-4 text-base text-slate-200/90">{hero.tagline}</p>

            <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-200/80">
              {hero.description.split(' ').reduce<string[]>((acc, word, index) => {
                if (index % 20 === 0) acc.push('')
                acc[acc.length - 1] = `${acc[acc.length - 1]} ${word}`.trim()
                return acc
              }, []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">능력치</h3>
            <p className="mt-2 text-xs text-slate-300/70">
              Big5 기반 능력치를 시각화했습니다. 막대를 따라 각 영웅의 성향 강도를 확인하세요.
            </p>

            <div className="mt-6 space-y-4">
              {ABILITY_LABELS.map(({ key, label }) => {
                const value = hero.abilities[key]
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs text-slate-300/80">
                      <span>{label}</span>
                      <span className="font-semibold text-slate-100">{value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 space-y-3 text-sm text-slate-200/70">
              <p>
                <span className="font-semibold text-slate-200">RETI 타입 · </span>
                {hero.reti} {hero.retiType}
              </p>
              <p>
                <span className="font-semibold text-slate-200">MBTI · </span>
                {hero.mbti}
              </p>
            </div>

            <div className="mt-8 grid gap-3 text-sm">
              <button className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white transition hover:border-white/30 hover:bg-white/15">
                영웅 리포트 보기
              </button>
              <button className="rounded-2xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-white transition hover:border-sky-400/60 hover:bg-sky-500/20">
                이 영웅과 비교하기 (준비 중)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
