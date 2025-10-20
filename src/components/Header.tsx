'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface NavLink {
  href: string
  label: string
}

const primaryLinks: NavLink[] = [
  { href: '/test', label: '검사하기' },
  { href: '/heroes', label: '영웅 도감' },
  { href: '/world', label: '세계관' },
  { href: '/wizard', label: '빠른 추천' },
  { href: '/insight', label: '인사이트' }
]

const secondaryLinks: NavLink[] = [
  { href: '/pricing', label: '요금제' },
  { href: '/about', label: '소개' }
]

const resultsMenuItems = [
  { href: '/results/inner9', label: 'Inner9 분석', icon: '🧠', description: '내면의 9가지 차원 분석' },
  { href: '/results/report', label: '상세 리포트', icon: '📊', description: 'Big5, MBTI, RETI 종합 분석' },
  { href: '/results/deep', label: '심층 분석', icon: '🔍', description: 'AI 기반 개인화 분석' },
  { href: '/results/coach', label: '운세 코칭', icon: '🔮', description: '개인화된 운세 및 조언' }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isResultsDropdownOpen, setIsResultsDropdownOpen] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setIsResultsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsResultsDropdownOpen(false)
    }, 150) // 150ms 지연
    setHoverTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const handleLogout = async () => {
    try {
      // 로그아웃 시 캐시 초기화
      sessionStorage.removeItem('hero_data_cache')
      await signOut({ redirect: false })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const renderLinks = (links: NavLink[], variant: 'primary' | 'secondary' = 'primary') => (
    links.map(link => (
      <Link
        key={link.href}
        href={link.href}
        className={
          variant === 'primary'
            ? `text-sm transition ${isActive(link.href) ? 'text-white' : 'text-white/70 hover:text-white'}`
            : `text-sm text-white/60 transition hover:text-white`
        }
      >
        {link.label}
      </Link>
    ))
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-white">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight transition hover:opacity-80"
        >
          <span className="text-2xl">🗺️</span>
          <span>InnerMap AI</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <nav className="flex items-center gap-6">
            {renderLinks(primaryLinks, 'primary')}
          </nav>

          <nav className="ml-8 flex items-center gap-6">
            {renderLinks(secondaryLinks, 'secondary')}
          </nav>
        </div>

        {/* CTA 버튼 */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/mypage"
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white"
              >
                마이페이지
              </Link>
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/results"
                  className="rounded-full border border-violet-500/30 px-5 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-400/50 hover:text-violet-200 flex items-center gap-1"
                >
                  내 결과
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* 드롭다운 메뉴 */}
                {isResultsDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-2">
                      {resultsMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-white group-hover:text-violet-200 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                              {item.description}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-white/40 group-hover:text-violet-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-300/50 hover:text-red-300"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white"
            >
              로그인
            </Link>
          )}
          {!session && (
            <Link
              href="/analyze"
              className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
            >
              무료로 시작하기
            </Link>
          )}
        </div>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
          aria-label="메뉴"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-top border-white/10 bg-[#0B1220]/95 backdrop-blur-xl">
          <nav className="flex flex-col gap-1 px-4 py-4 text-white/90">
            {[...primaryLinks, ...secondaryLinks].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 transition hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link
                    href="/mypage"
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="rounded-xl border border-red-400/30 px-4 py-3 text-center text-sm font-medium text-red-400 transition hover:border-red-300/50 hover:text-red-300"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
              <Link
                href="/analyze"
                className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.01]"
                onClick={() => setIsMenuOpen(false)}
              >
                무료로 시작하기
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

