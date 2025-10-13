'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') router.replace('/')
  }, [status, router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      alert('데모: 이메일/비밀번호는 아직 연동하지 않았습니다. 우측 소셜을 이용해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h1 className="mb-2 text-3xl font-bold text-white">로그인</h1>
        <p className="mb-8 text-sm text-white/60">이메일로 로그인하거나 소셜 계정을 사용할 수 있어요.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/70">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/70">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? '처리 중...' : '로그인'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-white/50">
          <div className="h-px flex-1 bg-white/10" />
          <span>또는</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/15"
          >
            Google로 계속하기
          </button>
          <button className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/15">
            (준비중) GitHub로 계속하기
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-sky-400 hover:underline">회원가입</Link>
        </div>
      </div>
    </div>
  )
}
