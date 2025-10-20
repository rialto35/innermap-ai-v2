"use client";
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ResultHeader from '@/app/_components/ResultHeader';
import { getEngineMetas } from '@/lib/im-core/meta';

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

function DeepContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <ResultHeader
        title="심층분석"
        intro={
          <>
            점수가 어떻게 계산되었는지를 투명하게 공개한다.<br />
            정규화/가중치/파이프라인과 <span className="text-emerald-300 font-medium">한계까지 함께 제시</span>한다.
          </>
        }
        engines={getEngineMetas.deep()}
      />

      <DeepAnalysis heroData={heroData} />
    </div>
  );
}

export default function DeepPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        </div>
      }
    >
      <DeepContent />
    </Suspense>
  );
}
