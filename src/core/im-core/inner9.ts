/**
 * Inner9 내면 나침반 분석 엔진
 * Big5, MBTI, RETI를 융합하여 9축 내면 지도 생성
 */

import { Big5Scores } from './big5';
import { RawResponse } from './types';

export type Inner9Axis = { label: string; value: number };

export type Inner9Config = {
  weights?: { big5: number; mbti: number; reti: number };
};

/**
 * Big5, MBTI, RETI를 융합하여 Inner9 9축 계산
 */
export function toInner9(data: {
  big5: Big5Scores;
  mbti?: string;
  reti?: number;
  weights?: { big5: number; mbti: number; reti: number };
}): Inner9Axis[] {
  const { big5, mbti = '', reti = 5, weights = { big5: 1, mbti: 0.5, reti: 0.5 } } = data;

  // ✅ 방어 코드: mbti와 reti가 undefined일 경우 기본값 사용
  const safeMbti = mbti || '';
  const safeReti = reti ?? 5;

  // helpers
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const safe = (label: string, v: number) => {
    if (!Number.isFinite(v)) {
      if (process.env.IM_ANALYSIS_VERBOSE_LOG === 'true') {
        console.warn('[inner9] non-finite value', { label, v });
      }
      return 50;
    }
    return v;
  };

  // Simplified mapping for Inner9 axes based on Big5, MBTI, and RETI
  // In a real system, this would be a more complex weighted matrix multiplication
  const div = Number(process.env.IM_INNER9_BALANCE_DIV || '3');
  const baseBalance = 100 - Math.abs((big5.o + big5.e) - (big5.c + big5.a)) / (isNaN(div) ? 3 : div);
  const arr = [big5.o, big5.c, big5.e, big5.a];
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const variance = arr.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / Math.max(1, arr.length - 1);
  const penalty = 8 * (variance / 2500);
  const balanced = clamp(safe('balance', baseBalance - penalty) + (safeMbti.includes('J') ? 5 : 0) * weights.mbti);

  if (process.env.IM_ANALYSIS_VERBOSE_LOG === 'true') {
    console.info('[inner9] balance debug', { div: isNaN(div) ? 3 : div, baseBalance, variance, penalty, balanced });
  }

  const inner9Scores: { [key: string]: number } = {
    creation: safe('creation', big5.o * weights.big5 + (safeMbti.includes('N') ? 10 : 0) * weights.mbti),
    balance: balanced,
    intuition: safe('intuition', big5.o * weights.big5 + (safeMbti.includes('N') ? 15 : 0) * weights.mbti),
    analysis: safe('analysis', big5.c * weights.big5 + (safeMbti.includes('T') ? 10 : 0) * weights.mbti),
    harmony: safe('harmony', big5.a * weights.big5 + (safeMbti.includes('F') ? 15 : 0) * weights.mbti),
    drive: safe('drive', big5.e * weights.big5 + (safeReti > 5 ? 10 : 0) * weights.reti),
    reflection: safe('reflection', (100 - big5.n) * weights.big5 + (safeMbti.includes('I') ? 5 : 0) * weights.mbti),
    empathy: safe('empathy', big5.a * weights.big5 + (safeMbti.includes('F') ? 10 : 0) * weights.mbti),
    discipline: safe('discipline', big5.c * weights.big5 + (safeReti < 5 ? 10 : 0) * weights.reti),
  };

  return Object.entries(inner9Scores).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize for display
    value: clamp(value), // 0~100 클리핑 + NaN 가드
  }));
}