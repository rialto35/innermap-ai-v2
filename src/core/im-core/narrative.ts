/**
 * Narrative Generation (v1 stub)
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';

export function buildNarrative(inner9: InnerNine) {
  const strongest = Object.entries(inner9).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];
  const summary = `당신의 중심 에너지는 ${translate(strongest)}입니다. 이 힘을 바탕으로 오늘의 선택을 설계해보세요.`;
  return { summary };
}

function translate(key: string) {
  const map: Record<string, string> = {
    creation: '창조성',
    will: '의지력',
    sensitivity: '감수성',
    harmony: '공감력',
    expression: '표현력',
    insight: '통찰력',
    resilience: '회복력',
    balance: '균형감',
    growth: '성장력',
  };
  return map[key] ?? key;
}

