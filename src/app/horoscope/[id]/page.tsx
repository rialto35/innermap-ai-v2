'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    hour?: { heavenlyStem: string; earthlyBranch: string }
    time?: { heavenlyStem: string; earthlyBranch: string }
    elements?: {
      wood: number
      fire: number
      earth: number
      metal: number
      water: number
    }
    dominantElement?: string
  }
  dailyFortune: string
  createdAt: string
}

export default function HoroscopeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null)
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchHoroscope()
  }, [params.id])

  const fetchHoroscope = async () => {
    try {
      const res = await fetch(`/api/horoscope/${params.id}`, { cache: 'no-store' })
      
      if (res.status === 404) {
        router.push('/dashboard?tab=fortune')
        return
      }

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch horoscope')
      }
      
      if (data.horoscope) {
        setHoroscope(data.horoscope)
      }
    } catch (err) {
      console.error('Failed to fetch horoscope:', err)
      router.push('/dashboard?tab=fortune')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-white/60">운세 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!horoscope) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-2">운세 정보가 없습니다</h2>
          <p className="text-white/60 mb-6">먼저 운세를 등록해주세요</p>
          <Link
            href="/horoscope/register"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:scale-105 transition"
          >
            운세 등록하기
          </Link>
        </div>
      </div>
    )
  }

  const { sajuData, dailyFortune, solarBirth, lunarBirth, birthTime, location } = horoscope

  const elementInfo = {
    wood: { name: '木 (나무)', color: 'text-green-400', desc: '성장과 발전의 기운' },
    fire: { name: '火 (불)', color: 'text-red-400', desc: '열정과 활력의 기운' },
    earth: { name: '土 (흙)', color: 'text-yellow-400', desc: '안정과 신뢰의 기운' },
    metal: { name: '金 (쇠)', color: 'text-gray-300', desc: '결단과 정의의 기운' },
    water: { name: '水 (물)', color: 'text-blue-400', desc: '지혜와 유연성의 기운' },
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/dashboard?tab=fortune"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition"
          >
            <span>←</span>
            <span>대시보드로 돌아가기</span>
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <span>🔮</span>
            <span>나의 운세</span>
          </h1>
          <p className="text-white/60">
            {new Date(solarBirth).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            {birthTime} 출생
            {location && ` · ${location}`}
          </p>
        </div>

        {/* 오늘의 운세 */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>오늘의 운세</span>
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">{dailyFortune}</p>
        </div>

        {/* 사주팔자 */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">사주팔자</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '연주 (年柱)', data: sajuData.year, desc: '조상과 유년기' },
              { label: '월주 (月柱)', data: sajuData.month, desc: '부모와 청년기' },
              { label: '일주 (日柱)', data: sajuData.day, desc: '본인과 배우자' },
              { label: '시주 (時柱)', data: sajuData.hour || sajuData.time, desc: '자녀와 노년기' },
            ].map((pillar, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">{pillar.label}</div>
                <div className="text-3xl font-bold text-white mb-2 text-center">
                  {pillar.data?.heavenlyStem || '-'}
                  {pillar.data?.earthlyBranch || '-'}
                </div>
                <div className="text-xs text-white/60 text-center">{pillar.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 오행 분석 */}
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">오행 분석</h2>
          
          {/* 오행 분포 */}
          {sajuData.elements && (
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-3 mb-4">
                {Object.entries(sajuData.elements).map(([element, count]) => {
                  const info = elementInfo[element as keyof typeof elementInfo]
                  return (
                    <div key={element} className="text-center">
                      <div className={`text-4xl font-bold ${info.color} mb-2`}>
                        {info.name.split(' ')[0]}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{count}</div>
                      <div className="text-xs text-white/60">{info.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 주요 오행 */}
          {sajuData.dominantElement && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/60 mb-2">주요 오행</div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl font-bold ${
                    elementInfo[sajuData.dominantElement as keyof typeof elementInfo].color
                  }`}
                >
                  {elementInfo[sajuData.dominantElement as keyof typeof elementInfo].name}
                </span>
                <span className="text-white/80">
                  {elementInfo[sajuData.dominantElement as keyof typeof elementInfo].desc}이 강합니다
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">💡 참고사항</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>
                사주는 태어난 연, 월, 일, 시의 천간과 지지로 구성되며, 각각의 의미를 담고 있습니다
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>
                오행의 균형이 중요하며, 부족한 오행을 보완하면 운세를 개선할 수 있습니다
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>운세는 참고사항이며, 실제 삶은 본인의 노력과 선택에 달려 있습니다</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

