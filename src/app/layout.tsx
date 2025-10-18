import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'InnerMap AI - 당신의 내면 지도',
  description: 'AI 기반 심리 분석 플랫폼. 5분 만에 나만의 영웅 리포트를 만나보세요.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
