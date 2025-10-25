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
  };

  // Handle next with validation
  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      alert("답변을 선택해주세요.");
      return;
    }
    
    if (index < questions.length - 1) {
      next();
    }
  };

  // Handle complete
  const handleComplete = () => {
    const validation = validateCompleteness(answers);

    if (!validation.isValid) {
      // 미답변 문제 목록 표시
      const unansweredList = validation.missing
        .map((id) => {
          const q = questions.find((q) => q.id === id);
          return q ? `• ${questions.indexOf(q) + 1}번 문제` : null;
        })
        .filter(Boolean)
        .join("\n");

      alert(
        `모든 문항에 답변해주세요.\n\n미답변 문항 (${validation.missing.length}개):\n${unansweredList}\n\n"미답변 문항 보기" 버튼을 클릭하여 확인하세요.`
      );
      return;
    }

    // Save answers to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("test_answers", JSON.stringify(answers));
    }

    // Move to profile page
    router.push("/test/profile");
  };

  // Jump to first unanswered question
  const jumpToUnanswered = () => {
    const validation = validateCompleteness(answers);
    if (!validation.isValid && validation.missing.length > 0) {
      const firstUnansweredId = validation.missing[0];
      const firstUnansweredIndex = questions.findIndex(
        (q) => q.id === firstUnansweredId
      );
      if (firstUnansweredIndex >= 0) {
        // Jump to that question
        const diff = firstUnansweredIndex - index;
        if (diff > 0) {
          for (let i = 0; i < diff; i++) next();
        } else if (diff < 0) {
          for (let i = 0; i < Math.abs(diff); i++) prev();
        }
      }
    }
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

  const validation = validateCompleteness(answers);
  const isCurrentAnswered = !!answers[currentQuestion.id];

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
          
          {/* Unanswered count */}
          {!validation.isValid && (
            <div className="mt-4 text-center">
              <button
                onClick={jumpToUnanswered}
                className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm hover:bg-yellow-500/30 transition"
              >
                ⚠️ 미답변 문항 {validation.missing.length}개 - 클릭하여 이동
              </button>
            </div>
          )}
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
              onNext={index < questions.length - 1 ? handleNext : undefined}
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
              {!isCurrentAnswered && (
                <span className="ml-2 text-yellow-400">• 미답변</span>
              )}
            </div>

            {index === questions.length - 1 ? (
              <button
                onClick={handleComplete}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition ${
                  validation.isValid
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-violet-500/20 hover:scale-[1.02]"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
                disabled={!validation.isValid}
              >
                {validation.isValid ? "완료 →" : `미답변 ${validation.missing.length}개`}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition ${
                  isCurrentAnswered
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-violet-500/20 hover:scale-[1.02]"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
                disabled={!isCurrentAnswered}
              >
                다음 →
              </button>
            )}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-center text-xs text-white/40">
            💡 키보드 단축키: 1~{currentQuestion.scale} (답변), ← → (이전/다음)
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
