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
  const [error, setError] = useState(false)

  const imagePath = useMemo(() => {
    const retiNumber = reti.replace(/^r/i, '').replace(/^type/i, '')
    return `${HERO_IMAGE_BASE}/${gender}/${mbti.toUpperCase()}_type${retiNumber}.png`
  }, [mbti, reti, gender])

  if (error) {
    return (
      <div className="flex items-center justify-center w-[160px] h-[160px] rounded-full bg-white/10 text-5xl">
        🦸
      </div>
    )
  }

  return (
    <Image
      src={imagePath}
      alt={alt ?? `${mbti}-${reti}`}
      width={width}
      height={height}
      className="rounded-full border border-white/20 object-cover shadow-lg shadow-sky-500/20"
      onError={() => setError(true)}
    />
  )
}

