import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InnerMap AI - 당신의 내면 지도',
  description: 'AI 기반 심리 분석 플랫폼. 5분 만에 나만의 영웅 리포트를 만나보세요.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen text-white">
        {children}
      </body>
    </html>
  )
}
