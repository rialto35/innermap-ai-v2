"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/layout/PageContainer";
import { useAnalyzeStore } from "@/lib/analyze/state";
import { loadQuestions, validateCompleteness } from "@/lib/analyze/transform";
import { AutoSaveManager, loadFromLocal } from "@/lib/analyze/autosave";

const STEP_SIZE = Number(process.env.NEXT_PUBLIC_STEP_SIZE || 6);

export default function TestQuestionsPage() {
  const router = useRouter();
  const { status } = useSession();

  const {
    answers,
    setAnswer,
    setDraftId,
    markSaved,
    reset,
    getAnsweredCount,
  } = useAnalyzeStore();

  const [questions] = useState(() => loadQuestions());
  const [step, setStep] = useState(0);
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

  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({});
  const totalSteps = Math.ceil(questions.length / STEP_SIZE);
  const answeredCount = getAnsweredCount();

  // Current batch
  const batch = useMemo(() => {
    const start = step * STEP_SIZE;
    return questions.slice(start, start + STEP_SIZE);
  }, [questions, step]);

  // Estimated time left (1분 per step)
  const estimatedMinutes = Math.max(1, totalSteps - step);

  // Auth guard (익명 검사 플래그 확인)
  useEffect(() => {
    const ANON_ENABLED = process.env.NEXT_PUBLIC_IM_ANON_TEST_ENABLED === "true";
    
    if (status === "unauthenticated" && !ANON_ENABLED) {
      console.log("🚫 [Client Guard] Anonymous test blocked (flag OFF)");
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
    if (answeredCount > 0) {
      autoSaveManager.save(answers, answeredCount);
    }
  }, [answers, autoSaveManager, answeredCount]);

  // Auto-focus on batch entry
  useEffect(() => {
    const target = batch.find((q) => answers[q.id] == null);
    if (target) {
      setTimeout(() => {
        nodesRef.current[target.id]?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 100);
    }
  }, [batch]);

  // Handle answer with auto-focus
  const handleAnswer = (id: string, value: number) => {
    setAnswer(id, value);

    // Auto-focus to next unanswered question
    setTimeout(() => {
      const nextTarget = batch.find((q) => {
        if (q.id === id) return false; // Skip current
        return answers[q.id] == null;
      });
      if (nextTarget) {
        nodesRef.current[nextTarget.id]?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }, 200);
  };

  // Validate current batch
  const validateBatch = () => {
    return batch.filter((q) => answers[q.id] == null);
  };

  // Handle next step
  const handleNext = () => {
    const missing = validateBatch();
    if (missing.length > 0) {
      alert(`이 페이지의 모든 문항에 답변해주세요. (미답변: ${missing.length}개)`);
      // Focus on first missing
      nodesRef.current[missing[0].id]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return;
    }

    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleComplete();
    }
  };

  // Handle previous step
  const handlePrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle complete
  const handleComplete = () => {
    const validation = validateCompleteness(answers);

    if (!validation.isValid) {
      alert(
        `모든 문항에 답변해주세요.\n\n미답변 문항: ${validation.missing.length}개\n\n이전 페이지로 돌아가서 확인해주세요.`
      );
      return;
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("test_answers", JSON.stringify(answers));
    }

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

  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const batchAnswered = batch.filter((q) => answers[q.id] != null).length;

  return (
    <PageContainer>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>
                {step + 1} / {totalSteps} 단계
              </span>
              <span>약 {estimatedMinutes}분 남음</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />
            </div>
            <div className="text-center text-sm text-white/60">
              전체 {answeredCount} / {questions.length} 답변 완료
            </div>
          </div>

          {/* Questions Batch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 mb-8"
            >
              {batch.map((question, idx) => {
                const isAnswered = answers[question.id] != null;
                const currentValue = answers[question.id];

                return (
                  <div
                    key={question.id}
                    ref={(el) => {
                      nodesRef.current[question.id] = el;
                    }}
                    className={`rounded-2xl border p-6 transition-all ${
                      isAnswered
                        ? "border-violet-500/30 bg-violet-500/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {/* Question Number & Text */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            isAnswered
                              ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {step * STEP_SIZE + idx + 1}
                        </span>
                        {!isAnswered && (
                          <span className="text-xs text-yellow-400">• 미답변</span>
                        )}
                      </div>
                      <p className="text-lg text-white leading-relaxed">
                        {question.text}
                      </p>
                    </div>

                    {/* Slider */}
                    <div className="space-y-4">
                      <input
                        type="range"
                        min={1}
                        max={question.scale}
                        value={currentValue || Math.ceil(question.scale / 2)}
                        onChange={(e) =>
                          handleAnswer(question.id, parseInt(e.target.value))
                        }
                        className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:from-violet-500
                          [&::-webkit-slider-thumb]:to-cyan-500
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:shadow-violet-500/50"
                        style={{
                          background: currentValue
                            ? `linear-gradient(to right, 
                                rgb(139, 92, 246) 0%, 
                                rgb(34, 211, 238) ${
                                  ((currentValue - 1) / (question.scale - 1)) * 100
                                }%, 
                                rgba(255, 255, 255, 0.1) ${
                                  ((currentValue - 1) / (question.scale - 1)) * 100
                                }%, 
                                rgba(255, 255, 255, 0.1) 100%)`
                            : undefined,
                        }}
                      />

                      {/* Scale buttons */}
                      <div className="flex justify-between">
                        {Array.from({ length: question.scale }, (_, i) => i + 1).map(
                          (num) => (
                            <button
                              key={num}
                              onClick={() => handleAnswer(question.id, num)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                                currentValue === num
                                  ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white scale-110 shadow-lg shadow-violet-500/50"
                                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {num}
                            </button>
                          )
                        )}
                      </div>

                      {/* Labels */}
                      <div className="flex justify-between text-xs text-white/50">
                        <span>전혀 아니다</span>
                        <span>보통이다</span>
                        <span>매우 그렇다</span>
                      </div>

                      {/* Current value */}
                      {currentValue && (
                        <div className="text-center">
                          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-white text-sm">
                            선택: <strong>{currentValue}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>

            <div className="text-sm text-white/60">
              이 페이지: {batchAnswered} / {batch.length} 답변
            </div>

            <button
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition ${
                batchAnswered === batch.length
                  ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-violet-500/20 hover:scale-[1.02]"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              {step === totalSteps - 1 ? "검사 완료 →" : "다음 →"}
            </button>
          </div>

          {/* Hint */}
          <div className="mt-6 text-center text-xs text-white/40">
            💡 슬라이더를 움직이거나 숫자 버튼을 클릭하여 답변하세요
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
