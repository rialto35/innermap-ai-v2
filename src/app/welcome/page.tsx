'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] to-[#1a1a2e]">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          {/* 환영 메시지 */}
          <div className="mb-8 inline-block rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-1">
            <div className="rounded-full bg-[#0B1220] px-6 py-3">
              <span className="text-4xl">🎉</span>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            환영합니다, {session?.user?.name || '탐험가'}님!
          </h1>

          <p className="mb-8 text-lg text-white/70 md:text-xl">
            InnerMap AI에 오신 것을 환영합니다.<br />
            당신만의 내면 지도를 발견하고, 진정한 자아를 탐험해보세요.
          </p>

          {/* 특징 카드 */}
          <div className="mb-12 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🧭</div>
              <h3 className="mb-2 font-semibold text-white">성격 분석</h3>
              <p className="text-sm text-white/60">MBTI, RETI, Big5 기반 과학적 분석</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">🦸</div>
              <h3 className="mb-2 font-semibold text-white">영웅 발견</h3>
              <p className="text-sm text-white/60">144가지 영웅 중 당신의 아바타 찾기</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 text-3xl">✨</div>
              <h3 className="mb-2 font-semibold text-white">AI 인사이트</h3>
              <p className="text-sm text-white/60">맞춤형 성장 가이드와 조언</p>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push('/analyze')}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40"
            >
              <span className="relative z-10">지금 시작하기 →</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-cyan-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button
              onClick={() => router.push('/about')}
              className="rounded-full border border-white/20 px-8 py-4 text-lg font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              더 알아보기
            </button>
          </div>

          {/* 하단 안내 */}
          <p className="mt-12 text-sm text-white/40">
            💡 검사는 약 5-7분 소요되며, 언제든지 중단하고 이어서 할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

