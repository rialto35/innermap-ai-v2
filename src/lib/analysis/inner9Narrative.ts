/**
 * Inner9 Narrative Generator
 * Creates personalized stories based on Inner9 scores
 */

export interface Inner9Narrative {
  summary: string;
  highlight: [string, number];
  weak: [string, number];
  average: number;
  strengths: Array<{ dimension: string; score: number }>;
  growthAreas: Array<{ dimension: string; score: number }>;
}

// 한글 라벨 매핑
const dimensionLabels: Record<string, string> = {
  creation: '창조성',
  will: '의지력',
  sensitivity: '감수성',
  harmony: '조화',
  expression: '표현력',
  insight: '통찰력',
  resilience: '회복력',
  balance: '균형',
  growth: '성장'
};

export function generateInner9Narrative(scores: Record<string, number>): Inner9Narrative {
  const entries = Object.entries(scores);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const low = sorted.at(-1) || sorted[0]; // fallback to first if empty
  const avg = entries.reduce((a, [, v]) => a + v, 0) / entries.length;

  // 상위 3개 강점
  const strengths = sorted.slice(0, 3).map(([key, value]) => ({
    dimension: dimensionLabels[key] || key,
    score: value
  }));

  // 하위 3개 성장 영역
  const growthAreas = sorted.slice(-3).reverse().map(([key, value]) => ({
    dimension: dimensionLabels[key] || key,
    score: value
  }));

  const topLabel = dimensionLabels[top[0]] || top[0];
  const lowLabel = dimensionLabels[low[0]] || low[0];

  return {
    summary: `당신은 ${topLabel}(${top[1]}점) 영역에서 강점을 보이며, ${lowLabel}(${low[1]}점) 영역에서는 성장 여지가 있습니다. 평균 ${avg.toFixed(1)}점 수준으로 균형 잡힌 패턴을 보여줍니다.`,
    highlight: top,
    weak: low,
    average: avg,
    strengths,
    growthAreas
  };
}

/**
 * Generate detailed story based on score patterns
 */
export function generateDetailedStory(scores: Record<string, number>): string {
  const narrative = generateInner9Narrative(scores);
  const { highlight, weak, average } = narrative;
  
  const highlightLabel = dimensionLabels[highlight[0]] || highlight[0];
  const weakLabel = dimensionLabels[weak[0]] || weak[0];
  
  let story = `당신의 내면 지도에서 가장 두드러진 특징은 ${highlightLabel}입니다. `;
  
  if (highlight[1] >= 80) {
    story += `이 영역에서 매우 높은 수준(${highlight[1]}점)을 보여주며, `;
  } else if (highlight[1] >= 60) {
    story += `이 영역에서 상당한 강점(${highlight[1]}점)을 보여주며, `;
  }
  
  story += `반면 ${weakLabel} 영역에서는 발전의 여지(${weak[1]}점)가 있습니다. `;
  
  if (average >= 70) {
    story += `전반적으로 높은 수준의 균형을 유지하고 있습니다.`;
  } else if (average >= 50) {
    story += `전반적으로 안정적인 패턴을 보여주고 있습니다.`;
  } else {
    story += `전반적으로 성장의 기회가 많은 상태입니다.`;
  }
  
  return story;
}
