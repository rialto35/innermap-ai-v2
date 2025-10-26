"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import SummaryCard from "@/components/SummaryCard";
import type { SummaryFields } from "@/types/assessment";
import type { ResultBundle } from "@/types/result-bundle";

function ResultSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [summary, setSummary] = useState<SummaryFields | null>(null);
  const [resultId, setResultId] = useState<string | null>(queryId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadSummary() {
      try {
        setLoading(true);
        let targetId = queryId;

        if (!targetId) {
          const latestRes = await fetch("/api/me/latest", { cache: "no-store" });
          if (!latestRes.ok) {
            throw new Error("최근 검사 정보를 불러올 수 없습니다.");
          }
          const latestData = await latestRes.json();
          targetId = latestData?.result_id || null;
        }

        if (!targetId) {
          throw new Error("결과 ID가 없습니다. 검사를 먼저 진행해주세요.");
        }

        setResultId(targetId);

        const bundleRes = await fetch(`/api/results/${targetId}?bundle=summary`, {
          cache: "no-store",
        });

        if (!bundleRes.ok) {
          const data = await bundleRes.json().catch(() => ({}));
          throw new Error(data?.message || "결과를 불러올 수 없습니다.");
        }

        const bundle = (await bundleRes.json()) as ResultBundle;
        if (!bundle.summary) {
          throw new Error("요약 데이터를 찾을 수 없습니다.");
        }

        if (!mounted) return;
        setSummary(bundle.summary as SummaryFields);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "결과를 불러오지 못했습니다.");
        setSummary(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSummary();

    return () => {
      mounted = false;
    };
  }, [queryId]);

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
              onViewDetail={() => router.push(`/result/detail?id=${resultId ?? ""}`)}
            />
          </motion.div>

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
              onClick={() => router.push(`/result/detail?id=${resultId ?? ""}`)}
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
