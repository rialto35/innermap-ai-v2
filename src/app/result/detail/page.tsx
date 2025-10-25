"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { LockGuard } from "@/components/LockGuard";

// Inner9Graph는 client-only (recharts)
const Inner9Graph = dynamic(() => import("@/components/charts/Inner9Graph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 flex items-center justify-center text-white/50">
      로딩 중...
    </div>
  ),
});

// TODO: 실제 API에서 데이터 가져오기
const mockInner9 = {
  labels: ["자아", "관계", "성장", "목표", "감정", "사고", "행동", "가치", "에너지"],
  values: [75, 82, 68, 90, 55, 78, 72, 85, 65],
};

const mockWorld = {
  continent: "동방의 대륙",
  tribe: "노드크루스",
  stone: "베르디",
};

export default function ResultDetailPage() {
  const router = useRouter();

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
                labels={mockInner9.labels}
                values={mockInner9.values}
              />
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {mockInner9.labels.map((label, i) => (
                  <div
                    key={i}
                    className="text-center p-3 rounded-lg bg-white/5"
                  >
                    <div className="text-white/70 font-medium">{label}</div>
                    <div className="text-white font-bold text-lg">
                      {mockInner9.values[i]}
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
                      {mockWorld.continent}
                    </div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">12부족</div>
                    <div className="text-2xl font-bold text-white">
                      {mockWorld.tribe}
                    </div>
                  </div>
                  <div className="text-4xl">↓</div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">결정석</div>
                    <div className="text-2xl font-bold text-white">
                      {mockWorld.stone}
                    </div>
                  </div>
                </div>
              </div>
            </LockGuard>
          </motion.div>

          {/* 성장 벡터 (잠금) */}
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
                    논리적 사고 · 독립성 · 호기심
                  </div>
                </div>
                <div className="text-4xl">↓</div>
                <div>
                  <div className="text-sm text-white/60 mb-2">후천 (To)</div>
                  <div className="text-white/80">
                    공감 능력 · 협업 · 안정성
                  </div>
                </div>
              </div>
            </LockGuard>
          </motion.div>

          {/* 하단 액션 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/result/summary")}
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

