/**
 * Unified Analyze State Machine
 * 
 * Zustand store for managing unified question flow
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UnifiedState {
  // Progress
  index: number;
  totalQuestions: number;
  
  // Answers: { questionId: value (1-7) }
  answers: Record<string, number>;
  
  // Draft saving
  draftId?: string;
  lastSaved?: number;
  
  // Session tracking
  startedAt: number;
  completedAt?: number;
  
  // Actions
  setAnswer: (questionId: string, value: number) => void;
  next: () => void;
  prev: () => void;
  jump: (index: number) => void;
  setDraftId: (id: string) => void;
  markSaved: () => void;
  complete: () => void;
  reset: () => void;
  
  // Computed
  getProgress: () => number;
  getAnsweredCount: () => number;
  isComplete: () => boolean;
  getEstimatedTimeLeft: () => number; // in seconds
}

export const useAnalyzeStore = create<UnifiedState>()(
  persist(
    (set, get) => ({
      // Initial state
      index: 0,
      totalQuestions: 55,
      answers: {},
      startedAt: Date.now(),
      
      // Actions
      setAnswer: (questionId, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: value
          }
        }));
      },
      
      next: () => {
        set((state) => ({
          index: Math.min(state.index + 1, state.totalQuestions - 1)
        }));
      },
      
      prev: () => {
        set((state) => ({
          index: Math.max(state.index - 1, 0)
        }));
      },
      
      jump: (index) => {
        set({ index: Math.max(0, Math.min(index, get().totalQuestions - 1)) });
      },
      
      setDraftId: (id) => {
        set({ draftId: id });
      },
      
      markSaved: () => {
        set({ lastSaved: Date.now() });
      },
      
      complete: () => {
        set({ completedAt: Date.now() });
      },
      
      reset: () => {
        set({
          index: 0,
          answers: {},
          draftId: undefined,
          lastSaved: undefined,
          startedAt: Date.now(),
          completedAt: undefined
        });
      },
      
      // Computed
      getProgress: () => {
        const { index, totalQuestions } = get();
        return Math.round((index / totalQuestions) * 100);
      },
      
      getAnsweredCount: () => {
        return Object.keys(get().answers).length;
      },
      
      isComplete: () => {
        const { answers, totalQuestions } = get();
        return Object.keys(answers).length === totalQuestions;
      },
      
      getEstimatedTimeLeft: () => {
        const state = get();
        const elapsed = (Date.now() - state.startedAt) / 1000; // seconds
        const answeredCount = state.getAnsweredCount();
        
        if (answeredCount === 0) {
          return state.totalQuestions * 8; // Assume 8 sec/question
        }
        
        const avgTimePerQuestion = elapsed / answeredCount;
        const remaining = state.totalQuestions - answeredCount;
        return Math.round(remaining * avgTimePerQuestion);
      }
    }),
    {
      name: 'innermap-analyze-state',
      version: 1,
      // Only persist essential data
      partialize: (state) => ({
        index: state.index,
        answers: state.answers,
        draftId: state.draftId,
        startedAt: state.startedAt
      })
    }
  )
);

