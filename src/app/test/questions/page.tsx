"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { items60 } from "@/core/im-core-v2/items60";

const LIKERT_OPTIONS = [
  { value: 0, label: "전혀 아니다", emoji: "😟" },
  { value: 1, label: "아니다", emoji: "🙁" },
  { value: 2, label: "보통이다", emoji: "😐" },
  { value: 3, label: "그렇다", emoji: "🙂" },
  { value: 4, label: "매우 그렇다", emoji: "😊" },
];

export default function QuestionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(items60.length / questionsPerPage);
  const currentQuestions = items60.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / items60.length) * 100);
  const isPageComplete = currentQuestions.every((q) => answers[q.id] !== undefined);
  const isAllComplete = answeredCount === items60.length;

  useEffect(() => {
    // 로그인 체크 (익명 검사가 비활성화된 경우)
    if (status === "unauthenticated") {
      const anonEnabled = process.env.NEXT_PUBLIC_ANON_TEST_ENABLED === "true";
      if (!anonEnabled) {
        router.push("/login?callbackUrl=/test/questions");
      }
    }
  }, [status, router]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!isAllComplete) {
      alert("모든 문항에 답변해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // answers를 배열로 변환 (1-based index → 0-based)
      const answersArray = items60.map((item) => answers[item.id]);

      const response = await fetch("/api/test/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersArray,
          profile: {
            email: session?.user?.email,
          },
          engineVersion: "imcore-v2.2",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "분석 중 오류가 발생했습니다.");
      }

      console.log("✅ Analysis complete:", data);

      // 결과 페이지로 이동
      router.push(`/test/results/${data.assessmentId}`);
    } catch (error: any) {
      console.error("❌ Analysis error:", error);
      alert(error.message || "분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            성격 유형 검사 (v2.2)
          </h1>
          <p className="text-gray-600 mb-4">
            60개 문항에 솔직하게 답변해주세요. 약 5-7분 소요됩니다.
          </p>
          
          {/* 진행률 바 */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>진행률: {progress}%</span>
              <span>{answeredCount} / {items60.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 페이지 네비게이션 */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              페이지 {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? "bg-purple-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`페이지 ${idx + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 문항 카드 */}
        <div className="space-y-6 mb-6">
          {currentQuestions.map((item) => {
            const answered = answers[item.id] !== undefined;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                  answered ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900 font-medium">
                      {item.question}
                    </p>
                  </div>
                </div>

                {/* Likert 선택지 */}
                <div className="grid grid-cols-5 gap-2">
                  {LIKERT_OPTIONS.map((option) => {
                    const isSelected = answers[item.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(item.id, option.value)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 scale-105"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <span className="text-2xl mb-1">{option.emoji}</span>
                        <span className="text-xs text-gray-700 font-medium text-center">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 네비게이션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              ← 이전
            </button>

            {currentPage === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isAllComplete || isSubmitting}
                className="px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    분석 중...
                  </span>
                ) : (
                  "분석 완료"
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isPageComplete}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                다음 →
              </button>
            )}
          </div>

          {!isPageComplete && currentPage < totalPages - 1 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              현재 페이지의 모든 문항에 답변해야 다음으로 이동할 수 있습니다.
            </p>
          )}

          {currentPage === totalPages - 1 && !isAllComplete && (
            <p className="text-center text-sm text-orange-600 mt-4">
              아직 답변하지 않은 문항이 {items60.length - answeredCount}개 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
