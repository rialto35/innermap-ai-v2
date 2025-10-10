'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

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
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white"
          >
            로그인
          </Link>
          <Link
            href="/test"
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
          >
            무료로 시작하기
          </Link>
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
        <div className="md:hidden border-t border-white/10 bg-[#0B1220]/95 backdrop-blur-xl">
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
              <Link
                href="/login"
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/test"
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

