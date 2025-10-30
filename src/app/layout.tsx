import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/mobile/BottomNav'
import FeatureFlagRibbon from '@/components/admin/FeatureFlagRibbon'

export const metadata: Metadata = {
  title: 'InnerMap AI - 당신의 내면 지도',
  description: 'AI 기반 심리 분석 플랫폼. 5분 만에 나만의 영웅 리포트를 만나보세요.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isE2E = process.env.NEXT_PUBLIC_E2E === '1';
  
  return (
    <html lang="ko" suppressHydrationWarning>
      <body 
        className="flex min-h-screen flex-col bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white"
        suppressHydrationWarning
      >
        {/* E2E 테스트 환경에서 애니메이션 제거 */}
        {isE2E && (
          <style dangerouslySetInnerHTML={{
            __html: `
              *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                animation-duration: 0s !important;
                transition-duration: 0s !important;
              }
            `
          }} />
        )}
        <AuthProvider>
          <Header />
          <main className="flex-1" suppressHydrationWarning>{children}</main>
          <Footer />
          <BottomNav />
          {/* Dev-only flag ribbon */}
          {process.env.NODE_ENV !== 'production' && <FeatureFlagRibbon />}
        </AuthProvider>
      </body>
    </html>
  )
}
