"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuestionFlow } from "@/hooks/useQuestionFlow";
import QuestionFrame from "@/components/analysis/QuestionFrame";
import ProgressBar from "@/components/analysis/ProgressBar";
import Likert7 from "@/components/analysis/controls/Likert7";
import BottomNav from "@/components/analysis/BottomNav";
import { MODE_COPY } from "@/lib/analysis/copy";

const valid = new Set(["quick", "deep"]);

export default function StartPage({ params }: { params: Promise<{ mode: string }> }) {
  const [mode, setMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Always call hooks at the top level
  const quickFlow = useQuestionFlow("quick");
  const deepFlow = useQuestionFlow("deep");

  useEffect(() => {
    params.then(({ mode: resolvedMode }) => {
      if (!valid.has(resolvedMode)) {
        setIsLoading(false);
        return;
      }
      setMode(resolvedMode);
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mode || !valid.has(mode)) {
    return notFound();
  }

  const copy = MODE_COPY[mode as "quick" | "deep"];
  const flow = mode === "quick" ? quickFlow : deepFlow;

  if (!flow.currentItem) {
    return (
      <QuestionFrame
        title={copy.title}
        subtitle="문항을 불러오는 중입니다..."
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">
            잠시만 기다려 주세요...
          </p>
        </div>
      </QuestionFrame>
    );
  }

  const currentAnswer = flow.state.answers[flow.currentItem.id]?.value as number | undefined;

  return (
    <QuestionFrame
      title={copy.title}
      subtitle={copy.subtitle}
      meta={copy.meta}
      footer={
        <BottomNav
          canPrev={flow.canPrev}
          canNext={flow.canNext}
          canSubmit={flow.canSubmit}
          onPrev={flow.prev}
          onNext={flow.next}
          onSubmit={flow.submit}
        />
      }
    >
      <ProgressBar 
        percent={flow.percent}
        label={`문항 ${flow.state.index + 1} / ${flow.state.total}`}
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {flow.currentItem.stem}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            문항 데이터는 추후 연결됩니다.
          </p>
        </div>

        <Likert7
          value={currentAnswer}
          onChange={flow.answer}
          labels={flow.currentItem.choices}
        />
      </div>
    </QuestionFrame>
  );
}