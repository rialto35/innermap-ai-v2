"use client";
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ResultHeader from '@/app/_components/ResultHeader';
import { getEngineMetas } from '@/lib/im-core/meta';

const Inner9Overview = dynamic(() => import('@/components/dashboard/Inner9Overview'), {
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

function Inner9Content() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inner9Data, setInner9Data] = useState<any>(null);

  const runInner9Demo = useCallback(async () => {
    try {
      // 이미 데이터가 있으면 재사용
      if (inner9Data) {
        console.log('Using cached Inner9 data');
        return;
      }

      // 실제 사용자의 검사 결과를 가져와서 Inner9 분석 실행
      const userRes = await fetch('/api/imcore/me');
      const userData = await userRes.json();
      const mbti = userData?.mbti?.type || userData?.mbti_type || undefined;
      const reti = (userData?.reti?.top1?.[0] || userData?.reti_top1 || undefined) as string | undefined;
      
      if (userData.big5 && userData.big5.O !== null && userData.big5.C !== null && userData.big5.E !== null && userData.big5.A !== null && userData.big5.N !== null) {
        // 사용자의 실제 Big5 점수를 사용
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            big5: {
              O: userData.big5.O,
              C: userData.big5.C,
              E: userData.big5.E,
              A: userData.big5.A,
              N: userData.big5.N
            },
            mbti,
            reti,
            locale: 'ko-KR'
          }),
        });
        const j = await res.json();
        if (j.ok) {
          setInner9Data(j.data);
          // 로컬 스토리지에 캐시 저장 (user 스코프)
          const userKeyLocal = (session as any)?.user?.email || (session as any)?.providerId || 'anon';
          localStorage.setItem(`inner9_data_cache:${userKeyLocal}`, JSON.stringify(j.data));
        }
      } else {
        // 검사 결과가 없으면 데모 데이터 사용
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ big5: { O: 82, C: 61, E: 45, A: 77, N: 38 }, locale: 'ko-KR' }),
        });
        const j = await res.json();
        if (j.ok) {
          setInner9Data(j.data);
          // 로컬 스토리지에 캐시 저장 (user 스코프)
          const userKeyLocal = (session as any)?.user?.email || (session as any)?.providerId || 'anon';
          localStorage.setItem(`inner9_data_cache:${userKeyLocal}`, JSON.stringify(j.data));
        }
      }
    } catch (error) {
      console.error('Inner9 demo error:', error);
    }
  }, [inner9Data, session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Inner9 데이터 로드
    if (status === 'authenticated' && !inner9Data) {
      const userKey = (session as any)?.user?.email || (session as any)?.providerId || 'anon';
      
      // 1. 캐시된 데이터 먼저 확인
      const cached = localStorage.getItem(`inner9_data_cache:${userKey}`);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setInner9Data(data);
          console.log('✅ Loaded cached Inner9 data');
          return;
        } catch (error) {
          console.error('Error parsing cached Inner9 data:', error);
          localStorage.removeItem(`inner9_data_cache:${userKey}`);
        }
      }
      
      // 2. 캐시가 없으면 API에서 가져오기
      console.log('📡 Fetching Inner9 data from API...');
      fetch('/api/results/latest')
        .then(res => res.json())
        .then(result => {
          console.log('📦 API response:', result);
          if (result.data?.inner9) {
            // Inner9 데이터가 이미 변환되어 있음 (객체 형태)
            setInner9Data(result.data.inner9);
            localStorage.setItem(`inner9_data_cache:${userKey}`, JSON.stringify(result.data.inner9));
            console.log('✅ Inner9 data loaded from API:', result.data.inner9);
          } else {
            console.warn('⚠️ No Inner9 data in API response');
          }
        })
        .catch(error => {
          console.error('❌ Error fetching Inner9 data:', error);
        });
    }
  }, [status, router, inner9Data, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4" />
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ResultHeader
        title="Inner9 분석"
        intro={
          <>
            당신의 감정, 사고, 행동 패턴을 9가지 축으로 정밀하게 분석한다.<br />
            InnerMap AI는 Big5 기반 성향 데이터와 자체 엔진을 결합해{" "}
            <span className="text-violet-300 font-medium">핵심 에너지 분포와 성장 경로</span>를 시각화한다.
          </>
        }
        engines={getEngineMetas.inner9()}
      />

      <Inner9Overview inner9Data={inner9Data} onRunDemo={runInner9Demo} />
    </div>
  );
}

export default function Inner9Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        </div>
      }
    >
      <Inner9Content />
    </Suspense>
  );
}
