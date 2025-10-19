/**
 * Inner9 Dimensions - Detailed Descriptions and Tips
 * For tooltips, help text, and narrative generation
 */

export const INNER9_DESCRIPTIONS = {
  creation: {
    label: "창조",
    oneLine: "새 아이디어와 관점을 만들어내는 능력(호기심·상상·실험).",
    high: "아이디어 풍부, 변화 친화.",
    low: "익숙한 방식 선호, 리스크 회피.",
    tip: "매주 1개 '작은 실험' 설정 → 회고."
  },
  will: {
    label: "의지",
    oneLine: "목표를 끝까지 밀고 가는 추진·규율·자기통제.",
    high: "계획 준수, 마감 강점.",
    low: "산만·미루기 경향.",
    tip: "2주 스프린트·체크리스트·타임블록."
  },
  sensitivity: {
    label: "감수성",
    oneLine: "정서·자극에 대한 민감도와 공감.",
    high: "섬세·공감적(피로 관리 필요).",
    low: "안정적이나 분위기 감지 둔감할 수 있음.",
    tip: "10초 멈춤·감정 라벨링·회복 루틴."
  },
  harmony: {
    label: "조화",
    oneLine: "관계의 균형·협업·갈등 관리 능력.",
    high: "조율·중재 강점.",
    low: "직설·개별주의 경향.",
    tip: "공통목표–옵션2–합의 프레임."
  },
  expression: {
    label: "표현",
    oneLine: "생각·감정을 명확히 전달하고 설득하는 힘.",
    high: "발표·스토리텔링 강점.",
    low: "메시지 모호, 말보다 실행형.",
    tip: "문제–통찰–제안 3요점, 1슬라이드 1메시지."
  },
  insight: {
    label: "통찰",
    oneLine: "패턴을 읽고 본질을 파악하는 분석·직관.",
    high: "구조화·추상화 강점.",
    low: "표면 정보 위주 처리.",
    tip: "사실–해석 분리, 가설→증거→결론."
  },
  resilience: {
    label: "회복력",
    oneLine: "스트레스 이후 빠른 회복과 학습적 낙관성.",
    high: "역경에 강함, 리바운드 빠름.",
    low: "번아웃 위험.",
    tip: "주 2회 리커버리 블록 고정."
  },
  balance: {
    label: "균형",
    oneLine: "에너지 분배·생활 리듬·우선순위의 안정성.",
    high: "지속가능한 페이스 유지.",
    low: "한쪽 과투입으로 손실.",
    tip: "핵심 3·차단 시간 먼저 예약."
  },
  growth: {
    label: "성장",
    oneLine: "피드백 수용·학습 습관·난이도 조절을 통한 확장.",
    high: "러닝 루프 작동.",
    low: "고정관념·시도 회피.",
    tip: "주간 회고(KPT)+실험 1개."
  }
} as const;

export type Inner9Key = keyof typeof INNER9_DESCRIPTIONS;

/**
 * Generate narrative using Inner9 descriptions
 */
export function narrativeFromScores(scores: Record<string, number>) {
  const entries = Object.entries(scores);
  const top = entries.sort((a, b) => b[1] - a[1])[0] as [Inner9Key, number];
  const low = entries.sort((a, b) => a[1] - b[1])[0] as [Inner9Key, number];
  
  return `당신은 ${INNER9_DESCRIPTIONS[top[0]].label}(${top[1]}점)에 강점이 있고, ${INNER9_DESCRIPTIONS[low[0]].label}(${low[1]}점)는 성장 여지가 있습니다.`;
}

/**
 * Get dimension description by key
 */
export function getDimensionDescription(key: Inner9Key) {
  return INNER9_DESCRIPTIONS[key];
}

/**
 * Get all dimension keys in order
 */
export function getAllDimensionKeys(): Inner9Key[] {
  return Object.keys(INNER9_DESCRIPTIONS) as Inner9Key[];
}
