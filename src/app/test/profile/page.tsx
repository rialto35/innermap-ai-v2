"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import ProfileForm from "@/components/test/ProfileForm";
import type { ProfileInput } from "@/types/assessment";

export default function TestProfilePage() {
  const router = useRouter();

  const handleSubmit = async (values: ProfileInput) => {
    console.log("📝 [TestProfile] Submitting profile:", values);

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

      // 2) API 호출
      const res = await fetch("/api/test/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          profile: {
            gender: values.gender,
            birthdate: values.birthdate,
            email: values.email,
          },
          engineVersion: "imcore-1.0.0",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`분석 실패: ${data?.message || data?.error || "알 수 없는 오류"}`);
        return;
      }

      console.log("✅ [TestProfile] Analysis complete:", data.assessmentId);

      // 3) localStorage 정리
      localStorage.removeItem("test_answers");
      localStorage.removeItem("test_profile");

      // 4) 결과 페이지로 이동
      router.push(`/result/summary?id=${data.assessmentId}`);
    } catch (error) {
      console.error("❌ [TestProfile] Error:", error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8"
        >
          {/* 헤더 */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              프로필 입력
            </h1>
            <p className="text-white/60">
              검사 결과를 받기 위해 몇 가지 정보를 입력해주세요
            </p>
          </div>

          {/* 프로그레스 바 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 w-full" />
            </div>
            <span className="text-sm text-white/60">3/3</span>
          </div>

          {/* 폼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <ProfileForm onSubmit={handleSubmit} />
          </motion.div>

          {/* 뒤로가기 */}
          <button
            onClick={() => router.back()}
            className="text-white/60 hover:text-white text-sm transition"
          >
            ← 이전으로
          </button>
        </motion.div>
      </div>
    </PageContainer>
  );
}

