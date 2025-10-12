'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ZoomableImageProps {
  src: string
  alt: string
  size?: number
  zoomSize?: number
  rounded?: string
  className?: string
  onErrorFallback?: React.ReactNode
}

export default function ZoomableImage({ src, alt, size = 128, zoomSize = 480, rounded = 'rounded-2xl', className = '', onErrorFallback }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const [errored, setErrored] = useState(false)

  const handleError = () => {
    setErrored(true)
  }

  if (errored) {
    return (
      <div className={`flex items-center justify-center ${rounded} bg-white/10 text-4xl`} style={{ width: size, height: size }}>
        {onErrorFallback ?? '🖼️'}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative group focus:outline-none focus:ring-2 focus:ring-white/40 ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`${rounded} border border-white/20 object-cover shadow-lg shadow-sky-500/20 transition group-hover:scale-[1.02]`}
          onError={handleError}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-white/20 text-white text-2xl leading-[2.3rem]"
              aria-label="닫기"
            >
              ×
            </button>
            <Image
              src={src}
              alt={alt}
              width={zoomSize}
              height={zoomSize}
              className={`${rounded} max-h-[90vh] w-full object-contain`}
              onError={handleError}
            />
          </div>
        </div>
      )}
    </>
  )
}

