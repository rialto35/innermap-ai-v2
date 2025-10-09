export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            InnerMap AI 소개
          </h1>
          <p className="text-white/70 text-lg">
            당신의 내면을 지도화하는 AI 플랫폼
          </p>
        </div>

        {/* 섹션들 */}
        <div className="space-y-8">
          {/* 미션 */}
          <section className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              우리의 미션
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              InnerMap AI는 AI 기술과 심리학을 결합하여, 모든 사람이 자신의 내면을 깊이 이해하고 
              성장할 수 있도록 돕습니다. 우리는 복잡한 심리학 이론을 쉽고 재미있게 전달하여, 
              자기 이해의 여정을 즐거운 경험으로 만들고자 합니다.
            </p>
          </section>

          {/* 작동 원리 */}
          <section className="rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-400/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <span>⚙️</span>
              작동 원리
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="text-xl font-bold text-white mb-2">질문 응답</h3>
                <p className="text-white/70">
                  간단한 질문에 답하며 당신의 성향을 측정합니다
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="text-xl font-bold text-white mb-2">AI 분석</h3>
                <p className="text-white/70">
                  AI가 다양한 심리학 이론을 통합 분석합니다
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="text-xl font-bold text-white mb-2">리포트 생성</h3>
                <p className="text-white/70">
                  영웅 세계관으로 표현된 맞춤 리포트를 받습니다
                </p>
              </div>
            </div>
          </section>

          {/* 팀 */}
          <section className="rounded-2xl bg-purple-500/10 backdrop-blur-md border border-purple-400/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <span>👥</span>
              팀
            </h2>
            <p className="text-white/80 leading-relaxed text-lg mb-6">
              심리학자, 데이터 사이언티스트, 디자이너가 모여 만든 InnerMap AI는 
              과학적 근거와 아름다운 경험을 모두 제공합니다.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-4">
                <h3 className="text-white font-bold mb-1">심리학 자문단</h3>
                <p className="text-white/60 text-sm">임상 심리학자 및 상담 전문가</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <h3 className="text-white font-bold mb-1">AI 연구팀</h3>
                <p className="text-white/60 text-sm">머신러닝 및 NLP 전문가</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              문의하기
            </h2>
            <p className="text-white/80 mb-6">
              궁금한 점이 있으신가요? 언제든 연락주세요!
            </p>
            <a
              href="mailto:contact@innermap.ai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@innermap.ai
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
