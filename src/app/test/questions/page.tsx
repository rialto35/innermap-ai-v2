"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import UnifiedQuestion from "@/components/analyze/UnifiedQuestion";
import UnifiedProgress from "@/components/analyze/UnifiedProgress";
import { useAnalyzeStore } from "@/lib/analyze/state";
import { loadQuestions, validateCompleteness } from "@/lib/analyze/transform";
import { AutoSaveManager, loadFromLocal } from "@/lib/analyze/autosave";

export default function TestQuestionsPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    index,
    answers,
    setAnswer,
    next,
    prev,
    setDraftId,
    markSaved,
    reset,
    getProgress,
    getAnsweredCount,
    getEstimatedTimeLeft,
  } = useAnalyzeStore();

  const [questions] = useState(() => loadQuestions());
  const [autoSaveManager] = useState(
    () =>
      new AutoSaveManager(
        (draftId) => {
          setDraftId(draftId);
          markSaved();
        },
        (error) => console.error("Auto-save error:", error)
      )
  );

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAnswers = loadFromLocal();
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      const confirmed = confirm(
        "이전에 진행하던 검사가 있습니다. 이어서 진행하시겠습니까?"
      );
      if (confirmed) {
        // Restore answers
        Object.entries(savedAnswers).forEach(([id, value]) => {
          setAnswer(id, value);
        });
      } else {
        reset();
      }
    }
  }, []);

  // Auto-save on answer change
  useEffect(() => {
    const answeredCount = getAnsweredCount();
    if (answeredCount > 0) {
      autoSaveManager.save(answers, answeredCount);
    }
  }, [answers, autoSaveManager, getAnsweredCount]);

  const currentQuestion = questions[index];
  const answeredCount = getAnsweredCount();
  const estimatedTimeLeft = getEstimatedTimeLeft();

  // Handle answer change
  const handleAnswer = (value: number) => {
    setAnswer(currentQuestion.id, value);
    // 자동 넘어가기 제거 - 사용자가 "다음" 버튼 클릭하도록 변경
  };

  // Handle complete
  const handleComplete = () => {
    const validation = validateCompleteness(answers);

    if (!validation.isValid) {
      alert(`모든 문항에 답변해주세요. (누락: ${validation.missing.length}개)`);
      return;
    }

    // Save answers to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("test_answers", JSON.stringify(answers));
    }

    // Move to profile page
    router.push("/test/profile");
  };

  if (status === "loading") {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto mb-4"></div>
            <p className="text-white/60">로딩 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!currentQuestion) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60">질문을 불러올 수 없습니다.</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen flex flex-col px-4 py-8">
        {/* Progress Bar */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <UnifiedProgress
            current={index + 1}
            total={questions.length}
            answered={answeredCount}
            estimatedTimeLeft={estimatedTimeLeft}
          />
        </div>

        {/* Question */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <UnifiedQuestion
              key={currentQuestion.id}
              questionId={currentQuestion.id}
              text={currentQuestion.text}
              value={answers[currentQuestion.id]}
              scale={currentQuestion.scale}
              onChange={handleAnswer}
              onNext={index < questions.length - 1 ? next : undefined}
              onPrev={prev}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="flex justify-between items-center">
            <button
              onClick={prev}
              disabled={index === 0}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>

            <div className="text-sm text-white/50">
              {index + 1} / {questions.length}
            </div>

            {index === questions.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!answers[currentQuestion.id]}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                완료 →
              </button>
            ) : (
              <button
                onClick={next}
                disabled={!answers[currentQuestion.id]}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음 →
              </button>
            )}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-center text-xs text-white/40">
            💡 키보드 단축키: 1~7 (답변), ← → (이전/다음)
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
