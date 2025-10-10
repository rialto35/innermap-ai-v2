'use client'

import { useMemo, useState } from 'react'
import { STONES_12, recommendStone } from '@/lib/data/tribesAndStones'

type Big5Key = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'

const sliders: { key: Big5Key; label: string; description: string }[] = [
  { key: 'openness', label: '개방성', description: '새로움, 상상력, 호기심' },
  { key: 'conscientiousness', label: '성실성', description: '계획, 목표, 책임감' },
  { key: 'extraversion', label: '외향성', description: '에너지, 사교성, 표현력' },
  { key: 'agreeableness', label: '우호성', description: '공감, 협력, 신뢰' },
  { key: 'neuroticism', label: '정서성', description: '민감성, 불안, 정서 기복' }
]

const initialScores = {
  openness: 50,
  conscientiousness: 50,
  extraversion: 50,
  agreeableness: 50,
  neuroticism: 50
}

export default function StoneShowcase() {
  const [scores, setScores] = useState(initialScores)

  const recommended = useMemo(() => recommendStone(scores), [scores])

  const handleChange = (key: Big5Key, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }))
  }

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-center lg:text-left">
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Stones of Growth</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">12 결정석과 당신의 성장 레시피</h2>
              <p className="mt-3 text-base md:text-lg text-slate-300/80">
                Big5 성향을 입력하면 InnerMap이 추천하는 결정석과 성장 키워드를 바로 확인할 수 있습니다.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {sliders.map(slider => (
                <div key={slider.key} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
                  <div className="flex items-baseline justify-between text-sm text-slate-200/80">
                    <div>
                      <span className="text-base font-semibold text-white">{slider.label}</span>
                      <span className="ml-2 text-xs text-slate-400">{slider.description}</span>
                    </div>
                    <span className="font-semibold text-sky-300">{scores[slider.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={scores[slider.key]}
                    onChange={event => handleChange(slider.key, Number(event.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 backdrop-blur">
              <div className="text-sm uppercase tracking-[0.25em] text-slate-300">Recommended Stone</div>
              <h3 className="mt-4 text-3xl font-bold text-white">{recommended.nameKo}</h3>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{recommended.nameEn}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/80">
                <div className="text-slate-100">핵심 가치</div>
                <div className="text-sm md:text-base text-slate-200/80">{recommended.coreValue}</div>
              </div>

              <div className="mt-4 text-sm text-slate-200/80">
                <div className="font-semibold text-white/90">성장 키워드</div>
                <p className="mt-2 leading-relaxed">{recommended.growthKeyword}</p>
              </div>

              <div className="mt-4 text-sm text-slate-200/80">
                <div className="font-semibold text-white/90">설명</div>
                <p className="mt-2 leading-relaxed">{recommended.description}</p>
              </div>

              <div className="mt-4 text-sm text-slate-200/80">
                <div className="font-semibold text-white/90">효과</div>
                <p className="mt-2 leading-relaxed">{recommended.effect}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200/70">
              <h4 className="text-base font-semibold text-white">빅파이브 프로파일</h4>
              {sliders.map(slider => (
                <div key={`${slider.key}-profile`} className="flex items-center justify-between">
                  <span>{slider.label}</span>
                  <span className="font-medium text-sky-300">{scores[slider.key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {STONES_12.map(stone => (
            <div
              key={stone.id}
              className={`rounded-3xl border px-6 py-7 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 ${stone.id === recommended.id ? 'border-sky-400/60 bg-sky-500/10 shadow-2xl shadow-sky-500/20' : 'border-white/10 bg-white/5'}`}
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Stone {stone.id.toString().padStart(2, '0')}</span>
                {stone.id === recommended.id && <span className="text-sky-300">추천</span>}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{stone.nameKo}</h3>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{stone.nameEn}</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200/70">
                <span className="font-medium text-white/80">핵심 가치 · </span>
                {stone.coreValue}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-200/80">{stone.description}</p>
              <p className="mt-3 text-xs text-slate-200/60">효과: {stone.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
