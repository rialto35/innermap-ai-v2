"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import SummaryCard from "@/components/SummaryCard";
import type { SummaryFields } from "@/types/assessment";
import { useSession } from 'next-auth/react';
import { inCohortBrowser } from '@/lib/rolloutClient';

function ResultSummaryContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [summary, setSummary] = useState<SummaryFields | null>(null);
  const [adaptiveHint, setAdaptiveHint] = useState<any | null>(null);
  const [adaptiveValues, setAdaptiveValues] = useState<Record<string, number>>({});
  const [adaptiveSubmitting, setAdaptiveSubmitting] = useState(false);
  const [cohortEligible, setCohortEligible] = useState(false);
  // const [meta, setMeta] = useState<{ createdAt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("결과 ID가 없습니다.");
      setLoading(false);
      return;
    }

    async function fetchResult() {
      try {
        const res = await fetch(`/api/test/results/${id}`);
        if (!res.ok) {
          throw new Error("결과를 불러올 수 없습니다.");
        }
        const data = await res.json();
        setSummary(data.summary);
        // setMeta({ createdAt: data.createdAt });
        setAdaptiveHint(data.adaptiveHint ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  useEffect(() => {
    const email = session?.user?.email || '';
    // cohort percent via env (default 5%)
    const pct = Number(process.env.NEXT_PUBLIC_ADAPTIVE_COHORT_PCT || '5');
    const eligible = email ? inCohortBrowser(email, isNaN(pct) ? 5 : pct) : false;
    setCohortEligible(eligible);
  }, [session]);

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
            <p className="text-white/60">결과를 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !summary) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">결과를 찾을 수 없습니다</h2>
            <p className="text-white/60">{error}</p>
            <button
              onClick={() => router.push("/test/intro")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold"
            >
              새로운 검사 시작하기
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              요약 결과
            </h1>
            <p className="text-white/60">
              MBTI · Big5 기반 성격 분석 결과입니다
            </p>
          </motion.div>

          {/* 요약 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SummaryCard
              summary={summary}
              onViewDetail={() => router.push(`/result/detail?id=${id}`)}
            />
          </motion.div>

          {/* 경계 케이스: 미니 어댑티브 2문항 (플래그 가드, 서버 힌트 기반) */}
          {cohortEligible && adaptiveHint?.type === 'mbti' && Array.isArray(adaptiveHint.items) && adaptiveHint.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">정밀 확인 2문항 (경계 케이스)</h3>
                <span className="text-xs text-white/50">실험적 기능</span>
              </div>
              <div className="space-y-4">
                {adaptiveHint.items.slice(0, 2).map((item: any) => (
                  <div key={item.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-white/90 mb-2">{item.text}</div>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>전혀 아님</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5,6,7].map(n => (
                          <button
                            key={n}
                            onClick={() => setAdaptiveValues(prev => ({ ...prev, [item.id]: n }))}
                            className={`px-2 py-1 rounded border ${adaptiveValues[item.id]===n ? 'bg-violet-500/40 border-violet-400 text-white' : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/10'}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <span>매우 그럼</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  disabled={adaptiveSubmitting || Object.keys(adaptiveValues).length===0}
                  onClick={async () => {
                    try {
                      setAdaptiveSubmitting(true);
                      const start = performance.now();
                      const resp = await fetch('/api/adaptive/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ assessmentId: id, items: Object.entries(adaptiveValues).map(([k,v]) => ({ id: k, value: v })), durationMs: Math.round(performance.now()-start) })
                      });
                      if (!resp.ok) throw new Error('submit failed');
                      alert('감사합니다! 정밀 문항이 반영되었습니다.');
                    } catch {
                      alert('제출에 실패했습니다. 다시 시도해주세요.');
                    } finally { setAdaptiveSubmitting(false); }
                  }}
                  className="px-4 py-2 rounded bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50"
                >
                  {adaptiveSubmitting ? '제출 중...' : '제출하기'}
                </button>
              </div>
            </motion.div>
          )}

          {/* 티저 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-8 text-center space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">
              더 깊이 알고 싶으신가요?
            </h3>
            <p className="text-white/70 text-sm">
              심층 분석에서는 Inner9 그래프, 세계관 매핑(대륙·부족·결정석),
              성장 벡터, Hero 카드 등을 제공합니다.
            </p>
            <button
              onClick={() => router.push(`/result/detail?id=${id}`)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition"
            >
              심층 분석 보기 →
            </button>
          </motion.div>

          {/* 하단 액션 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/mypage")}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
            >
              마이페이지
            </button>
            <button
              onClick={() => {
                // TODO: 공유 기능
                alert("공유 기능 준비 중입니다!");
              }}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
            >
              결과 공유하기
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default function ResultSummaryPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
              <p className="text-white/60">결과를 불러오는 중...</p>
            </div>
          </div>
        </PageContainer>
      }
    >
      <ResultSummaryContent />
    </Suspense>
  );
}
