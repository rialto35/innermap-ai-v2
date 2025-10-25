"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { LockGuard } from "@/components/LockGuard";
import type { PremiumFields } from "@/types/assessment";

// Inner9Graph는 client-only (recharts)
const Inner9Graph = dynamic(() => import("@/components/charts/Inner9Graph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex items-center justify-center text-white/50">
      로딩 중...
    </div>
  ),
});

export default function ResultDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [premium, setPremium] = useState<PremiumFields | null>(null);
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
        setPremium(data.premium);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

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

  if (error || !premium) {
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              심층 분석
            </h1>
            <p className="text-white/60">
              Inner9 · 세계관 · 성장 경로 분석 결과
            </p>
          </motion.div>

          {/* Inner9 그래프 (잠금) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <span>🧭</span>
              <span>Inner9 그래프</span>
            </h2>
            <LockGuard>
              <Inner9Graph
                labels={premium.inner9.labels}
                values={premium.inner9.axes}
              />
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {premium.inner9.labels.map((label, i) => (
                  <div
                    key={i}
                    className="text-center p-3 rounded-lg bg-white/5"
                  >
                    <div className="text-white/70 font-medium">{label}</div>
                    <div className="text-white font-bold text-lg">
                      {premium.inner9.axes[i]}
                    </div>
                  </div>
                ))}
              </div>
            </LockGuard>
          </motion.div>

          {/* 세계관 매핑 (잠금) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <span>🌍</span>
              <span>세계관 매핑</span>
            </h2>
            <LockGuard>
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-sm text-white/60 mb-1">대륙</div>
                    <div className="text-2xl font-bold text-white">
                      {premium.world.continent}
                    </div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">12부족</div>
                    <div className="text-2xl font-bold text-white">
                      {premium.world.tribe}
                    </div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">결정석</div>
                    <div className="text-2xl font-bold text-white">
                      {premium.world.stone}
                    </div>
                  </div>
                </div>
              </div>
            </LockGuard>
          </motion.div>

          {/* 성장 벡터 (잠금) */}
          {premium.growthVector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span>📈</span>
                <span>성장 벡터</span>
              </h2>
              <LockGuard>
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-sm text-white/60 mb-2">선천 (From)</div>
                    <div className="text-white/80">
                      기준선: {premium.growthVector.from.join(", ")}
                    </div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-2">후천 (To)</div>
                    <div className="text-white/80">
                      현재: {premium.growthVector.to.join(", ")}
                    </div>
                  </div>
                </div>
              </LockGuard>
            </motion.div>
          )}

          {/* 하단 액션 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/result/summary?id=${id}`)}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
            >
              ← 요약으로 돌아가기
            </button>
            <button
              onClick={() => router.push("/mypage")}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
            >
              마이페이지
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
