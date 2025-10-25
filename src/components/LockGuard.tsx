"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LockGuardProps {
  children: React.ReactNode;
}

export function LockGuard({ children }: LockGuardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* 흐린 컨텐츠 */}
      <div className="pointer-events-none blur-sm opacity-50">
        {children}
      </div>

      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-2xl shadow-violet-500/50 hover:scale-105 transition-transform"
        >
          🔒 심층 분석 열기 (티저) →
        </button>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm grid place-items-center p-4 z-50"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-[#0d1430] to-[#111827] rounded-2xl p-8 max-w-lg w-full space-y-6 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  심층 분석은 한 번에 나를 설계합니다
                </h3>
                <p className="text-white/60 text-sm">
                  Inner9 핵심 IP로 당신의 내면 지도를 완성하세요
                </p>
              </div>

              {/* 기능 리스트 */}
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🧭</span>
                  <div>
                    <strong className="text-white">Inner9 그래프</strong>
                    <p className="text-sm text-white/60">9축 강도/각도 분석</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <strong className="text-white">세계관 매핑</strong>
                    <p className="text-sm text-white/60">대륙 → 12부족 → 결정석</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <strong className="text-white">성장 벡터</strong>
                    <p className="text-sm text-white/60">선천↔후천 경로와 주간 리추얼</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🦸</span>
                  <div>
                    <strong className="text-white">Hero 카드 · PDF 리포트</strong>
                    <p className="text-sm text-white/60">나만의 영웅 카드와 전체 리포트</p>
                  </div>
                </li>
              </ul>

              {/* 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    // TODO: 요금제 페이지로 이동 또는 샘플 미리보기
                    alert("곧 출시됩니다! 🚀");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition"
                >
                  샘플 미리보기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

