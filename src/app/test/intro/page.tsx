"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function TestIntroPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8 text-center"
        >
          {/* 타이틀 */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              InnerMap AI 검사
            </h1>
            <p className="text-xl text-white/70">
              당신의 내면 지도를 그려드립니다
            </p>
          </div>

          {/* 소요시간 & 안내 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">⏱️</span>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">약 5~7분</div>
                <div className="text-sm text-white/60">소요 시간</div>
              </div>
            </div>

            <div className="space-y-3 text-left text-white/70 text-sm">
              <p>✅ 55개 문항으로 구성된 심리 검사입니다.</p>
              <p>✅ MBTI, Big5, RETI, Inner9 분석을 제공합니다.</p>
              <p>✅ 검사 결과는 이메일로 발송됩니다.</p>
            </div>
          </motion.div>

          {/* 개인정보 처리 고지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 text-left space-y-2"
          >
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>🔒</span>
              <span>개인정보 처리 및 활용</span>
            </h3>
            <ul className="text-xs text-white/60 space-y-1 pl-7">
              <li>• 생년월일은 사주 보조지표 분석에 활용됩니다.</li>
              <li>• 이메일은 검사 리포트 발송 및 계정 확인에만 사용됩니다.</li>
              <li>• 수집된 정보는 암호화되어 안전하게 보관됩니다.</li>
              <li>• 언제든지 개인정보 삭제를 요청할 수 있습니다.</li>
            </ul>
          </motion.div>

          {/* 시작 버튼 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push("/test/questions")}
            className="w-full px-8 py-5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-lg font-semibold shadow-2xl shadow-violet-500/30 hover:scale-[1.02] transition"
          >
            검사 시작하기 →
          </motion.button>

          <p className="text-xs text-white/40">
            검사를 시작하면 개인정보 처리방침에 동의한 것으로 간주됩니다.
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}

