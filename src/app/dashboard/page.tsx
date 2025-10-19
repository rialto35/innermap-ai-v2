/**
 * Dashboard Page v2
 * Enhanced with tabs, tribe/stone visualization, and Inner9 integration
 */

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import EnhancedHeroCard from '@/components/hero/EnhancedHeroCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useSearchTab } from '@/lib/hooks/useSearchTab';

// Lazy load tab content components
const Inner9Overview = dynamic(() => import('@/components/dashboard/Inner9Overview'), {
  ssr: false,
  loading: () => <TabLoadingState />,
});

const DetailedReport = dynamic(() => import('@/components/dashboard/DetailedReport'), {
  ssr: false,
  loading: () => <TabLoadingState />,
});

const DeepAnalysis = dynamic(() => import('@/components/dashboard/DeepAnalysis'), {
  ssr: false,
  loading: () => <TabLoadingState />,
});

function TabLoadingState() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4" />
        <p className="text-white/60">로딩 중...</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentTab } = useSearchTab();
  const [heroData, setHeroData] = useState<any>(null);
  const [inner9Data, setInner9Data] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('hero_data_cache');
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const runInner9Demo = useCallback(async () => {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ big5: { O: 82, C: 61, E: 45, A: 77, N: 38 } }),
      });
      const j = await res.json();
      if (j.ok) setInner9Data(j.data);
    } catch (error) {
      console.error('Inner9 demo error:', error);
    }
  }, []);

  const fetchHeroData = useCallback(async () => {
    if (heroData) return;

    const cacheKey = 'hero_data_cache';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000;

        if (now - timestamp < CACHE_DURATION) {
          setHeroData(cachedData);
          setLoading(false);
          return;
        }
      } catch {
        // Ignore cache parsing errors
      }
    }

    try {
      setLoading(true);
      const response = await fetch('/api/imcore/me');

      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }

      const data = await response.json();
      sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      setHeroData(data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // Fallback data
      setHeroData({
        user: {
          name: session?.user?.name || 'Guest',
          email: session?.user?.email || '',
        },
        hero: {
          name: '비전의 불꽃',
          subtitle: '감정의 에너지로 세상을 움직이는 영혼의 점화자',
          level: 12,
          exp: { current: 340, next: 500 },
          mbti: 'ENFP',
          reti: { code: 'R7', score: 1.8 },
        },
        gem: {
          name: '아우레아',
          keywords: ['균형', '평형', '통합'],
          summary: '조화로운 중심을 만드는 결정.',
          color: '#8B5CF6',
        },
        tribe: {
          name: '화염의 부족',
          nameEn: 'flame',
          color: '#F59E0B',
        },
        growth: { innate: 62, acquired: 74, harmony: 68, individual: 55 },
        strengths: ['영감 전파', '공감 리더십', '창의적 시도'],
        weaknesses: ['지속성 저하', '우선순위 분산', '감정 과몰입'],
      });
    } finally {
      setLoading(false);
    }
  }, [session, heroData]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !heroData) {
      fetchHeroData();
    }
  }, [status, router, fetchHeroData, heroData]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4" />
          <p>영웅 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <p>데이터를 불러올 수 없습니다.</p>
          <button
            onClick={fetchHeroData}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const userName = heroData.user?.name || session?.user?.name || '여행자';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{userName}님의 여정</h1>
          <p className="text-white/60">당신의 내면 세계를 탐험하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition shadow-lg shadow-violet-500/20"
          >
            신규 분석 시작
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded-lg transition"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Hero Highlight Card */}
      <EnhancedHeroCard
        hero={heroData.hero}
        gem={heroData.gem}
        tribe={heroData.tribe}
        growth={heroData.growth}
        strengths={heroData.strengths}
        weaknesses={heroData.weaknesses}
        genderPreference={heroData.genderPreference || 'male'}
        testResultId={heroData.testResultId}
        tribeKey={heroData.tribe?.nameEn || 'lumin'}
        stoneKey={heroData.gem?.nameEn || 'arche'}
      />

      {/* Tabbed Content */}
      <DashboardTabs>
        {currentTab === 'inner9' && (
          <Inner9Overview inner9Data={inner9Data} onRunDemo={runInner9Demo} />
        )}
        {currentTab === 'report' && <DetailedReport heroData={heroData} />}
        {currentTab === 'deep' && <DeepAnalysis />}
      </DashboardTabs>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

