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

    // TODO: Supabase에 프로필 저장
    // TODO: 검사 결과와 연결
    // TODO: 이메일 큐 등록

    // 임시: localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("test_profile", JSON.stringify(values));
    }

    // 완료 페이지로 이동
    router.push("/test/finish");
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

