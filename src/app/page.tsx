import Hero from '@/components/Hero'

const uspItems = [
  {
    title: '데이터 기반 영웅 세계관',
    description: '12부족 · 12결정석 · 144명의 영웅 데이터를 기반으로 당신의 내면 서사를 해석합니다.',
    icon: '🌌'
  },
  {
    title: 'AI x 심리학 프레임',
    description: 'MBTI, Big5, RETI를 결합한 맞춤형 심리 분석으로 생활 속 행동 전략을 제시합니다.',
    icon: '🧠'
  },
  {
    title: '즉시 분석 리포트',
    description: '검사 직후 바로 확인 가능한 인터랙티브 리포트와 공유 가능한 카드로 경험을 확장합니다.',
    icon: '📜'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Why InnerMap</span>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              당신의 내면을 이해하는 새로운 기준
            </h2>
            <p className="mt-4 text-lg text-slate-200/80">
              단순 성격 테스트가 아닌 세계관 기반 심리 인사이트로 실질적인 변화의 방향을 제안합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {uspItems.map(item => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="text-4xl" aria-hidden>
                  {item.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-200/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

