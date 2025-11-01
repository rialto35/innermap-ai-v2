"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// 경계 영역 정밀화를 위한 3문항
const REFINE_QUESTIONS = [
  {
    id: 1,
    axis: "EI",
    question: "사람들과 함께 있을 때 에너지가 충전되는 느낌을 받는다.",
    description: "외향성(E) vs 내향성(I)",
  },
  {
    id: 2,
    axis: "SN",
    question: "구체적인 사실보다 가능성과 의미를 더 중요하게 생각한다.",
    description: "직관(N) vs 감각(S)",
  },
  {
    id: 3,
    axis: "TF",
    question: "결정을 내릴 때 논리적 분석보다 사람들의 감정을 우선한다.",
    description: "감정(F) vs 사고(T)",
  },
];

const LIKERT_OPTIONS = [
  { value: 0, label: "전혀 아니다", emoji: "😟" },
  { value: 1, label: "아니다", emoji: "🙁" },
  { value: 2, label: "보통이다", emoji: "😐" },
  { value: 3, label: "그렇다", emoji: "🙂" },
  { value: 4, label: "매우 그렇다", emoji: "😊" },
];

export default function RefinePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === REFINE_QUESTIONS.length;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/test/refine");
    }
  }, [status, router]);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      alert("모든 문항에 답변해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 정밀화 답변을 서버로 전송
      const response = await fetch("/api/test/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          email: session?.user?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "정밀화 중 오류가 발생했습니다.");
      }

      console.log("✅ Refine complete:", data);

      // 마이페이지로 이동
      router.push("/mypage?refined=true");
    } catch (error: any) {
      console.error("❌ Refine error:", error);
      alert(error.message || "정밀화 중 오류가 발생했습니다. 다시 시도해주세요.");
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
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
              🎯
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                MBTI 유형 정밀화
              </h1>
              <p className="text-sm text-gray-600">
                경계 영역 확인을 위한 3문항
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>💡 안내:</strong> 현재 MBTI 유형이 경계 영역에 있습니다.
              3개 문항에 답변하시면 더 정확한 유형을 확인할 수 있습니다.
            </p>
          </div>

          {/* 진행률 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>진행률</span>
              <span>{answeredCount} / {REFINE_QUESTIONS.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / REFINE_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 문항 카드 */}
        <div className="space-y-6 mb-6">
          {REFINE_QUESTIONS.map((item) => {
            const answered = answers[item.id] !== undefined;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                  answered ? "ring-2 ring-amber-500" : ""
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.id}
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      {item.description}
                    </span>
                  </div>
                  <p className="text-lg text-gray-900 font-medium">
                    {item.question}
                  </p>
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
                            ? "border-amber-500 bg-amber-50 scale-105"
                            : "border-gray-200 hover:border-amber-300 hover:bg-amber-50"
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

        {/* 제출 버튼 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="w-full px-8 py-4 rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                정밀화 중...
              </span>
            ) : (
              "정밀화 완료"
            )}
          </button>

          {!isComplete && (
            <p className="text-center text-sm text-gray-500 mt-4">
              모든 문항에 답변해주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

