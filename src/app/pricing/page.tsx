'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { logEvent } from '@/lib/analytics/logEvent'

const PLANS = [
  {
    name: 'Free',
    price: '무료',
    description: '기본 검사와 간단한 리포트',
    features: [
      '기본 성격 검사',
      '간단 리포트 조회',
      '마음 질문 카드 3개/일',
      '커뮤니티 접근',
    ],
    cta: '무료 시작하기',
    plan: 'free' as const,
    href: '/test',
    featured: false,
    paid: false,
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
      '개인화된 성장 가이드',
    ],
    cta: '프리미엄 시작',
    plan: 'premium' as const,
    href: '/test',
    featured: true,
    paid: true,
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
      '우선 지원',
    ],
    cta: '프로 시작',
    plan: 'pro' as const,
    href: '/test',
    featured: false,
    paid: true,
  },
]

function PricingContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [waitlistOk, setWaitlistOk] = useState<null | boolean>(null)
  const [waitlistMsg, setWaitlistMsg] = useState<string>('')

  const guarded = searchParams.get('guard') === '1'

  useEffect(() => {
    logEvent('premium_gate_view', { path: '/pricing', guard: guarded })
  }, [guarded])

  const onPremiumCtaClick = useCallback((plan: string) => {
    // Log checkout intent for analytics (payment is disabled)
    logEvent('checkout_intent', { path: '/pricing', mode: 'upsell-only', plan })
  }, [])

  const onWaitlistSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setWaitlistOk(null)
      setWaitlistMsg('')

      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ email, source: '/pricing' }),
        })
        const j = await res.json()
        if (!res.ok || !j.ok) throw new Error(j.error || 'FAILED')

        setWaitlistOk(true)
        setWaitlistMsg('조기 체험 신청이 접수됐어요. 런칭 시 메일로 안내합니다.')
        setEmail('')
      } catch {
        setWaitlistOk(false)
        setWaitlistMsg('신청 처리에 실패했어요. 이메일을 확인 후 다시 시도해주세요.')
      }
    },
    [email]
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">프리미엄 (베타 준비중)</h1>
          <p className="text-lg text-white/70">
            지금은 결제 없이 체험 버전이 제공됩니다.
            <br />
            조기 체험 신청을 남기시면 런칭 시 우선 안내를 드려요.
          </p>
        </div>

        {guarded && (
          <div className="mb-6 mx-auto max-w-2xl rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200 text-center">
            <p className="font-medium">프리미엄 기능은 베타 준비 중입니다.</p>
            <p className="mt-1 text-sm text-amber-300/80">조기 체험 신청을 남겨주세요.</p>
          </div>
        )}

        {/* Waitlist Form */}
        <div className="mb-12 mx-auto max-w-2xl">
          <form
            onSubmit={onWaitlistSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
          >
            <h3 className="mb-4 text-xl font-bold text-white">조기 체험 신청</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
              />
              <button
                type="submit"
                className="rounded-lg px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:scale-105 transition"
              >
                신청하기
              </button>
            </div>
            {waitlistOk !== null && (
              <div
                className={`mt-3 text-sm ${waitlistOk ? 'text-emerald-300' : 'text-rose-300'}`}
              >
                {waitlistMsg}
              </div>
            )}
          </form>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`backdrop-blur-md rounded-2xl p-8 transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400 scale-105 shadow-2xl'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.featured && (
                  <div className="mb-4 inline-block rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white">
                    추천
                  </div>
                )}

                <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/60">{plan.period}</span>}
                </div>

                <p className="mb-6 text-white/70">{plan.description}</p>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/80">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          clipRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          fillRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.paid ? (
                  <button
                    type="button"
                    onClick={() => onPremiumCtaClick(plan.plan)}
                    className={`block w-full rounded-xl px-6 py-3 text-center font-medium transition ${
                      plan.featured
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } opacity-60 cursor-not-allowed`}
                  >
                    런칭 예정
                  </button>
                ) : (
                  <Link
                    href={plan.href}
                    className={`block w-full rounded-xl px-6 py-3 text-center font-medium transition ${
                      plan.featured
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">자주 묻는 질문</h2>
          <div className="space-y-4">
            <details className="rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white font-medium">무료 체험이 가능한가요?</summary>
              <p className="mt-2 text-white/70">네, Free 플랜으로 기본 검사를 무료로 이용하실 수 있습니다.</p>
            </details>
            <details className="rounded-xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer text-white font-medium">언제든 해지할 수 있나요?</summary>
              <p className="mt-2 text-white/70">네, 언제든지 설정에서 구독을 취소하실 수 있습니다.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/70">로딩 중...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
