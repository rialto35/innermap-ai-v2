'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 푸터 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <span>InnerMap AI</span>
            </h3>
            <p className="text-sm text-slate-600">AI 기반 심리 분석 플랫폼</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-3">바로가기</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/" className="hover:text-slate-900 transition">홈</Link></li>
              <li><Link href="/psychology" className="hover:text-slate-900 transition">검사하기</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-3">v2 업데이트</h3>
            <p className="text-sm text-slate-600">
              영웅 세계관 분석 시스템<br />
              Big5 + 7개 섹션 구조
            </p>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
          © 2025 InnerMap AI v2. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

