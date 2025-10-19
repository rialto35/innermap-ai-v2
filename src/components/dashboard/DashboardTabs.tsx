/**
 * DashboardTabs Component
 * Inner9, 상세 리포트, 심층 분석 탭 내비게이션
 */

'use client';

import { Suspense } from 'react';
import { useSearchTab, type TabValue } from '@/lib/hooks/useSearchTab';

interface DashboardTabsProps {
  children: React.ReactNode;
}

function DashboardTabsContent({ children }: DashboardTabsProps) {
  const { currentTab, setTab } = useSearchTab();

  const tabs: { value: TabValue; label: string; icon: string }[] = [
    { value: 'inner9', label: 'Inner9', icon: '🧭' },
    { value: 'report', label: '상세 리포트', icon: '📊' },
    { value: 'deep', label: '심층 분석', icon: '🔍' },
    { value: 'fortune', label: '운세', icon: '🔮' },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTab(tab.value)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
              ${
                currentTab === tab.value
                  ? 'text-white border-b-2 border-violet-500 bg-violet-500/10'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">{children}</div>
    </div>
  );
}

export default function DashboardTabs({ children }: DashboardTabsProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      }
    >
      <DashboardTabsContent>{children}</DashboardTabsContent>
    </Suspense>
  );
}

