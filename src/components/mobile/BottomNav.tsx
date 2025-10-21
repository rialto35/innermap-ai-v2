'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface NavItem {
  href: string
  icon: string
  label: string
  active?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: '🏠',
    label: '홈',
    active: (pathname) => pathname === '/dashboard' || pathname === '/mypage',
  },
  {
    href: '/analyze',
    icon: '🧪',
    label: '분석',
    active: (pathname) => pathname === '/analyze' || pathname.startsWith('/test'),
  },
  {
    href: '/results',
    icon: '📊',
    label: '내결과',
    active: (pathname) => pathname.startsWith('/results') || pathname.startsWith('/result'),
  },
  {
    href: '/dashboard?tab=fortune',
    icon: '🔮',
    label: '운세',
    active: (pathname) => pathname.startsWith('/horoscope'),
  },
  {
    href: '/settings',
    icon: '⚙️',
    label: '설정',
    active: (pathname) => pathname === '/settings',
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // 로그인 상태에 따라 네비게이션 항목 필터링
  const filteredNavItems = navItems.filter(item => {
    if (item.href === '/results') {
      return !!session // 로그인한 사용자만 "내결과" 표시
    }
    return true
  })

  return (
    <>
      {/* Spacer for fixed bottom nav */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-lg border-t border-white/10 lg:hidden"
        role="navigation"
        aria-label="모바일 내비게이션"
      >
        <div className="flex items-center justify-around px-1 py-2">
          {filteredNavItems.map((item) => {
            const isActive = item.active ? item.active(pathname) : pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all
                  min-h-[44px] flex-1 max-w-[60px]
                  ${
                    isActive
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }
                `}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Safe area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  )
}

