'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

import type { Provider, Method } from '@/lib/payments/types'

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

const PREMIUM_AMOUNTS = {
  KRW: { premium: 9900, pro: 19900 },
  USD: { premium: 19, pro: 39 },
}

type PaidPlan = 'premium' | 'pro'

type CheckoutResponse = {
  ok: boolean
  redirectUrl?: string
  clientSecret?: string
  error?: string
}

export default function PricingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<PaidPlan | null>(null)

  const startCheckout = useCallback(
    async (plan: PaidPlan) => {
      if (!session?.user) {
        signIn()
        return
      }

      const isKR = (() => {
        try {
          const locale = navigator.language
          if (locale?.toLowerCase().startsWith('ko')) return true
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
          return tz?.toLowerCase().includes('seoul')
        } catch {
          return false
        }
      })()

      const provider: Provider = isKR ? 'portone' : 'stripe'
      const method: Method = isKR ? 'kakao' : 'card'
      const currency = isKR ? 'KRW' : 'USD'
      const amountTable = PREMIUM_AMOUNTS[currency]
      const amount = amountTable[plan]

      const body = {
        provider,
        method,
        amount,
        currency,
        plan,
      }

      try {
        setLoadingPlan(plan)
        const response = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          let detail: CheckoutResponse | null = null
          try {
            detail = (await response.json()) as CheckoutResponse
          } catch {
            /* ignore */
          }

          const message = detail?.error
          if (message?.includes('PortOne environment is not configured')) {
            throw new Error('PortOne 환경변수가 설정되지 않았습니다. 관리자에게 문의해주세요.')
          }

          throw new Error(message || '결제를 시작하지 못했습니다.')
        }

        const result = (await response.json()) as CheckoutResponse
        if (!result.ok) {
          throw new Error(result.error || '결제를 시작하지 못했습니다.')
        }

        if (result.redirectUrl) {
          window.location.href = result.redirectUrl
          return
        }

        if (result.clientSecret) {
          console.log('Stripe PaymentIntent clientSecret:', result.clientSecret)
          return
        }

        router.push('/mypage?sub=ok')
      } catch (error) {
        console.error('Checkout error:', error)
        alert(error instanceof Error ? error.message : '결제 중 오류가 발생했습니다.')
      } finally {
        setLoadingPlan(null)
      }
    },
    [router, session?.user]
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">요금제</h1>
          <p className="text-lg text-white/70">당신에게 맞는 플랜을 선택하세요</p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isPaidPlan = plan.plan === 'premium' || plan.plan === 'pro'
            const isLoading = isPaidPlan ? loadingPlan === plan.plan : false
            return (
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
                    onClick={() => startCheckout(plan.plan as PaidPlan)}
                    disabled={isLoading || status === 'loading'}
                    className={`block w-full rounded-xl px-6 py-3 text-center font-medium transition ${
                      plan.featured
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } ${isLoading ? 'opacity-70' : ''}`}
                  >
                    {isLoading ? '결제 페이지로 이동 중...' : plan.cta}
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
            )
          })}
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
