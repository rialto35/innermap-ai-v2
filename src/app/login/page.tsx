'use client'

import { useEffect, useState, Suspense } from 'react'
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

  const handleKakaoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signIn('kakao', { callbackUrl: '/mypage' })
    } catch (err) {
      setError('카카오 로그인 중 오류가 발생했습니다.')
      console.error('Kakao login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNaverLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signIn('naver', { callbackUrl: '/mypage' })
    } catch (err) {
      setError('네이버 로그인 중 오류가 발생했습니다.')
      console.error('Naver login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 개발용 Credentials 로그인 (Provider: dev)
      await signIn('dev', {
        email,
        name: email?.split('@')[0] || 'Dev User',
        callbackUrl: '/mypage',
        redirect: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div suppressHydrationWarning className="min-h-screen px-4 py-12">
      <div suppressHydrationWarning className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h1 className="mb-2 text-3xl font-bold text-white">로그인</h1>
        <p className="mb-8 text-sm text-white/60">이메일로 로그인하거나 소셜 계정을 사용할 수 있어요.</p>

        <form onSubmit={onSubmit} className="space-y-4" suppressHydrationWarning>
          <div suppressHydrationWarning>
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

          <div suppressHydrationWarning>
            <label className="mb-1 block text-sm text-white/70">비밀번호 (개발용 생략 가능)</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required={false}
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

        <div className="my-6 flex items-center gap-3 text-xs text-white/50" suppressHydrationWarning>
          <div className="h-px flex-1 bg-white/10" suppressHydrationWarning />
          <span>또는</span>
          <div className="h-px flex-1 bg-white/10" suppressHydrationWarning />
        </div>

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300" suppressHydrationWarning>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3" suppressHydrationWarning>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/15 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '로그인 중...' : 'Google로 계속하기'}
          </button>
          
          <button
            onClick={handleKakaoLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-300 transition hover:bg-yellow-500/20 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FEE500">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.52 1.6 4.8 4.05 6.16L5.4 19.2c-.2.4.2.8.6.6l2.4-1.2c.8.2 1.6.4 2.4.4 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
            </svg>
            {loading ? '로그인 중...' : '카카오로 계속하기'}
          </button>
          
          <button
            onClick={handleNaverLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#03C75A">
              <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
            </svg>
            {loading ? '로그인 중...' : '네이버로 계속하기'}
          </button>
          
          <button
            onClick={async () => {
              const devEmail = email || 'dev@example.com'
              await signIn('dev', { email: devEmail, name: devEmail.split('@')[0], callbackUrl: '/mypage' })
            }}
            className="w-full rounded-xl border border-blue-500/50 bg-blue-600/20 px-4 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-600/30"
          >
            🧪 개발용 로그인 (Credentials)
          </button>
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
