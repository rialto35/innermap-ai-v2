"use client"
import Image from "next/image"
import Link from "next/link"

export default function HeroGrowthCard({ 
  hero, 
  gem, 
  tribe, 
  growth, 
  strengths, 
  weaknesses 
}: { 
  hero: any
  gem?: any
  tribe?: any
  growth?: any
  strengths?: string[]
  weaknesses?: string[]
}) {
  const expPct = Math.min(100, Math.round((hero.exp.current / hero.exp.next) * 100))

  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-xl flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-1 ring-zinc-700">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            🦸
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold">{hero.name}</div>
          <div className="text-zinc-400 text-sm">{hero.subtitle || hero.tagline}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-600/40">Lv.{hero.level}</span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">MBTI {hero.mbti}</span>
            <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-600/40">RETI {hero.reti?.code || `R${hero.reti}`}</span>
            {gem && <span className="px-2 py-1 rounded bg-sky-500/15 text-sky-300 border border-sky-600/40">결정석 {gem.name}</span>}
          </div>
        </div>
      </div>

      {/* 경험치 바 */}
      <div>
        <div className="flex justify-between text-xs text-zinc-400 mb-1">
          <span>다음 레벨까지</span>
          <span>{hero.exp.current} / {hero.exp.next} ({expPct}%)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${expPct}%` }} />
        </div>
      </div>

      {/* 성장 요소 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: 'innate', label: '선천' },
          { k: 'acquired', label: '후천' },
          { k: 'harmony', label: '조화' },
          { k: 'individual', label: '개별' },
        ].map((g) => (
          <div key={g.k} className="rounded-xl border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400">{g.label}</div>
            <div className="text-sm font-medium">{(growth?.[g.k] || hero.growth?.[g.k] || 0)}%</div>
            <div className="h-1.5 mt-2 rounded-full bg-zinc-800">
              <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${growth?.[g.k] || hero.growth?.[g.k] || 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* 강점/보완점 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-700/30 bg-emerald-500/5 p-3">
          <div className="text-xs text-emerald-300 mb-2">강점</div>
          <div className="flex flex-wrap gap-2">
            {(strengths || hero.strengths || []).map((s: string, i: number) => (
              <span key={i} className="px-2 py-1 rounded border border-emerald-600/40 text-emerald-200 text-xs">{s}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-rose-700/30 bg-rose-500/5 p-3">
          <div className="text-xs text-rose-300 mb-2">보완</div>
          <div className="flex flex-wrap gap-2">
            {(weaknesses || hero.weaknesses || []).map((s: string, i: number) => (
              <span key={i} className="px-2 py-1 rounded border border-rose-600/40 text-rose-200 text-xs">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 결정석 카드 */}
      {gem && (
        <div className="rounded-xl border border-sky-700/30 bg-sky-500/5 p-4 flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-sky-600/20 flex items-center justify-center">💎</div>
          <div className="flex-1">
            <div className="text-sky-300 text-sm">{gem.name}</div>
            <div className="text-xs text-zinc-400 mb-1">{gem.keywords?.join(' · ')}</div>
            <div className="text-zinc-300 text-sm">{gem.summary}</div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-2">
        <Link href="/result" className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-center py-2 transition">
          상세 리포트
        </Link>
        <Link href="/test" className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-center py-2 transition">
          재검사하기
        </Link>
      </div>
    </div>
  )
}
