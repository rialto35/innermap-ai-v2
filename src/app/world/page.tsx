import TribeTimeline from '@/components/world/TribeTimeline'
import StoneShowcase from '@/components/world/StoneShowcase'

const introHighlights = [
  {
    title: '12부족의 기원',
    description: '사주 12지지와 하루 24시간을 잇는 부족별 기원과 철학을 정리했습니다.'
  },
  {
    title: '12결정석의 성장 여정',
    description: 'Big5 성향과 매칭되는 성장 키워드와 효과를 한눈에 확인할 수 있습니다.'
  },
  {
    title: '144 영웅의 서사',
    description: 'MBTI × RETI 144명의 영웅이 각 부족과 어떻게 연결되는지 탐험해 보세요.'
  }
]

export default function WorldPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-24 -left-32 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100/80">
            <span className="text-lg">🧭</span>
            InnerMap Worldbuilding
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-white leading-tight">
            12부족과 12결정석이 엮어낸 영웅 세계관
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/80">
            InnerMap AI는 사주 12지지, Big5, MBTI, RETI를 연결해 당신의 내면 지도를 형성합니다. 부족과 결정석, 그리고 144명의 영웅을 따라 자신의 서사를 탐험해 보세요.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">세계관 한눈에 보기</h2>
          <p className="mt-4 text-lg text-slate-200/80">
            InnerMap의 세 가지 핵심 축을 먼저 만나보세요.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {introHighlights.map(item => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 px-8 py-8 text-left">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-200/80">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <TribeTimeline />
      <StoneShowcase />
    </div>
  )
}
