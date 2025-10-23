"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ResultHeader from '@/app/_components/ResultHeader';
import { getEngineMetas } from '@/lib/im-core/meta';

const FortuneCard = dynamic(() => import('@/components/dashboard/FortuneCard'), {
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

function CoachContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // 세션 확인을 위한 간단한 API 호출
      const checkSession = async () => {
        try {
          const response = await fetch('/api/imcore/me');
          if (response.status === 401) {
            router.push('/login');
            return;
          }
        } catch (error) {
          console.error('Session check failed:', error);
        } finally {
          setLoading(false);
        }
      };

      checkSession();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
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
        title="성장 예측"
        intro={
          <>
            최근 3회 이상의 결과를 기반으로 다가올 7일의 에너지 흐름을 예측한다.<br />
            <span className="text-amber-300 font-medium">집중/협업/휴식의 타이밍</span>을 제안한다.
          </>
        }
        engines={getEngineMetas.forecast()}
      />

      <FortuneCard />
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
        </div>
      }
    >
      <CoachContent />
    </Suspense>
  );
}
