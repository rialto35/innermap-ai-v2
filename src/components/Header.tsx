'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0F1424]/80 to-transparent backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-white">
        {/* 로고 */}
        <Link href="/" className="font-semibold tracking-tight text-lg flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <span>InnerMap AI</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex gap-6 text-sm text-white/90">
          <Link href="/psychology" className="hover:text-white transition">검사하기</Link>
          <Link href="/" className="hover:text-white transition">홈</Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="메뉴"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F1424]/95 backdrop-blur-lg">
          <nav className="flex flex-col px-4 py-3 gap-3 text-white/90">
            <Link href="/psychology" className="py-2 hover:text-white transition">검사하기</Link>
            <Link href="/" className="py-2 hover:text-white transition">홈</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

