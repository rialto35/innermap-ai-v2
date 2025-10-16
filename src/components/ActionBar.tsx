'use client'

import Link from 'next/link'

interface ActionBarProps {
  showPdf?: boolean
  showPrint?: boolean
  showRetest?: boolean
  showHome?: boolean
}

export default function ActionBar({
  showPdf = true,
  showPrint = true,
  showRetest = true,
  showHome = true
}: ActionBarProps) {
  const handlePdf = () => {
    alert('PDF 다운로드 기능 준비중입니다.')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex flex-wrap gap-3 items-center justify-center bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-2xl border border-slate-200">
        {showPdf && (
          <button
            onClick={handlePdf}
            className="px-4 py-2 min-h-[44px] rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF 다운로드
          </button>
        )}

        {showPrint && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 min-h-[44px] rounded-xl bg-slate-600 text-white hover:bg-slate-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            프린트
          </button>
        )}

        {showRetest && (
          <Link
            href="/analyze"
            className="px-4 py-2 min-h-[44px] rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 테스트
          </Link>
        )}

        {showHome && (
          <Link
            href="/"
            className="px-4 py-2 min-h-[44px] rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            홈으로
          </Link>
        )}
      </div>
    </div>
  )
}
