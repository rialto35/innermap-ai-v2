'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MyPageRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center text-white/70">대시보드로 이동합니다...</div>
  )
}
