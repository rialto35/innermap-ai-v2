'use client';

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 상단 CTA - /test 페이지에서는 숨김 */}
        <div className="text-center mb-8 hidden">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            5분 만에 시작하세요
          </h3>
          <p className="text-slate-600 mb-4">
            지금 바로 무료로 당신의 영웅을 발견하세요
          </p>
          <Link 
            href="/test" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition font-medium"
          >
            검사 시작하기 →
          </Link>
        </div>

        {/* 하단 링크 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 mb-3">InnerMap AI</h3>
            <p className="text-sm text-slate-600">
              AI 기반 심리 분석 플랫폼<br/>
              당신의 내면을 지도화합니다
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-3">바로가기</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/test" className="hover:text-slate-900">검사하기</Link></li>
              <li><Link href="/about" className="hover:text-slate-900">서비스 소개</Link></li>
              <li><Link href="/pricing" className="hover:text-slate-900">요금제</Link></li>
              <li><Link href="/insight" className="hover:text-slate-900">인사이트</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-3">문의</h3>
            <p className="text-sm text-slate-600 mb-2">contact@innermap.ai</p>
            <div className="text-xs text-slate-500 mt-4">
              <Link href="/privacy" className="hover:text-slate-700">개인정보처리방침</Link>
              {' · '}
              <Link href="/terms" className="hover:text-slate-700">이용약관</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          © 2025 InnerMap AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

