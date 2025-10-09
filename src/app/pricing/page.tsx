import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '무료',
    description: '기본 검사와 간단한 리포트',
    features: [
      '기본 성격 검사',
      '간단 리포트 조회',
      '마음 질문 카드 3개/일',
      '커뮤니티 접근'
    ],
    cta: '무료 시작하기',
    href: '/test',
    featured: false
  },
  {
    name: 'Premium',
    price: '₩9,900',
    period: '/월',
    description: '심층 분석과 상세 리포트',
    features: [
      'Free 모든 기능',
      '심층 성격 검사',
      '상세 영웅 리포트',
      'PDF 다운로드',
      '무제한 마음카드',
      '개인화된 성장 가이드'
    ],
    cta: '프리미엄 시작',
    href: '/test',
    featured: true
  },
  {
    name: 'Pro',
    price: '₩29,900',
    period: '/월',
    description: '전문가급 분석과 코칭',
    features: [
      'Premium 모든 기능',
      '월 1회 전문가 코칭',
      '팀 분석 (최대 10명)',
      '맞춤 워크샵 자료',
      '우선 지원'
    ],
    cta: '프로 시작',
    href: '/test',
    featured: false
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            요금제
          </h1>
          <p className="text-white/70 text-lg">
            당신에게 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* 요금 카드 그리드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 transition-all ${
                plan.featured
                  ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400 scale-105 shadow-2xl'
                  : 'bg-white/5 border border-white/10'
              } backdrop-blur-md`}
            >
              {/* 추천 배지 */}
              {plan.featured && (
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-medium mb-4">
                  추천
                </div>
              )}

              {/* 플랜명 */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>

              {/* 가격 */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-white/60">{plan.period}</span>
                )}
              </div>

              {/* 설명 */}
              <p className="text-white/70 mb-6">
                {plan.description}
              </p>

              {/* 특징 목록 */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/80">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA 버튼 */}
              <Link
                href={plan.href}
                className={`block w-full text-center px-6 py-3 rounded-xl font-medium transition ${
                  plan.featured
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="rounded-xl bg-white/5 border border-white/10 p-4">
              <summary className="text-white font-medium cursor-pointer">
                무료 체험이 가능한가요?
              </summary>
              <p className="text-white/70 mt-2">
                네, Free 플랜으로 기본 검사를 무료로 이용하실 수 있습니다.
              </p>
            </details>
            <details className="rounded-xl bg-white/5 border border-white/10 p-4">
              <summary className="text-white font-medium cursor-pointer">
                언제든 해지할 수 있나요?
              </summary>
              <p className="text-white/70 mt-2">
                네, 언제든지 설정에서 구독을 취소하실 수 있습니다.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
