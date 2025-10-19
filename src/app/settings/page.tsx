'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span>⚙️</span>
            <span>설정</span>
          </h1>
          <p className="text-white/60">계정 및 앱 설정을 관리하세요</p>
        </div>

        {/* 계정 정보 */}
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">계정 정보</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-white/50 mb-1">이름</div>
              <div className="text-white">{session?.user?.name || '사용자'}</div>
            </div>
            <div>
              <div className="text-sm text-white/50 mb-1">이메일</div>
              <div className="text-white">{session?.user?.email}</div>
            </div>
          </div>
        </div>

        {/* 앱 설정 */}
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">앱 설정</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <span className="text-white">알림 설정</span>
              <span className="text-white/50">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <span className="text-white">테마 설정</span>
              <span className="text-white/50">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <span className="text-white">언어 설정</span>
              <span className="text-white/50">→</span>
            </button>
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="mb-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">데이터 관리</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <span className="text-white">데이터 내보내기</span>
              <span className="text-white/50">→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-red-300">
              <span>데이터 삭제</span>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-medium hover:bg-red-500/20 transition"
        >
          로그아웃
        </button>

        {/* 버전 정보 */}
        <div className="mt-8 text-center text-sm text-white/40">
          InnerMap AI v2.0.0
        </div>
      </div>
    </div>
  )
}
