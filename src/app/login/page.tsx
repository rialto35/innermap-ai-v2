'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL 파라미터에서 에러 확인
  useEffect(() => {
    const urlError = searchParams?.get('error')
    if (urlError) {
      switch (urlError) {
        case 'OAuthCallback':
          setError('Google 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          break
        case 'Configuration':
          setError('서버 설정 오류입니다. 관리자에게 문의해주세요.')
          break
        case 'AccessDenied':
          setError('로그인이 취소되었습니다.')
          break
        default:
          setError('로그인 중 오류가 발생했습니다.')
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'authenticated') router.replace('/mypage')
  }, [status, router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signIn('google', { callbackUrl: '/mypage' })
    } catch (err) {
      setError('Google 로그인 중 오류가 발생했습니다.')
      console.error('Google login error:', err)
    } finally {
      setLoading(false)
    }
  }

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

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/15 disabled:opacity-60"
          >
            {loading ? '로그인 중...' : 'Google로 계속하기'}
          </button>
          <button 
            onClick={() => {
              // 임시 세션 생성 (개발용)
              localStorage.setItem('dev-session', JSON.stringify({
                user: {
                  name: '개발자',
                  email: 'dev@example.com',
                  image: 'https://via.placeholder.com/150'
                }
              }))
              window.location.href = '/dashboard'
            }}
            className="w-full rounded-xl border border-blue-500/50 bg-blue-600/20 px-4 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-600/30"
          >
            🧪 개발용 로그인 (임시)
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
