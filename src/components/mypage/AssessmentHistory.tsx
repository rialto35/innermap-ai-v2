"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Assessment {
  id: string;
  createdAt: string;
  completedAt: string;
  engineVersion: string;
  summary: {
    mbti: string;
    big5: Record<string, number>;
    keywords: string[];
    confidence?: number;
  } | null;
}

export default function AssessmentHistory() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch("/api/test/assessments");
        if (!res.ok) {
          throw new Error("검사 목록을 불러올 수 없습니다.");
        }
        const data = await res.json();
        setAssessments(data.assessments || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">검사 기록</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20 mx-auto mb-2"></div>
          <p className="text-white/60 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">검사 기록</h3>
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">검사 기록</h3>
        <div className="text-center py-8 space-y-4">
          <p className="text-white/60 text-sm">아직 검사 기록이 없습니다.</p>
          <button
            onClick={() => router.push("/test/intro")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold hover:scale-[1.02] transition"
          >
            첫 검사 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">검사 기록</h3>
        <span className="text-sm text-white/60">{assessments.length}개</span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/result/summary?id=${assessment.id}`)}
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 cursor-pointer transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {assessment.summary?.mbti && (
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold">
                    {assessment.summary.mbti}
                  </span>
                )}
                {assessment.summary?.confidence && (
                  <span className="text-xs text-white/50">
                    {Math.round(assessment.summary.confidence * 100)}%
                  </span>
                )}
              </div>
              <span className="text-xs text-white/50">
                {new Date(assessment.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {assessment.summary?.keywords && assessment.summary.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {assessment.summary.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            <div className="text-xs text-white/40">
              {new Date(assessment.createdAt).toLocaleString("ko-KR")}
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => router.push("/test/intro")}
        className="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 text-sm transition"
      >
        + 새로운 검사 시작
      </button>
    </div>
  );
}

