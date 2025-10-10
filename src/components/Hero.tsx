import Image from 'next/image'
import Link from 'next/link'

const heroHighlights = [
  'AI 기반 통합 성격 분석',
  '영웅 세계관 리포트',
  '144명의 영웅 데이터'
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-sky-500/25 blur-2xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100/90">
            <span className="text-lg">✨</span>
            <span>InnerMap AI · 나의 영웅 세계관 탐사</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            당신의 내면은 어떤 영웅의 이야기인가요?
          </h1>

          <p className="mt-6 text-lg text-slate-200/90 md:text-xl">
            생년월일과 성향 데이터를 기반으로 12부족·12결정석·144명의 영웅 중 당신과 공명하는 이야기를 찾아드립니다. AI가 그려주는 당신만의 InnerMap을 만나보세요.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200/70">
            {heroHighlights.map(item => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"
              >
                <svg className="h-4 w-4 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
            >
              검사 시작하기
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/world"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-10 py-4 text-lg font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              세계관 살펴보기
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16l-4-4-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-200/70">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              무료 · 5분 만에 결과
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 00-8 8v4a2 2 0 002 2h2.586l.707.707A1 1 0 008 17h4a1 1 0 00.707-.293L13.414 16H16a2 2 0 002-2v-4a8 8 0 00-8-8z" clipRule="evenodd" />
              </svg>
              12부족 · 12결정석 · 144영웅 세계관
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v10a1 1 0 001.447.894L8 13.118l3.553 1.776A1 1 0 0013 14V4a1 1 0 00-1-1H4z" clipRule="evenodd" />
              </svg>
              바로 공유 가능한 리포트 카드
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-md">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5/50 p-6 backdrop-blur">
            <Image
              src="/images/hero-constellation.svg"
              alt="InnerMap constellation artwork"
              width={560}
              height={640}
              priority
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
