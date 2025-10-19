/**
 * Narrative Generation - Rich Personalized Storytelling
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';

export function buildNarrative(inner9: InnerNine) {
  const dimensions = Object.entries(inner9)
    .map(([key, value]) => ({ key, value: value as number }))
    .sort((a, b) => b.value - a.value);

  const top3 = dimensions.slice(0, 3);
  const bottom3 = dimensions.slice(-3).reverse();
  
  const story = generatePersonalStory(top3, bottom3, inner9);
  
  return { 
    summary: story,
    strengths: top3.map(d => ({ dimension: translate(d.key), score: d.value })),
    growthAreas: bottom3.map(d => ({ dimension: translate(d.key), score: d.value }))
  };
}

function generatePersonalStory(top3: Array<{key: string, value: number}>, bottom3: Array<{key: string, value: number}>, inner9: InnerNine) {
  const primary = top3[0];
  const secondary = top3[1];
  const tertiary = top3[2];
  
  // 개인화된 스토리 생성 - 실제 점수 패턴 기반
  const storyParts = [];
  
  // 1. 고유한 에너지 조합 분석
  storyParts.push(generateUniqueEnergyCombination(primary, secondary, tertiary, inner9));
  
  // 2. 점수 분포 패턴 분석
  storyParts.push(generateScorePatternStory(inner9));
  
  // 3. 개인화된 성장 경로
  storyParts.push(generatePersonalizedGrowthPath(bottom3, inner9));
  
  // 4. 실제 점수 기반 일상 적용
  storyParts.push(generateScoreBasedApplication(primary, secondary, inner9));
  
  return storyParts.join(' ');
}

// 실제 점수 패턴 기반 개인화된 스토리 생성 함수들

function generateUniqueEnergyCombination(primary: {key: string, value: number}, secondary: {key: string, value: number}, tertiary: {key: string, value: number}, inner9: InnerNine) {
  const primaryScore = primary.value;
  const secondaryScore = secondary.value;
  const gap = primaryScore - secondaryScore;
  
  // 점수 차이에 따른 개인화
  if (gap > 30) {
    return `당신은 ${translate(primary.key)}(${primaryScore}점)에서 압도적인 강점을 보이는 독특한 패턴을 가지고 있습니다. 이는 당신만의 특별한 에너지 서명입니다. ${translate(secondary.key)}(${secondaryScore}점)과의 큰 차이는 당신이 이 영역에서 진정한 전문가임을 보여줍니다.`;
  } else if (gap > 15) {
    return `당신의 ${translate(primary.key)}(${primaryScore}점)는 명확한 강점이지만, ${translate(secondary.key)}(${secondaryScore}점)와 균형 잡힌 조합을 이룹니다. 이 두 에너지가 만나는 지점에서 당신만의 독특한 접근 방식이 탄생합니다.`;
  } else {
    return `당신은 ${translate(primary.key)}(${primaryScore}점)와 ${translate(secondary.key)}(${secondaryScore}점)에서 비슷한 수준의 에너지를 보입니다. 이는 다면적이고 균형 잡힌 당신만의 특별한 조합입니다.`;
  }
}

function generateScorePatternStory(inner9: InnerNine) {
  const scores = Object.values(inner9) as number[];
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // 점수 분포 패턴 분석
  if (range > 60) {
    return `당신의 에너지 패턴은 매우 역동적입니다. 최고점(${max}점)과 최저점(${min}점)의 큰 차이는 당신이 특정 영역에서 뛰어난 재능을 발휘하는 동시에, 다른 영역에서는 성장의 여지가 있음을 의미합니다.`;
  } else if (range > 30) {
    return `당신의 에너지는 적당한 편차를 보이며, 이는 균형 잡힌 성장을 추구하는 건강한 패턴입니다. 평균 ${Math.round(avg)}점 수준에서 각 영역이 조화롭게 발전하고 있습니다.`;
  } else {
    return `당신의 에너지는 매우 균등하게 분포되어 있습니다. 이는 모든 영역에서 안정적인 기반을 가지고 있는 당신만의 특별한 장점입니다.`;
  }
}

function generatePersonalizedGrowthPath(bottom3: Array<{key: string, value: number}>, inner9: InnerNine) {
  const lowest = bottom3[0];
  const secondLowest = bottom3[1];
  const gap = secondLowest.value - lowest.value;
  
  if (gap > 20) {
    return `성장의 여정에서 ${translate(lowest.key)}(${lowest.value}점)에 집중적인 관심이 필요합니다. 이 영역은 당신의 전체적인 발전을 위한 핵심 열쇠가 될 것입니다. ${translate(secondLowest.key)}(${secondLowest.value}점)와의 큰 차이는 이 영역에 특별한 주의를 기울일 필요가 있음을 보여줍니다.`;
  } else {
    return `성장 영역인 ${translate(lowest.key)}(${lowest.value}점)와 ${translate(secondLowest.key)}(${secondLowest.value}점)는 비슷한 수준으로, 이 두 영역을 함께 발전시켜 나가면 시너지 효과를 얻을 수 있습니다.`;
  }
}

function generateScoreBasedApplication(primary: {key: string, value: number}, secondary: {key: string, value: number}, inner9: InnerNine) {
  const primaryScore = primary.value;
  const secondaryScore = secondary.value;
  
  // 점수에 따른 구체적인 적용법
  if (primaryScore > 80) {
    return `당신의 ${translate(primary.key)}(${primaryScore}점)는 전문가 수준입니다. 이 강점을 활용해 리더십 역할을 맡거나 멘토링을 해보세요. 동시에 ${translate(secondary.key)}(${secondaryScore}점)의 에너지로 균형을 잡아 더욱 풍부한 결과를 만들어내세요.`;
  } else if (primaryScore > 60) {
    return `당신의 ${translate(primary.key)}(${primaryScore}점)는 안정적인 강점입니다. 이 영역에서 더 많은 도전을 받아들이고, ${translate(secondary.key)}(${secondaryScore}점)와 조합해 새로운 가능성을 탐색해보세요.`;
  } else {
    return `당신의 ${translate(primary.key)}(${primaryScore}점)는 발전 가능성이 높은 영역입니다. 작은 성공부터 시작해 점진적으로 자신감을 쌓아가며, ${translate(secondary.key)}(${secondaryScore}점)의 에너지와 함께 성장해 나가세요.`;
  }
}


function translate(key: string) {
  const map: Record<string, string> = {
    creation: '창조성',
    will: '의지력',
    sensitivity: '감수성',
    harmony: '조화',
    expression: '표현력',
    insight: '통찰력',
    resilience: '회복력',
    balance: '균형감',
    growth: '성장력',
  };
  return map[key] ?? key;
}

