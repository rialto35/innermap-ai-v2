import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { flags } from '@/lib/flags'
import { assertPremium } from '@/lib/auth/premiumGuard'
import { PremiumStatusBanner } from '@/components/PremiumStatusBanner'
import { SubscriptionManage } from '@/components/SubscriptionManage'
import { logEvent } from '@/lib/logEvent'
import { authOptions } from '@/lib/auth'

export default async function PremiumContent() {
  const session = await getServerSession(authOptions) as any
  if (!session?.user?.email) {
    redirect('/login?next=/premium/content')
  }

  let subscription: Awaited<ReturnType<typeof assertPremium>> | null = null
  if (flags.payments_v2_guard) {
    try {
      subscription = await assertPremium({
        id: (session.user as any)?.id,
        email: session.user.email!,
      })
    } catch (error: any) {
      logEvent('premium_guard_blocked', { path: '/premium/content', code: error?.code })
      redirect('/premium?guard=1')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 text-white">
      {subscription && (
        <PremiumStatusBanner
          status={subscription.status}
          end={subscription.current_period_end ?? undefined}
          cancelAtPeriodEnd={subscription.cancel_at_period_end}
          pastDue={subscription.status === 'past_due'}
        />
      )}

      <h1 className="text-3xl font-semibold">프리미엄 성장 프로그램</h1>
      <p className="mt-2 text-white/60">구독자만 이용 가능한 심화 콘텐츠와 도구입니다.</p>

      <SubscriptionManage
        providerPortalUrl={(subscription as any)?.portal_url ?? undefined}
        receiptUrl={(subscription as any)?.receipt_url ?? undefined}
      />

      <div className="mt-6 space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">맞춤형 성장 벡터 분석</h2>
          <p className="mt-2 text-white/70">
            최근 Big5 결과를 기반으로 한 주간 성장 가이드를 확인하세요. 매주 자동으로 업데이트됩니다.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">전문가 코칭 예약</h2>
          <p className="mt-2 text-white/70">
            InnerMap 인증 코치와의 1:1 세션을 예약하고, 실시간 피드백을 받아보세요.
          </p>
        </section>
      </div>
    </div>
  )
}

