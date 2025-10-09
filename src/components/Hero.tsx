import Link from 'next/link'

export default function Hero() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* 메인 헤드라인 */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          당신은 어떤 영웅인가요?
        </h1>

        {/* 서브 헤드라인 */}
        <p className="text-xl md:text-2xl text-white/90 mb-4">
          AI가 당신의 내면 지도를 만들어드립니다
        </p>

        {/* 설명 */}
        <p className="text-lg text-white/70 mb-8">
          단 5분, 나만의 영웅 리포트를 만나보세요
        </p>

        {/* CTA 버튼 */}
        <Link
          href="/test"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform font-medium text-lg shadow-lg"
        >
          검사 시작하기
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* 하단 소구 */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            무료
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            5분 소요
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            즉시 결과 확인
          </span>
        </div>
      </div>
    </section>
  )
}
