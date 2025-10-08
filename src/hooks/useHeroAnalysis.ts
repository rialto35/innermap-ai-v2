/**
 * useHeroAnalysis Hook
 * 
 * 영웅 분석 API를 호출하는 React Hook
 */

import { useState } from 'react';
import type { HeroAnalysisInput, HeroAnalysisResult } from '@/lib/prompts/systemPrompt';

interface UseHeroAnalysisReturn {
  analyze: (data: HeroAnalysisInput) => Promise<void>;
  result: HeroAnalysisResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useHeroAnalysis(): UseHeroAnalysisReturn {
  const [result, setResult] = useState<HeroAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (data: HeroAnalysisInput) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/hero-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || '분석 중 오류가 발생했습니다.');
      }

      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error('분석 결과가 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('Hero Analysis 에러:', err);
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return {
    analyze,
    result,
    loading,
    error,
    reset,
  };
}

/**
 * 분석 상태 타입
 */
export type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 분석 상태를 반환하는 헬퍼 함수
 */
export function getAnalysisState(
  loading: boolean,
  result: HeroAnalysisResult | null,
  error: string | null
): AnalysisState {
  if (loading) return 'loading';
  if (error) return 'error';
  if (result) return 'success';
  return 'idle';
}

