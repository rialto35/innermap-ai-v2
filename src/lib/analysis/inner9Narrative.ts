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

import { INNER9_DESCRIPTIONS, type Inner9Key } from '../../constants/inner9';

// 한글 라벨 매핑 (상수에서 가져오기)
const dimensionLabels: Record<string, string> = {
  creation: INNER9_DESCRIPTIONS.creation.label,
  will: INNER9_DESCRIPTIONS.will.label,
  sensitivity: INNER9_DESCRIPTIONS.sensitivity.label,
  harmony: INNER9_DESCRIPTIONS.harmony.label,
  expression: INNER9_DESCRIPTIONS.expression.label,
  insight: INNER9_DESCRIPTIONS.insight.label,
  resilience: INNER9_DESCRIPTIONS.resilience.label,
  balance: INNER9_DESCRIPTIONS.balance.label,
  growth: INNER9_DESCRIPTIONS.growth.label
};

/**
 * Rule-based 1st level summary with threshold-based labeling
 */
export function summarize(scores: Record<string, number>) {
  const entries = Object.entries(scores);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);
  const low3 = sorted.slice(-3);
  const avg = Math.round(entries.reduce((a, [, v]) => a + v, 0) / entries.length);

  // 임계치 기반 레이블
  const label = (v: number) => 
    v >= 75 ? "매우 높음" : 
    v >= 60 ? "높음" : 
    v >= 40 ? "보통" : 
    v >= 25 ? "낮음" : "매우 낮음";

  return {
    headline: `평균 ${avg}점, 강점은 ${top3.map(([k]) => INNER9_DESCRIPTIONS[k as keyof typeof INNER9_DESCRIPTIONS].label).join("·")}, 성장영역은 ${low3.map(([k]) => INNER9_DESCRIPTIONS[k as keyof typeof INNER9_DESCRIPTIONS].label).join("·")}입니다.`,
    strengths: top3.map(([k, v]) => ({ key: k, score: Math.floor(v), label: label(v) })),
    growth: low3.map(([k, v]) => ({ key: k, score: Math.floor(v), label: label(v) })),
    average: avg
  };
}

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
 * Generate rich, personalized narrative with personality type and detailed story
 * Client-side version - returns basic narrative without AI story
 * Use generateRichNarrativeWithAI for server-side AI generation
 */
export function generateRichNarrative(scores: Record<string, number>, mbti?: string) {
  const entries = Object.entries(scores);
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3);
  const low3 = sorted.slice(-3);
  const avg = Math.round(entries.reduce((a, [, v]) => a + v, 0) / entries.length);

  const label = (v: number) => 
    v >= 75 ? "매우 높음" : 
    v >= 60 ? "높음" : 
    v >= 40 ? "보통" : 
    v >= 25 ? "낮음" : "매우 낮음";

  // 개인화된 스토리 생성
  const topDimension = top3[0];
  const lowDimension = low3[0];
  
  const personalityType = getPersonalityType(top3, low3);
  const storyElements = generateStoryElements(topDimension, lowDimension, avg);
  
  // Use rule-based story (AI story will be fetched separately via API)
  const detailedStory = generateDetailedStory(topDimension, lowDimension, avg, personalityType);
  
  return {
    headline: `평균 ${avg}점, 강점은 ${top3.map(([k]) => INNER9_DESCRIPTIONS[k as keyof typeof INNER9_DESCRIPTIONS].label).join("·")}, 성장영역은 ${low3.map(([k]) => INNER9_DESCRIPTIONS[k as keyof typeof INNER9_DESCRIPTIONS].label).join("·")}입니다.`,
    strengths: top3.map(([k, v]) => ({ key: k, score: Math.floor(v), label: label(v) })),
    growth: low3.map(([k, v]) => ({ key: k, score: Math.floor(v), label: label(v) })),
    average: avg,
    personalityType,
    storyElements,
    detailedStory,
    // Metadata for AI story generation
    _meta: {
      topDimension,
      lowDimension,
      mbti
    }
  };
}

function getPersonalityType(top3: [string, number][], low3: [string, number][]) {
  const topKeys = top3.map(([k]) => k);
  const lowKeys = low3.map(([k]) => k);
  
  if (topKeys.includes('insight') && topKeys.includes('expression')) {
    return 'visionary';
  } else if (topKeys.includes('will') && topKeys.includes('balance')) {
    return 'achiever';
  } else if (topKeys.includes('harmony') && topKeys.includes('sensitivity')) {
    return 'empath';
  } else if (topKeys.includes('creation') && topKeys.includes('growth')) {
    return 'innovator';
  } else {
    return 'balanced';
  }
}

