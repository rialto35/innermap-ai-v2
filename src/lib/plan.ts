/**
 * Plan & Subscription Management
 * 요금제 관리 (현재는 스텁, 추후 Stripe 연동)
 */

'use client';

import { useState, useEffect } from 'react';

export type PlanType = 'free' | 'premium' | 'pro';

export type Subscription = {
  plan: PlanType;
  status: 'active' | 'canceled' | 'past_due';
  renewAt?: string;
};

/**
 * 사용자 구독 정보 조회 (스텁)
 * TODO: Supabase plan_subscriptions 테이블 연동
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재는 모두 free로 고정
    setTimeout(() => {
      setSubscription({
        plan: 'free',
        status: 'active',
      });
      setLoading(false);
    }, 100);
  }, []);

  return { subscription, loading };
}

/**
 * 심층 분석 접근 권한 확인 (스텁)
 * TODO: 실제 plan 체크 로직 구현
 */
export function usePlanGuard() {
  const { subscription } = useSubscription();

  const hasPremiumAccess = () => {
    // 현재는 항상 false (소프트 잠금)
    return false;
    // return subscription?.plan === 'premium' || subscription?.plan === 'pro';
  };

  const hasProAccess = () => {
    return false;
    // return subscription?.plan === 'pro';
  };

  return {
    hasPremiumAccess: hasPremiumAccess(),
    hasProAccess: hasProAccess(),
    currentPlan: subscription?.plan || 'free',
  };
}

