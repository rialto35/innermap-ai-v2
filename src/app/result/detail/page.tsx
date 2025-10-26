"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { LockGuard } from "@/components/LockGuard";
import type { PremiumFields } from "@/types/assessment";
import type { ResultBundle, ResultCoaching, ResultDetail } from "@/types/result-bundle";

const Inner9Graph = dynamic(() => import("@/components/charts/Inner9Graph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex items-center justify-center text-white/50">
      로딩 중...
    </div>
  ),
});

function ResultDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [resultId, setResultId] = useState<string | null>(queryId);
  const [detail, setDetail] = useState<ResultDetail | null>(null);
  const [coaching, setCoaching] = useState<ResultCoaching | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      try {
        setLoading(true);
        let targetId = queryId;

        if (!targetId) {
          const latestRes = await fetch("/api/me/latest", { cache: "no-store" });
          if (!latestRes.ok) throw new Error("최근 검사 정보를 불러올 수 없습니다.");
          const latestData = await latestRes.json();
          targetId = latestData?.result_id || null;
        }

        if (!targetId) {
          throw new Error("결과 ID가 없습니다. 검사를 먼저 진행해주세요.");
        }

        setResultId(targetId);

        const bundleRes = await fetch(`/api/results/${targetId}?bundle=detail,coaching`, {
          cache: "no-store",
        });
        if (!bundleRes.ok) {
          const data = await bundleRes.json().catch(() => ({}));
          throw new Error(data?.message || "심층 데이터를 불러올 수 없습니다.");
        }

        const bundle = (await bundleRes.json()) as ResultBundle;
        if (!bundle.detail) {
          throw new Error("심층 분석 데이터가 아직 생성되지 않았습니다.");
        }

        if (!mounted) return;
        setDetail(bundle.detail);
        setCoaching(bundle.coaching ?? null);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "심층 데이터를 불러오지 못했습니다.");
        setDetail(null);
        setCoaching(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDetail();
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
            <p className="text-white/60">심층 데이터를 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !detail) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">심층 분석을 확인할 수 없습니다</h2>
            <p className="text-white/60">{error}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => router.push("/result/summary" + (resultId ? `?id=${resultId}` : ""))}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
              >
                요약으로 돌아가기
              </button>
              <button
                onClick={() => router.push("/test/intro")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold"
              >
                새로운 검사 시작하기
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const premium: PremiumFields = {
    inner9: detail.inner9,
    world: detail.world,
    growthVector: detail.growthVector,
  } as PremiumFields;

  return (
    <PageContainer>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">심층 분석</h1>
            <p className="text-white/60">Inner9 · 세계관 · 성장 경로 분석 결과</p>
          </motion.div>

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
              <Inner9Graph labels={premium.inner9.labels} values={premium.inner9.axes} />
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {premium.inner9.labels.map((label, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-white/70 font-medium">{label}</div>
                    <div className="text-white font-bold text-lg">{premium.inner9.axes[i]}</div>
                  </div>
                ))}
              </div>
            </LockGuard>
          </motion.div>

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
                    <div className="text-2xl font-bold text-white">{premium.world.continent}</div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">12부족</div>
                    <div className="text-2xl font-bold text-white">{premium.world.tribe}</div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">결정석</div>
                    <div className="text-2xl font-bold text-white">{premium.world.stone}</div>
                  </div>
                </div>
              </div>
            </LockGuard>
          </motion.div>

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

          {coaching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span>✨</span>
                <span>오늘의 코칭 카드</span>
              </h2>
              <div className="space-y-6 text-white/80 text-sm">
                <div>
                  <div className="text-white text-lg font-semibold mb-2">한 줄 요약</div>
                  <p>{coaching.daily.oneLiner}</p>
                </div>
                <div>
                  <div className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                    <span>⭐</span>
                    <span>실천 액션</span>
                  </div>
                  <ul className="space-y-2 list-disc list-inside">
                    {coaching.daily.actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white text-lg font-semibold mb-2">주간 플랜</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-white/70 text-xs uppercase">Rituals</div>
                      <ul className="space-y-1 list-disc list-inside">
                        {coaching.weeklyPlan.rituals.map((ritual, idx) => (
                          <li key={idx}>{ritual}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs uppercase">Blockers</div>
                      <ul className="space-y-1 list-disc list-inside">
                        {coaching.weeklyPlan.blockers.map((blocker, idx) => (
                          <li key={idx}>{blocker}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/10">
                    <div className="text-white/60 text-xs uppercase mb-1">Work</div>
                    <div>{coaching.narrative.work}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10">
                    <div className="text-white/60 text-xs uppercase mb-1">Relation</div>
                    <div>{coaching.narrative.relation}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10">
                    <div className="text-white/60 text-xs uppercase mb-1">Habit</div>
                    <div>{coaching.narrative.habit}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/result/summary" + (resultId ? `?id=${resultId}` : ""))}
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

export default function ResultDetailPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
              <p className="text-white/60">심층 데이터를 불러오는 중...</p>
            </div>
          </div>
        </PageContainer>
      }
    >
      <ResultDetailContent />
    </Suspense>
  );
}
