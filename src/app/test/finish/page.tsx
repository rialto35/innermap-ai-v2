"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function TestFinishPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const latestAssessmentId = sessionStorage.getItem("latest_assessment_id");
      if (latestAssessmentId) {
        router.push(`/result/summary?id=${latestAssessmentId}`);
      } else {
        router.push("/result/summary");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-5xl"
          >
            ✓
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              검사 완료!
            </h1>
            <p className="text-white/70">
              분석 결과를 생성하고 있습니다...
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-left space-y-2">
            <p className="text-sm text-white/70">
              ✅ 검사 데이터가 저장되었습니다
            </p>
            <p className="text-sm text-white/70">
              ✅ 이메일로 리포트가 발송됩니다
            </p>
            <p className="text-sm text-white/70">
              ✅ 잠시 후 요약 결과 페이지로 이동합니다
            </p>
          </div>

          <button
            onClick={() => {
              const latestAssessmentId = sessionStorage.getItem("latest_assessment_id");
              if (latestAssessmentId) {
                router.push(`/result/summary?id=${latestAssessmentId}`);
              } else {
                router.push("/result/summary");
              }
            }}
            className="text-white/60 hover:text-white text-sm transition underline"
          >
            지금 바로 보기 →
          </button>
        </motion.div>
      </div>
    </PageContainer>
  );
}