function generateStoryElements(topDimension: [string, number], lowDimension: [string, number], avg: number) {
  const topKey = topDimension[0];
  const topScore = topDimension[1];
  const lowKey = lowDimension[0];
  const lowScore = lowDimension[1];
  
  return {
    dominantTrait: {
      key: topKey,
      score: topScore,
      description: INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.oneLine || '',
      impact: getTraitImpact(topKey, topScore)
    },
    growthArea: {
      key: lowKey,
      score: lowScore,
      description: INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.oneLine || '',
      potential: getGrowthPotential(lowKey, lowScore)
    },
    overallBalance: avg >= 60 ? 'high' : avg >= 40 ? 'moderate' : 'developing'
  };
}

function getTraitImpact(trait: string, score: number) {
  const impacts: Record<string, Record<string, string>> = {
    creation: {
      high: "당신은 새로운 아이디어와 혁신적인 접근으로 팀에 활력을 불어넣는 창조적 리더입니다.",
      medium: "창의적 사고가 뛰어나 아이디어를 현실로 구현하는 능력이 있습니다.",
      low: "안정적인 환경에서 꾸준히 창의성을 발휘합니다."
    },
    will: {
      high: "목표를 향한 강인한 의지력으로 어떤 어려움도 극복하는 완성형 인재입니다.",
      medium: "계획을 세우고 차근차근 실행하는 체계적인 접근을 합니다.",
      low: "유연한 마음가짐으로 상황에 맞게 조정하는 능력이 있습니다."
    },
    sensitivity: {
      high: "타인의 감정을 깊이 이해하고 공감하는 섬세한 감성의 소유자입니다.",
      medium: "상황에 맞는 적절한 감정 표현과 조절 능력을 보입니다.",
      low: "논리적이고 객관적인 판단으로 안정적인 관계를 유지합니다."
    }
  };
  
  const level = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
  return impacts[trait]?.[level] || "이 영역에서 독특한 강점을 보입니다.";
}

function getGrowthPotential(trait: string, score: number) {
  const potentials: Record<string, string> = {
    creation: "새로운 경험과 도전을 통해 창의적 영감을 키워보세요.",
    will: "작은 목표부터 시작해 성취감을 쌓아가며 의지력을 강화하세요.",
    sensitivity: "감정을 표현하고 공유하는 연습을 통해 감수성을 발달시키세요.",
    harmony: "갈등 상황에서의 소통 기술을 연습해 조화로운 관계를 만들어가세요.",
    expression: "생각을 명확히 전달하는 연습으로 표현력을 향상시키세요.",
    insight: "다양한 관점에서 사고하는 훈련으로 통찰력을 기르세요.",
    resilience: "스트레스 관리 기술을 익혀 회복력을 강화하세요.",
    balance: "생활의 균형을 위한 우선순위 설정 연습을 해보세요.",
    growth: "지속적인 학습과 피드백 수용으로 성장 마인드를 키우세요."
  };
  
  return potentials[trait] || "이 영역의 발전을 통해 더욱 균형 잡힌 인재가 될 수 있습니다.";
}

export function generateDetailedStory(topDimension: [string, number], lowDimension: [string, number], avg: number, personalityType: string) {
  const topKey = topDimension[0];
  const topScore = topDimension[1];
  const lowKey = lowDimension[0];
  const lowScore = lowDimension[1];
  
  const stories: Record<string, string> = {
    visionary: `당신은 ${INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역에서 ${topScore}점의 뛰어난 능력을 보이며, 특히 통찰력과 표현력이 조화를 이룬 비전형 인재입니다. ${INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역(${lowScore}점)에서는 더 큰 성장 가능성이 기다리고 있어, 이 부분을 발전시킨다면 더욱 완성도 높은 리더가 될 수 있습니다.`,
    achiever: `체계적이고 목표 지향적인 성향이 강한 성취형 인재로, ${INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label}에서 ${topScore}점의 탁월한 성과를 보입니다. ${INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역(${lowScore}점)의 발전을 통해 더욱 균형 잡힌 성장을 이룰 수 있습니다.`,
    empath: `타인에 대한 깊은 이해와 공감 능력이 뛰어난 감성형 인재입니다. ${INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역에서 ${topScore}점의 섬세한 감성을 보이며, ${INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역(${lowScore}점)의 발전으로 더욱 완성도 높은 인간관계를 구축할 수 있습니다.`,
    innovator: `창의적 사고와 지속적 성장에 대한 열정이 뛰어난 혁신형 인재입니다. ${INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label}에서 ${topScore}점의 독창성을 보이며, ${INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역(${lowScore}점)의 발전을 통해 더욱 완성도 높은 혁신을 이룰 수 있습니다.`,
    balanced: `전반적으로 균형 잡힌 성향을 보이는 조화형 인재입니다. ${INNER9_DESCRIPTIONS[topKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역에서 ${topScore}점의 강점을 보이며, ${INNER9_DESCRIPTIONS[lowKey as keyof typeof INNER9_DESCRIPTIONS]?.label} 영역(${lowScore}점)의 발전을 통해 더욱 완성도 높은 인재가 될 수 있습니다.`
  };
  
  return stories[personalityType] || stories.balanced;
}
