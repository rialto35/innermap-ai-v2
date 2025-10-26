/**
 * Dashboard Page v2
 * Enhanced with tabs, tribe/stone visualization, and Inner9 integration
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import AssessmentHistory from '@/components/mypage/AssessmentHistory';
import type { ResultBundle, ResultDashboard } from '@/types/result-bundle';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<ResultDashboard | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      try {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
          router.push('/login');
          return;
        }

        setLoading(true);

        const latestRes = await fetch('/api/me/latest', { cache: 'no-store' });
        if (!latestRes.ok) {
          throw new Error('최신 검사 정보를 불러올 수 없습니다.');
        }
        const latestData = await latestRes.json();
        if (!latestData?.result_id) {
          throw new Error('아직 검사 기록이 없습니다. 새로운 검사를 시작해주세요.');
        }
        const targetId = latestData.result_id as string;
        setResultId(targetId);

        const bundleRes = await fetch(`/api/results/${targetId}?bundle=summary,detail,dashboard`, {
          cache: 'no-store',
        });
        if (!bundleRes.ok) {
          const data = await bundleRes.json().catch(() => ({}));
          throw new Error(data?.message || '결과 번들을 불러올 수 없습니다.');
        }

        const bundle = (await bundleRes.json()) as ResultBundle;
        if (!bundle.dashboard) {
          throw new Error('대시보드 데이터가 아직 생성되지 않았습니다. 잠시 후 다시 시도해주세요.');
        }

        if (!mounted) return;
        setDashboard(bundle.dashboard);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || '마이페이지 정보를 불러오지 못했습니다.');
        setDashboard(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4" />
          <p>대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70 px-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold text-white">마이페이지를 불러올 수 없습니다</h1>
          <p>{error}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push('/test/intro')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold"
            >
              새로운 검사 시작하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || '여행자';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{userName}님의 여정</h1>
        <p className="text-white/60">당신의 최신 검사 결과를 기반으로 인사이트를 제공합니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <h2 className="text-xl font-semibold text-violet-200 mb-4">현재 레벨</h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-white">Lv. {dashboard.level}</div>
              <div className="flex-1">
                <div className="text-white/60 text-sm mb-1">
                  경험치 {dashboard.xp.current} / {dashboard.xp.max}
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    style={{ width: `${Math.min(100, Math.round((dashboard.xp.current / dashboard.xp.max) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h2 className="text-xl font-semibold text-emerald-200 mb-4">강점 & 성장 영역</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/80">
              <div>
                <div className="text-white/50 text-xs uppercase mb-2">Strengths</div>
                <div className="space-y-2">
                  {dashboard.strengths.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs uppercase mb-2">Growth Areas</div>
                <div className="space-y-2">
                  {dashboard.growthAreas.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
            <h2 className="text-xl font-semibold text-sky-200 mb-4">추천 퀘스트</h2>
            <div className="space-y-3">
              {dashboard.quests.map((quest, idx) => (
                <div key={quest.id || idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                    <span>#{quest.id}</span>
                    <span className="rounded-full px-2 py-1 bg-white/10 text-white/80 uppercase text-2xs">
                      {quest.difficulty}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white/90 mb-1">{quest.title}</div>
                  <p className="text-xs text-white/60">강점을 살려 미션을 수행해보세요.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <AssessmentHistory />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white mb-4">빠른 이동</h3>
            <div className="space-y-3 text-sm text-white/70">
              <Link
                href={resultId ? `/result/summary?id=${resultId}` : '/result/summary'}
                className="block rounded-xl border border-white/10 px-4 py-2 hover:border-white/20 hover:text-white transition"
              >
                요약 리포트 보기
              </Link>
              <Link
                href={resultId ? `/result/detail?id=${resultId}` : '/result/detail'}
                className="block rounded-xl border border-white/10 px-4 py-2 hover:border-white/20 hover:text-white transition"
              >
                심층 분석 보기
              </Link>
              <Link
                href="/test/intro"
                className="block rounded-xl border border-violet-500/40 px-4 py-2 text-violet-200 hover:border-violet-500/60 hover:text-violet-100 transition"
              >
                새로운 검사 시작하기
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white mb-4">계정 관리</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-white font-medium">{session?.user?.name || '회원'}</div>
                  <div className="text-white/50 text-xs">{session?.user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300 transition hover:border-red-400/60 hover:text-red-100 hover:bg-red-500/10"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
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

