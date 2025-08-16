import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '🗺️ innerMap AI - 나를 찾는 지도',
  description: '통합 AI 내면 자아분석 서비스',
  keywords: '성격분석, MBTI, RETI, 색채심리, 사주, 타로, 운세, AI',
  authors: [{ name: 'PromptCore' }],
  creator: 'PromptCore',
  publisher: 'PromptCore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://innermap-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'innerMap AI - 나를 찾는 지도',
    description: 'AI가 그려주는 나만의 성격 지도와 운명의 길잡이',
    url: 'https://innermap-ai.vercel.app',
    siteName: 'innerMap AI',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'InnerMap AI 아이콘',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'innerMap AI - 나를 찾는 지도',
    description: 'AI가 그려주는 나만의 성격 지도와 운명의 길잡이',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 몽환적 애니메이션 배경 */}
        <div className="animated-background"></div>
        <div className="floating-shapes">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
