/**
 * useSearchTab Hook
 * URL 쿼리 파라미터와 동기화된 탭 상태 관리
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export type TabValue = 'inner9' | 'report' | 'deep' | 'fortune';

export function useSearchTab(defaultTab: TabValue = 'inner9') {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = (searchParams.get('tab') as TabValue) ?? defaultTab;

  const setTab = useCallback(
    (tab: TabValue) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return { currentTab, setTab };
}

