import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  description: 'AI 성격분석과 심리 운세 통합 플랫폼. MBTI, RETI, 색채심리, 사주, 타로, 운세까지 한 번에.',
  keywords: '성격분석, MBTI, RETI, 색채심리, 사주, 타로, 운세, AI, 심리테스트, 성격검사',
  authors: [{ name: 'PromptCore' }],
  creator: 'PromptCore',
  publisher: 'PromptCore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
           icons: {
           icon: [
             { url: '/icon-16.png?v=2', sizes: '16x16', type: 'image/png' },
             { url: '/icon-32.png?v=2', sizes: '32x32', type: 'image/png' },
             { url: '/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
             { url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
           ],
           apple: [
             { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
           ],
         },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'InnerMap AI',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://innermap-ai.vercel.app',
    siteName: 'InnerMap AI',
    title: 'InnerMap AI - 나를 찾는 지도',
    description: 'AI가 그려주는 나만의 성격 지도와 운명의 길잡이',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InnerMap AI - 나를 찾는 지도',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InnerMap AI - 나를 찾는 지도',
    description: 'AI가 그려주는 나만의 성격 지도와 운명의 길잡이',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* PWA 추가 메타 태그 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="InnerMap" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-[#0F1424] via-[#20253A]/20 to-white`}
      >
        {/* 은은한 분위기 오버레이 */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* 상단: 하늘 빛 */}
          <div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(15,20,36,0) 60%)' }}
          />
          {/* 하단: 땅의 따뜻함 */}
          <div 
            className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full opacity-25 blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)' }}
          />
        </div>

        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('서비스 워커 등록 성공:', registration.scope);
                    }, function(err) {
                      console.log('서비스 워커 등록 실패:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
