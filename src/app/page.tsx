import Hero from '@/components/Hero'
import InsightCard from '@/components/InsightCard'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero 섹션 */}
      <Hero />

      {/* 나를 찾는 모든 길 섹션 */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              나를 찾는 모든 길
            </h2>
            <p className="text-white/70 text-lg">
              당신에게 맞는 방법으로 내면을 탐험하세요
            </p>
          </div>

          {/* 3개 카드 그리드 */}
          <div className="grid md:grid-cols-3 gap-6">
            <InsightCard
              title="성격 분석"
              description="AI 기반 통합 성격 검사로 당신의 영웅 유형을 발견하세요"
              icon="🎭"
              href="/test"
              variant="primary"
            />

            <InsightCard
              title="마음 질문 카드"
              description="하루 한 장, 나를 돌아보는 질문으로 내면과 대화하세요"
              icon="💭"
              href="/insight?tag=마음카드"
              variant="secondary"
            />

            <InsightCard
              title="사주 팔자"
              description="생년월일 기반 운세와 성향 분석 (준비중)"
              icon="🔮"
              href="#"
              variant="disabled"
            />
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="px-4 py-16 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">빠른 분석</h3>
              <p className="text-white/70">
                단 5분만에 완료되는<br/>간편한 검사
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">정확한 결과</h3>
              <p className="text-white/70">
                AI 기반 심리학 프레임으로<br/>깊이 있는 인사이트
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-2">아름다운 리포트</h3>
              <p className="text-white/70">
                영웅 세계관으로 표현된<br/>나만의 분석 리포트
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

