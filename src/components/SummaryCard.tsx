"use client";

import type { SummaryFields } from "@/types/assessment";
import { motion } from "framer-motion";

interface SummaryCardProps {
  summary: SummaryFields;
  onViewDetail?: () => void;
}

export default function SummaryCard({ summary, onViewDetail }: SummaryCardProps) {
  const { mbti, big5, keywords, confidence } = summary;

  return (
    <div className="space-y-6">
      {/* MBTI & 신뢰도 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
      >
        <h3 className="text-sm text-white/60 mb-2">MBTI 성격 유형</h3>
        <div className="text-5xl font-bold text-white mb-3">{mbti}</div>
        {confidence && (
          <div className="text-sm text-white/50">
            신뢰도: {Math.round(confidence * 100)}%
          </div>
        )}
      </motion.div>

      {/* Big5 미니바 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🧠</span>
          <span>Big5 성격 분석</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(big5).map(([key, value]) => {
            const labels: Record<string, string> = {
              O: "개방성 (Openness)",
              C: "성실성 (Conscientiousness)",
              E: "외향성 (Extraversion)",
              A: "친화성 (Agreeableness)",
              N: "신경성 (Neuroticism)",
            };
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{labels[key]}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 키워드 칩 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>주요 키워드 Top 5</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white/80 text-sm border border-violet-500/30"
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* CTA 버튼 */}
      {onViewDetail && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onViewDetail}
          className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition"
        >
          🔍 심층 분석 보기 (Inner9 · 세계관)
        </motion.button>
      )}
    </div>
  );
}

