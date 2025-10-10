'use client'

import { Hero } from '@/lib/data/heroes144'

interface HeroListProps {
  heroes: Hero[]
  onSelect: (hero: Hero) => void
}

export default function HeroList({ heroes, onSelect }: HeroListProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">영웅 {heroes.length}명</h2>
      </div>

      {heroes.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-slate-300/70">
          조건에 맞는 영웅을 찾지 못했습니다. 필터를 조정하거나 다른 키워드를 입력해 보세요.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {heroes.map(hero => (
            <button
              key={hero.id}
              type="button"
              onClick={() => onSelect(hero)}
              className="group rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-left transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10 hover:shadow-xl"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>{hero.number.toString().padStart(3, '0')}</span>
                <span>{hero.mbti} · RETI {hero.reti}</span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">{hero.name}</h3>
              <p className="text-sm text-slate-200/80">{hero.tagline}</p>

              <div className="mt-5 space-y-2 text-xs text-slate-200/60">
                <p>
                  <span className="font-semibold text-slate-200">핵심 설명 · </span>
                  {hero.description.slice(0, 72)}{hero.description.length > 72 ? '…' : ''}
                </p>
                <p>
                  <span className="font-semibold text-slate-200">능력치 · </span>
                  개방 {hero.abilities.openness} · 성실 {hero.abilities.conscientiousness} · 외향 {hero.abilities.extraversion}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
