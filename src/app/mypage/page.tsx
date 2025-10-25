/**
 * Dashboard Page v2
 * Enhanced with tabs, tribe/stone visualization, and Inner9 integration
 */

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import dynamic from 'next/dynamic';

import EnhancedHeroCard from '@/components/hero/EnhancedHeroCard';
// import DashboardTabs from '@/components/dashboard/DashboardTabs';
// import { useSearchTab } from '@/lib/hooks/useSearchTab';

// Lazy load tab content components - Hidden for now
// const DetailedReport = dynamic(() => import('@/components/dashboard/DetailedReport'), {
//   ssr: false,
//   loading: () => <TabLoadingState />,
// });

// const DeepAnalysis = dynamic(() => import('@/components/dashboard/DeepAnalysis'), {
//   ssr: false,
//   loading: () => <TabLoadingState />,
// });

// const FortuneCard = dynamic(() => import('@/components/dashboard/FortuneCard'), {
//   ssr: false,
//   loading: () => <TabLoadingState />,
// });

// function TabLoadingState() {
//   return (
//     <div className="min-h-[400px] flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4" />
//         <p className="text-white/60">로딩 중...</p>
//       </div>
//     </div>
//   );
// }

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // const { currentTab } = useSearchTab();
  const [heroData, setHeroData] = useState<any>(null);
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


  const fetchHeroData = useCallback(async () => {
    if (heroData) return;

    const userKey = (session as any)?.user?.email || (session as any)?.providerId || 'anon';
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
        throw new Error('Failed to fetch hero data');
      }

      const data = await response.json();
      sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      setHeroData(data);
      
      // 신규 사용자이고 검사 결과가 없으면 웰컴 페이지로 리다이렉트
      if (!data.hasTestResult) {
        router.push('/welcome');
        return;
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // 에러 발생 시 빈 데이터로 설정 (검사 필요 상태)
      setHeroData({
        user: {
          name: session?.user?.name || 'Guest',
          email: session?.user?.email || '',
        },
        hasTestResult: false
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

    // 웰컴 이동은 실제 데이터 응답에서 hasTestResult로만 판단 (세션 플래그에 의존하지 않음)

    if (status === 'authenticated' && !heroData) {
      fetchHeroData();
    }
  }, [status, session, router, fetchHeroData, heroData]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4" suppressHydrationWarning />
          <p>영웅 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{userName}님의 여정</h1>
        <p className="text-white/60">당신의 내면 세계를 탐험하세요</p>
      </div>

      {/* Main Content: Hero Card + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hero Card (2 columns) */}
        <div className="lg:col-span-2">
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
            birthDate={heroData.birthDate || '1990-01-01'}
          />
        </div>

        {/* Right: Sidebar (1 column) */}
        <div className="lg:col-span-1 space-y-4">
          {/* 계정 관리 */}
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <h3 className="text-lg font-semibold text-violet-300 mb-4">계정 관리</h3>
            <div className="space-y-4">
              {/* 사용자 정보 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    {session?.user?.name?.charAt(0) || userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-white/90 font-medium">{session?.user?.name || userName}</div>
                    <div className="text-white/50 text-xs">{session?.user?.email}</div>
                  </div>
                </div>
              </div>

              {/* 로그인 정보 */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-violet-300">로그인 정보</div>
                
                {/* 로그인 방식 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">로그인 방식</span>
                  <div className="flex items-center gap-1">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="Provider" className="w-4 h-4 rounded" />
                    ) : (
                      <span className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center text-white text-xs">?</span>
                    )}
                    <span className="text-white/80">
                      {session?.user?.email?.includes('@gmail.com') ? 'Google' : 
                       session?.user?.email?.includes('@kakao.com') ? 'Kakao' : 
                       session?.user?.email?.includes('@naver.com') ? 'Naver' : 
                       'Email'}
                    </span>
                  </div>
                </div>

                {/* 로그인 시간 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">로그인 시간</span>
                  <span className="text-white/80">
                    {new Date().toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* 계정 생성일 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">계정 생성일</span>
                  <span className="text-white/80">
                    {(session?.user as any)?.createdAt ? 
                      new Date((session?.user as any).createdAt).toLocaleDateString('ko-KR') : 
                      '정보 없음'
                    }
                  </span>
                </div>

                {/* 마지막 활동 */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">마지막 활동</span>
                  <span className="text-white/80">방금 전</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300 transition hover:border-red-300/60 hover:text-red-200 hover:bg-red-500/10"
                >
                  로그아웃
                </button>
                <button className="w-full rounded-xl border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white hover:bg-white/5">
                  계정 설정
                </button>
              </div>
            </div>
          </div>

          {/* 추천 퀘스트 */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="text-lg font-semibold text-emerald-300 mb-4">추천 퀘스트</h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>#quest-1</span>
                  <span className="rounded-full px-2 py-1 bg-emerald-500/10 text-emerald-200">EASY</span>
                </div>
                <div className="text-sm font-medium text-white/90 mb-1">매일 10분 아이디어 노트 작성</div>
                <p className="text-xs text-white/60 mb-2">자유로운 발상을 기록하며 사고 확장 하기</p>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200"
                >
                  설명하기 →
                </Link>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>#quest-2</span>
                  <span className="rounded-full px-2 py-1 bg-amber-500/10 text-amber-200">MID</span>
                </div>
                <div className="text-sm font-medium text-white/90 mb-1">감정 코칭 세션 예약</div>
                <p className="text-xs text-white/60 mb-2">프로 코치와 1:1 세션으로 감정 밸런스 잡기</p>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200"
                >
                  설명하기 →
                </Link>
              </div>
            </div>
          </div>

          {/* 리포트 도구 */}
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
            <h3 className="text-lg font-semibold text-sky-300 mb-4">리포트 도구</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/report"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition hover:border-white/20 hover:text-white hover:bg-white/10"
              >
                리포트 목록 보기
              </Link>
              <Link
                href="/report"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition hover:border-white/20 hover:text-white hover:bg-white/10"
              >
                공유 링크 관리
              </Link>
              <Link
                href="/report"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 transition hover:border-white/20 hover:text-white hover:bg-white/10"
              >
                PDF 다운로드 기록
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content - Hidden for now */}
      {/* <DashboardTabs>
        {currentTab === 'report' && <DetailedReport heroData={heroData} />}
        {currentTab === 'deep' && <DeepAnalysis heroData={heroData} />}
        {currentTab === 'fortune' && <FortuneCard />}
      </DashboardTabs> */}
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

