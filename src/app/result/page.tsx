'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import HeroImage from '@/components/HeroImage'
import ZoomableImage from '@/components/ZoomableImage'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { matchHero } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone, type TribeBranchResult } from '@/lib/data/tribesAndStones'

interface StoredResult {
  name: string
  birthDate: string
  genderPreference: 'male' | 'female'
  scores: any
  mbti: { type: string; conf: Record<string, number> }
  reti: { top1: [string, number]; top2: [string, number] }
  big5: { O: number; C: number; E: number; A: number; N: number }
  hero: ReturnType<typeof matchHero>
  tribe: TribeBranchResult | null
  stone: ReturnType<typeof recommendStone>
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<StoredResult | null>(null)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('result') : null
    if (!stored) return
    try {
      setResult(JSON.parse(stored) as StoredResult)
    } catch (error) {
      console.error('결과 파싱 실패', error)
    }
  }, [])

  const tribeInfo = useMemo(() => {
    if (!result) return null
    return result.tribe ?? (result.birthDate ? getTribeFromBirthDate(result.birthDate) : null)
  }, [result])

  const recommendedStone = useMemo(() => {
    if (!result) return null
    return result.stone ?? recommendStone(result.big5)
  }, [result])

  const big5Data = useMemo(() => {
    if (!result) return []
    return [
      { dimension: 'O', value: result.big5.O },
      { dimension: 'C', value: result.big5.C },
      { dimension: 'E', value: result.big5.E },
      { dimension: 'A', value: result.big5.A },
      { dimension: 'N', value: result.big5.N },
    ]
  }, [result])

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-white/70">
        <p>결과가 없습니다. 설문을 먼저 진행해주세요.</p>
        <button onClick={() => router.push('/test')} className="btn-primary px-6 py-2">
          설문 시작하기
        </button>
      </div>
    )
  }

  const { hero, mbti, reti, genderPreference, birthDate, name, scores } = result
  const heroImageGender = genderPreference ?? 'male'

  return (
    <div className="min-h-screen px-4 py-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <HeroImage mbti={hero.mbti} reti={hero.reti} gender={heroImageGender} />
            <div className="text-left space-y-4">
              <div className="text-sm uppercase tracking-[0.4em] text-white/40">InnerMap Hero</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{hero.name}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{hero.tagline || hero.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <Badge label="MBTI" value={mbti.type} />
                <Badge label="RETI" value={reti.top1 ? `${reti.top1[0].toUpperCase()} · ${reti.top1[1].toFixed(2)}` : 'N/A'} />
                {name && <Badge label="이름" value={name} />}
                <Badge label="생년월일" value={birthDate} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
            <h2 className="text-xl font-semibold text-white">선천적 부족</h2>
            {tribeInfo ? (
              <div className="space-y-4 text-white/80">
                <div className="flex items-center gap-4">
                  <ZoomableImage src={tribeInfo.tribe.imageUrl ?? '/assets/tribes/default.png'} alt={tribeInfo.tribe.nameKol ?? tribeInfo.tribe.nameKo} size={120} />
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-white/40">{tribeInfo.branchKor}</div>
                    <div className="text-2xl font-bold text-white">{tribeInfo.tribe.nameKo}</div>
                    <div className="text-white/60 text-sm">{tribeInfo.tribe.essence.coreValue}</div>
                  </div>
                </div>
                <p className="text-sm text-white/60 whitespace-pre-line">{tribeInfo.tribe.essence.philosophy}</p>
              </div>
            ) : (
              <p className="text-white/60">생년월일 정보가 부족합니다.</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
            <h2 className="text-xl font-semibold text-white">후천적 성장 결정석</h2>
            {recommendedStone ? (
              <div className="space-y-4 text-white/80">
                <div className="flex items-center gap-4">
                  <ZoomableImage src={recommendedStone.imageUrl ?? '/assets/stones/default.png'} alt={recommendedStone.nameKo} size={120} />
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-white/40">추천 결정석</div>
                    <div className="text-2xl font-bold text-white">{recommendedStone.nameKo}</div>
                    <div className="text-white/60 text-sm">{recommendedStone.nameEn}</div>
                  </div>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div><span className="text-white/90 font-semibold">핵심 가치:</span> {recommendedStone.coreValue}</div>
                  <div><span className="text-white/90 font-semibold">성장 키워드:</span> {recommendedStone.growthKeyword}</div>
                </div>
                <p className="text-sm text-white/60 whitespace-pre-line">{recommendedStone.description}</p>
              </div>
            ) : (
              <p className="text-white/60">Big5 점수를 기반으로 맞춤 추천을 제공합니다.</p>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
            <h2 className="text-xl font-semibold text-white">MBTI 신뢰도</h2>
            <div className="text-sm text-white/70 grid grid-cols-2 gap-3">
              <Confidence label="E vs I" value={mbti.conf.EI} />
              <Confidence label="S vs N" value={mbti.conf.SN} />
              <Confidence label="T vs F" value={mbti.conf.TF} />
              <Confidence label="J vs P" value={mbti.conf.JP} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4">
            <h2 className="text-xl font-semibold text-white">RETI Top 2</h2>
            <div className="text-sm text-white/70 space-y-2">
              {reti.top1 && <div>1위: {reti.top1[0].toUpperCase()} ({reti.top1[1].toFixed(2)})</div>}
              {reti.top2 && <div>2위: {reti.top2[0].toUpperCase()} ({reti.top2[1].toFixed(2)})</div>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white">Big5 프로파일</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={big5Data} outerRadius="80%">
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="dimension" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4 text-white/70">
          <h2 className="text-xl font-semibold text-white">성장 벡터</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {Object.entries(scores.Growth).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3">
                <span className="capitalize">{key}</span>
                <span className="text-white/90 font-semibold">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs uppercase tracking-[0.3em]">
      <span>{label}</span>
      <span className="text-white/90">{value}</span>
    </span>
  )
}

function Confidence({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 border border-white/10">
      <span>{label}</span>
      <span className="text-white/90 font-semibold">{value.toFixed(2)}</span>
    </div>
  )
}

