"use client";
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ResultHeader from '@/app/_components/ResultHeader';
import { getEngineMetas } from '@/lib/im-core/meta';

const DetailedReport = dynamic(() => import('@/components/dashboard/DetailedReport'), {
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

function ReportContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [heroData, setHeroData] = useState<any>(null);
  const [inner9Data, setInner9Data] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHeroData = useCallback(async () => {
    if (heroData) return;

    const userKey = session?.user?.email || (session as any)?.providerId || 'anon';
    const cacheKey = `hero_data_cache:${userKey}`;
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
        if (response.status === 401) {
          // 세션 만료 시 로그인 페이지로 리다이렉트
          router.push('/login');
          return;
        }
        throw new Error(`Failed to fetch hero data: ${response.status}`);
      }

      const data = await response.json();
      sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      setHeroData(data);
      
      // Inner9 데이터도 함께 설정
      if (data.inner9_scores || data.inner9) {
        setInner9Data(data.inner9_scores || data.inner9);
        localStorage.setItem(`inner9_data_cache:${userKey}`, JSON.stringify(data.inner9_scores || data.inner9));
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // 세션 만료가 아닌 경우에만 fallback 데이터 사용
      if (error instanceof Error && !error.message.includes('401')) {
        setHeroData({
          user: {
            name: session?.user?.name || 'Guest',
            email: session?.user?.email || '',
          },
          hasTestResult: false
        });
      }
    } finally {
      setLoading(false);
    }
  }, [session, heroData, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !heroData) {
      fetchHeroData();
    }

    // Inner9 캐시된 데이터 확인
    if (status === 'authenticated' && !inner9Data) {
      const userKey = session?.user?.email || (session as any)?.providerId || 'anon';
      const cached = localStorage.getItem(`inner9_data_cache:${userKey}`);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setInner9Data(data);
          console.log('Loaded cached Inner9 data');
        } catch (error) {
          console.error('Error parsing cached Inner9 data:', error);
          localStorage.removeItem(`inner9_data_cache:${userKey}`);
        }
      }
    }
  }, [status, router, fetchHeroData, heroData, inner9Data, session]);

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
          <div className="mb-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">데이터를 불러올 수 없습니다</h2>
            <p className="text-white/60 mb-6">세션이 만료되었거나 네트워크 문제가 발생했습니다.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={fetchHeroData}
              className="block w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push('/login')}
              className="block w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ResultHeader
        title="상세 리포트"
        intro={
          <>
            MBTI·RETI·Big5 신호를 im-core가 통합해 문장형 인사이트로 변환한다.<br />
            결과는 당신의 <span className="text-blue-300 font-medium">강점·리스크·추천 액션</span>을 이야기처럼 제시한다.
          </>
        }
        engines={getEngineMetas.report()}
      />

      <DetailedReport heroData={heroData} />
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
