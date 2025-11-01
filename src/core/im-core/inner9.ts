/**
 * Inner9 내면 나침반 분석 엔진
 * Big5, MBTI, RETI를 융합하여 9축 내면 지도 생성
 */

import { Big5Scores } from './big5';

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
  // New balance formula: combine energy level and evenness (less skew)
  const wE = Number(process.env.IM_INNER9_BALANCE_ENERGY_WEIGHT || '0.6');
  const wV = Number(process.env.IM_INNER9_BALANCE_EVEN_WEIGHT || '0.4');
  const denom = Number(process.env.IM_INNER9_BALANCE_EVEN_DENOM || '150');
  const jBonus = Number(process.env.IM_INNER9_BALANCE_MBTI_J_BONUS || '3');

  const energy = (
    (big5.o) +
    (big5.c) +
    (big5.e) +
    (big5.a) +
    (100 - (big5 as any).n)
  ) / 5; // 0~100

  const evenDiff =
    Math.abs(big5.o - big5.c) +
    Math.abs(big5.e - big5.a) +
    Math.abs((100 - (big5 as any).n) - 50);

  const evenScore = 1 - Math.min(1, evenDiff / (isNaN(denom) ? 150 : denom)); // 0~1
  let balanceRaw = (wE * (energy / 100)) + (wV * evenScore); // 0~1
  if (safeMbti.includes('J')) balanceRaw += (jBonus / 100);
  const balanced = clamp(balanceRaw * 100);

  if (process.env.IM_ANALYSIS_VERBOSE_LOG === 'true') {
    console.info('[inner9] balance debug', { wE, wV, denom: isNaN(denom) ? 150 : denom, jBonus, energy, evenDiff, evenScore, balanceRaw, balanced });
  }

  // Inner9 axes aligned with UI expectations (creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth)
  const inner9Scores: { [key: string]: number } = {
    creation: safe('creation', big5.o * weights.big5 + (safeMbti.includes('N') ? 10 : 0) * weights.mbti),
    will: safe('will', big5.c * weights.big5 + (safeMbti.includes('J') ? 10 : 0) * weights.mbti + (safeReti < 5 ? 5 : 0) * weights.reti),
    sensitivity: safe('sensitivity', (100 - big5.n) * 0.4 * weights.big5 + big5.a * 0.6 * weights.big5 + (safeMbti.includes('F') ? 10 : 0) * weights.mbti),
    harmony: safe('harmony', big5.a * weights.big5 + (safeMbti.includes('F') ? 15 : 0) * weights.mbti),
    expression: safe('expression', big5.e * weights.big5 + (safeMbti.includes('E') ? 10 : 0) * weights.mbti + (safeReti > 5 ? 5 : 0) * weights.reti),
    insight: safe('insight', big5.o * 0.6 * weights.big5 + big5.c * 0.4 * weights.big5 + (safeMbti.includes('N') ? 15 : 0) * weights.mbti + (safeMbti.includes('T') ? 5 : 0) * weights.mbti),
    resilience: safe('resilience', (100 - big5.n) * weights.big5 + (safeMbti.includes('P') ? 5 : 0) * weights.mbti),
    balance: balanced,
    growth: safe('growth', big5.o * 0.5 * weights.big5 + (100 - big5.n) * 0.3 * weights.big5 + (safeMbti.includes('P') ? 10 : 0) * weights.mbti + (safeReti > 5 ? 5 : 0) * weights.reti),
  };

  return Object.entries(inner9Scores).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize for display
    value: clamp(value), // 0~100 클리핑 + NaN 가드
  }));
}