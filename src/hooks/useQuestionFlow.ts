"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FlowState, Mode, Answer } from "@/lib/questions/schema";
import { makeMockItems, getTotalHint } from "@/lib/questions/sample";

export function useQuestionFlow(mode: Mode) {
  const router = useRouter();
  const items = makeMockItems(mode);
  const totalHint = getTotalHint(mode);

  const [state, setState] = useState<FlowState>({
    mode,
    index: 0,
    total: totalHint,
    answers: {},
    phase: "running"
  });

  const currentItem = items[state.index];
  const answeredCount = Object.keys(state.answers).length;
  const percent = Math.round((answeredCount / state.total) * 100);
  
  const canPrev = state.index > 0;
  const canNext = state.index < items.length - 1 && !!state.answers[currentItem?.id];
  const canSubmit = state.index === items.length - 1 && !!state.answers[currentItem?.id];

  const answer = useCallback((value: number | string) => {
    if (!currentItem) return;
    
    const newAnswer: Answer = {
      itemId: currentItem.id,
      value,
      ts: Date.now()
    };

    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentItem.id]: newAnswer
      }
    }));
  }, [currentItem]);

  const next = useCallback(() => {
    if (!canNext) return;
    
    setState(prev => ({
      ...prev,
      index: prev.index + 1
    }));
  }, [canNext]);

  const prev = useCallback(() => {
    if (!canPrev) return;
    
    setState(prev => ({
      ...prev,
      index: prev.index - 1
    }));
  }, [canPrev]);

  const submit = useCallback(() => {
    if (!canSubmit) return;
    
    setState(prev => ({
      ...prev,
      phase: "done"
    }));
    
    // Navigate to success page
    router.push(`/test/${mode}/start/success`);
  }, [canSubmit, mode, router]);

  return {
    state,
    currentItem,
    answeredCount,
    percent,
    canPrev,
    canNext,
    canSubmit,
    answer,
    next,
    prev,
    submit
  };
}
