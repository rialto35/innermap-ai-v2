'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

interface HeroImageProps {
  mbti: string
  reti: string
  gender?: 'male' | 'female'
  width?: number
  height?: number
  alt?: string
}

const HERO_IMAGE_BASE = '/heroes'

export default function HeroImage({ mbti, reti, gender = 'male', width = 160, height = 160, alt }: HeroImageProps) {
  const [errorIndex, setErrorIndex] = useState(0)

  // reti는 'r7' | 'type7' | '7' 형태 모두 수용
  const retiNumber = useMemo(() => reti.replace(/^r/i, '').replace(/^type/i, ''), [reti])

  // 배포 파일명 불일치 대응: _TYPE vs _type 모두 시도
  const candidates = useMemo(() => {
    const upperMbti = mbti.toUpperCase()
    return [
      `${HERO_IMAGE_BASE}/${gender}/${upperMbti}_TYPE${retiNumber}.png`,
      `${HERO_IMAGE_BASE}/${gender}/${upperMbti}_type${retiNumber}.png`,
    ]
  }, [mbti, retiNumber, gender])

  const currentSrc = candidates[errorIndex]

  if (!currentSrc || errorIndex >= candidates.length) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="flex items-center justify-center rounded-full bg-white/10 text-5xl w-full h-full">🦸</div>
      </div>
    )
  }

  return (
    <Image
      key={currentSrc}
      src={currentSrc}
      alt={alt ?? `${mbti}-${reti}`}
      width={width}
      height={height}
      className="rounded-full border border-white/20 object-cover shadow-lg shadow-sky-500/20"
      onError={() => setErrorIndex(prev => prev + 1)}
    />
  )
}

