"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";

export default function TestProfilePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // 프로필 입력 스킵하고 바로 분석 실행
    const autoSubmit = async () => {
      console.log("🚀 [TestProfile] Auto-submitting without profile...");

      try {
        // 1) localStorage에서 55문항 답변 가져오기
        const answersRaw = localStorage.getItem("test_answers");
        if (!answersRaw) {
          alert("답변 데이터를 찾을 수 없습니다. 검사를 다시 시작해주세요.");
          router.push("/test/intro");
          return;
        }

        const answersObj = JSON.parse(answersRaw);
        
        // answers 객체를 배열로 변환 (question ID 순서대로)
        const answers: number[] = [];
        for (let i = 0; i < 55; i++) {
          const questionId = `q_${String(i + 1).padStart(3, '0')}`; // q_001, q_002, ...
          const value = answersObj[questionId];
          if (value == null) {
            alert(`문항 ${i + 1}의 답변이 누락되었습니다.`);
            return;
          }
          answers.push(value);
        }

        if (answers.length !== 55) {
          alert(`답변이 ${answers.length}개입니다. 55개가 필요합니다.`);
          return;
        }

        console.log("📊 [TestProfile] Calling API with answers:", answers.length);

        // 2) API 호출 (프로필 없이)
        const res = await fetch("/api/test/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            profile: null, // 프로필 스킵
            engineVersion: "imcore-1.0.0",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(`분석 실패: ${data?.message || data?.error || "알 수 없는 오류"}`);
          setIsProcessing(false);
          return;
        }

        console.log("✅ [TestProfile] Analysis complete:", data.assessmentId);

        sessionStorage.setItem('latest_assessment_id', data.assessmentId);

        localStorage.removeItem("test_answers");
        localStorage.removeItem("test_profile");

        // 3) 결과 페이지로 이동
        router.push(`/result/summary?id=${data.assessmentId}`);
      } catch (error) {
        console.error("❌ [TestProfile] Error:", error);
        alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsProcessing(false);
      }
    };

    autoSubmit();
  }, [router]);

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8 text-center"
        >
          <div className="space-y-4">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500"></div>
            <h2 className="text-2xl font-bold text-white">
              분석 중입니다...
            </h2>
            <p className="text-white/60">
              잠시만 기다려주세요
            </p>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}

