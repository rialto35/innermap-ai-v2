'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HoroscopeData {
  id: string
  solarBirth: string
  lunarBirth?: string
  birthTime: string
  location?: string
  sajuData: {
    year: { heavenlyStem: string; earthlyBranch: string }
    month: { heavenlyStem: string; earthlyBranch: string }
    day: { heavenlyStem: string; earthlyBranch: string }
    time: { heavenlyStem: string; earthlyBranch: string }
    elements: {
      wood: number
      fire: number
      earth: number
      metal: number
      water: number
    }
    dominantElement: string
  }
  dailyFortune: string
  createdAt: string
  updatedAt: string
}

export default function FortuneCard() {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLatestHoroscope()
  }, [])

  const fetchLatestHoroscope = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/horoscope/latest', { cache: 'no-store' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch horoscope')
      }

      setHoroscope(data.horoscope)
    } catch (err: any) {
      console.error('Failed to fetch horoscope:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded w-32 mb-4" />
          <div className="h-4 bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-red-300 mb-2">⚠️ 오류 발생</h3>
        <p className="text-sm text-red-200/80">{error}</p>
      </div>
    )
  }

  if (!horoscope) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span>🔮</span>
          <span>오늘의 운세</span>
        </h3>
        <p className="text-white/70 mb-4">
          아직 운세 정보가 등록되지 않았습니다.
          <br />
          생년월일과 출생 시간을 입력하여 나만의 운세를 확인하세요.
        </p>
        <Link
          href="/horoscope/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:scale-105 transition shadow-lg"
        >
          <span>✨</span>
          <span>운세 등록하기</span>
        </Link>
      </div>
    )
  }

  const { sajuData, dailyFortune, solarBirth, birthTime } = horoscope
  const elementColors: Record<string, string> = {
    wood: 'text-green-400',
    fire: 'text-red-400',
    earth: 'text-yellow-400',
    metal: 'text-gray-300',
    water: 'text-blue-400',
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 shadow-xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔮</span>
          <span>오늘의 운세</span>
        </h3>
        <span className="text-xs text-white/50">
          {new Date(solarBirth).toLocaleDateString('ko-KR')} {birthTime}
        </span>
      </div>

      {/* 오늘의 운세 */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white/90 leading-relaxed">{dailyFortune}</p>
      </div>

      {/* 사주 정보 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/50 mb-1">연주</div>
          <div className="text-sm font-medium text-white">
            {sajuData.year.heavenlyStem}
            {sajuData.year.earthlyBranch}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/50 mb-1">월주</div>
          <div className="text-sm font-medium text-white">
            {sajuData.month.heavenlyStem}
            {sajuData.month.earthlyBranch}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/50 mb-1">일주</div>
          <div className="text-sm font-medium text-white">
            {sajuData.day.heavenlyStem}
            {sajuData.day.earthlyBranch}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/50 mb-1">시주</div>
          <div className="text-sm font-medium text-white">
            {sajuData.time.heavenlyStem}
            {sajuData.time.earthlyBranch}
          </div>
        </div>
      </div>

      {/* 오행 분포 */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
        <div className="text-xs text-white/50 mb-2">오행 분포</div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(sajuData.elements).map(([element, count]) => (
            <div key={element} className="flex items-center gap-1">
              <span className={`text-sm font-medium ${elementColors[element]}`}>
                {element === 'wood' && '木'}
                {element === 'fire' && '火'}
                {element === 'earth' && '土'}
                {element === 'metal' && '金'}
                {element === 'water' && '水'}
              </span>
              <span className="text-xs text-white/70">{count}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-white/60">
          주요 오행:{' '}
          <span className={`font-medium ${elementColors[sajuData.dominantElement]}`}>
            {sajuData.dominantElement === 'wood' && '木 (나무)'}
            {sajuData.dominantElement === 'fire' && '火 (불)'}
            {sajuData.dominantElement === 'earth' && '土 (흙)'}
            {sajuData.dominantElement === 'metal' && '金 (쇠)'}
            {sajuData.dominantElement === 'water' && '水 (물)'}
          </span>
        </div>
      </div>

      {/* 상세 보기 링크 */}
      <Link
        href={`/horoscope/${horoscope.id}`}
        className="block w-full text-center py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium transition"
      >
        상세 운세 보기 →
      </Link>
    </div>
  )
}

