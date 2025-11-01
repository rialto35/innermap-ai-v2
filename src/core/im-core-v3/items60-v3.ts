/**
 * IM-Core v3.0 - 60문항 (연구용 v0.1)
 * 
 * 구조: Big5 5영역 × 3파셋 × 4문항 = 60문항
 * 척도: 1=전혀 아니다 ~ 5=매우 그렇다
 * 역문항: 30개 (50%)
 * 
 * 참조: BFI-2(60) 구조, 문항은 독자 작성 (저작권 안전)
 * 출처: Journal of Research in Personality 2017, SAGE 2016
 */

import type { ItemMetaV3 } from "./types";

export const items60V3: ItemMetaV3[] = [
  // ============================================
  // O (개방성) - 12문항
  // ============================================
  
  // O1: 지적호기심 (curiosity)
  { id: 1, domain: "O", facet: "curiosity", reverse: false,
    question: "새로운 개념을 접하면 더 알아보지 않고는 못 배긴다" },
  { id: 2, domain: "O", facet: "curiosity", reverse: true,
    question: "낯선 분야는 웬만하면 파고들지 않는다" },
  { id: 3, domain: "O", facet: "curiosity", reverse: false,
    question: "복잡한 문제를 스스로 정의해 탐구하는 편이다" },
  { id: 4, domain: "O", facet: "curiosity", reverse: false,
    question: "여러 출처를 비교하며 정보를 수집한다" },
  
  // O2: 미적감수성 (aesthetic)
  { id: 5, domain: "O", facet: "aesthetic", reverse: false,
    question: "음악·그림·풍경에서 쉽게 감동을 느낀다" },
  { id: 6, domain: "O", facet: "aesthetic", reverse: true,
    question: "예술은 내 삶에 큰 의미가 없다" },
  { id: 7, domain: "O", facet: "aesthetic", reverse: false,
    question: "공간의 색·질감 같은 디테일에 민감하다" },
  { id: 8, domain: "O", facet: "aesthetic", reverse: false,
    question: "일상의 사소한 순간에서도 아름다움을 발견한다" },
  
  // O3: 혁신성 (innovation)
  { id: 9, domain: "O", facet: "innovation", reverse: false,
    question: "기존 방식을 개선할 아이디어를 자주 만든다" },
  { id: 10, domain: "O", facet: "innovation", reverse: true,
    question: "새로운 시도보다는 검증된 절차만 고수한다" },
  { id: 11, domain: "O", facet: "innovation", reverse: false,
    question: "서로 다른 아이디어를 결합해 대안을 낸다" },
  { id: 12, domain: "O", facet: "innovation", reverse: false,
    question: "문제를 다각도로 바라보려 노력한다" },
  
  // ============================================
  // C (성실성) - 12문항
  // ============================================
  
  // C1: 정리정돈 (order)
  { id: 13, domain: "C", facet: "order", reverse: false,
    question: "물건과 파일을 체계적으로 정리한다" },
  { id: 14, domain: "C", facet: "order", reverse: true,
    question: "내 작업 공간은 대체로 어질러져 있다" },
  { id: 15, domain: "C", facet: "order", reverse: false,
    question: "일정·할 일을 목록으로 관리한다" },
  { id: 16, domain: "C", facet: "order", reverse: false,
    question: "마감 전 중간 점검을 습관화한다" },
  
  // C2: 끈기·근면 (grit)
  { id: 17, domain: "C", facet: "grit", reverse: false,
    question: "지루해도 끝까지 밀고 나가는 편이다" },
  { id: 18, domain: "C", facet: "grit", reverse: true,
    question: "조금 막히면 과제를 쉽게 포기한다" },
  { id: 19, domain: "C", facet: "grit", reverse: false,
    question: "목표를 세우면 매일 조금씩 전진한다" },
  { id: 20, domain: "C", facet: "grit", reverse: false,
    question: "기대만큼 성과가 없을 때도 꾸준함을 유지한다" },
  
  // C3: 자기통제 (self_control)
  { id: 21, domain: "C", facet: "self_control", reverse: false,
    question: "즉흥적 욕구보다 장기 계획을 우선한다" },
  { id: 22, domain: "C", facet: "self_control", reverse: true,
    question: "하고 싶은 일이 생기면 계획과 상관없이 바로 한다" },
  { id: 23, domain: "C", facet: "self_control", reverse: false,
    question: "피곤해도 계획된 과업을 수행한다" },
  { id: 24, domain: "C", facet: "self_control", reverse: false,
    question: "방해 요인을 미리 차단해 집중을 지킨다" },
  
  // ============================================
  // E (외향성) - 12문항
  // ============================================
  
  // E1: 사회성 (sociability)
  { id: 25, domain: "E", facet: "sociability", reverse: false,
    question: "처음 만난 사람과도 금세 대화를 시작한다" },
  { id: 26, domain: "E", facet: "sociability", reverse: true,
    question: "낯선 모임에서 말이 거의 없다" },
  { id: 27, domain: "E", facet: "sociability", reverse: false,
    question: "사람들과 함께할 때 에너지가 생긴다" },
  { id: 28, domain: "E", facet: "sociability", reverse: false,
    question: "네트워킹을 스스로 만들어 간다" },
  
  // E2: 활력·활동성 (vitality)
  { id: 29, domain: "E", facet: "vitality", reverse: false,
    question: "빠른 템포의 활동을 즐긴다" },
  { id: 30, domain: "E", facet: "vitality", reverse: true,
    question: "바쁜 일정이 이어지면 쉽게 지친다" },
  { id: 31, domain: "E", facet: "vitality", reverse: false,
    question: "하루 중 움직이는 시간이 많은 편이다" },
  { id: 32, domain: "E", facet: "vitality", reverse: false,
    question: "새로운 활동을 주도해 실행한다" },
  
  // E3: 주도성 (assertiveness)
  { id: 33, domain: "E", facet: "assertiveness", reverse: false,
    question: "토론에서 의견을 분명히 제시한다" },
  { id: 34, domain: "E", facet: "assertiveness", reverse: true,
    question: "중요한 순간에 결정을 미루는 편이다" },
  { id: 35, domain: "E", facet: "assertiveness", reverse: false,
    question: "방향을 정하고 사람들을 이끈다" },
  { id: 36, domain: "E", facet: "assertiveness", reverse: false,
    question: "갈등이 있어도 필요한 말을 정중히 한다" },
  
  // ============================================
  // A (우호성) - 12문항
  // ============================================
  
  // A1: 공감·이타 (empathy)
  { id: 37, domain: "A", facet: "empathy", reverse: false,
    question: "타인의 감정을 세심히 살핀다" },
  { id: 38, domain: "A", facet: "empathy", reverse: true,
    question: "곤경에 처한 사람을 봐도 별로 개입하지 않는다" },
  { id: 39, domain: "A", facet: "empathy", reverse: false,
    question: "도움이 필요하면 먼저 제안한다" },
  { id: 40, domain: "A", facet: "empathy", reverse: false,
    question: "상대의 입장에서 상황을 재해석한다" },
  
  // A2: 협동·신뢰 (cooperation)
  { id: 41, domain: "A", facet: "cooperation", reverse: false,
    question: "팀의 합의를 위해 양보점을 찾는다" },
  { id: 42, domain: "A", facet: "cooperation", reverse: true,
    question: "사람을 쉽게 믿지 않고 거리감을 둔다" },
  { id: 43, domain: "A", facet: "cooperation", reverse: false,
    question: "약속과 규칙을 성실히 지킨다" },
  { id: 44, domain: "A", facet: "cooperation", reverse: false,
    question: "공정하게 역할을 나누려 한다" },
  
  // A3: 겸손·배려 (modesty)
  { id: 45, domain: "A", facet: "modesty", reverse: false,
    question: "성과를 내도 과시보다 공유를 택한다" },
  { id: 46, domain: "A", facet: "modesty", reverse: true,
    question: "내가 옳다고 믿으면 타협하지 않는다" },
  { id: 47, domain: "A", facet: "modesty", reverse: false,
    question: "피드백을 열린 마음으로 수용한다" },
  { id: 48, domain: "A", facet: "modesty", reverse: false,
    question: "다른 사람의 공을 인정해 크레딧을 나눈다" },
  
  // ============================================
  // N (신경성) - 12문항
  // ============================================
  
  // N1: 불안 (anxiety)
  { id: 49, domain: "N", facet: "anxiety", reverse: false,
    question: "사소한 일에도 불안이 쉽게 올라온다" },
  { id: 50, domain: "N", facet: "anxiety", reverse: true,
    question: "중요한 자리에서도 거의 긴장하지 않는다" },
  { id: 51, domain: "N", facet: "anxiety", reverse: false,
    question: "미래를 과도하게 걱정하는 편이다" },
  { id: 52, domain: "N", facet: "anxiety", reverse: false,
    question: "실수 후 오랫동안 마음이 불편하다" },
  
  // N2: 충동·민감 (impulsivity)
  { id: 53, domain: "N", facet: "impulsivity", reverse: false,
    question: "감정이 올라오면 즉시 표현하는 편이다" },
  { id: 54, domain: "N", facet: "impulsivity", reverse: true,
    question: "화가 나도 감정을 거의 드러내지 않는다" },
  { id: 55, domain: "N", facet: "impulsivity", reverse: false,
    question: "부정적 피드백에 크게 흔들린다" },
  { id: 56, domain: "N", facet: "impulsivity", reverse: false,
    question: "유혹 상황에서 자기통제가 어렵다" },
  
  // N3: 스트레스 취약 (stress_vulnerability)
  { id: 57, domain: "N", facet: "stress_vulnerability", reverse: false,
    question: "압박이 지속되면 수면·식사가 쉽게 흐트러진다" },
  { id: 58, domain: "N", facet: "stress_vulnerability", reverse: true,
    question: "스트레스가 커져도 일상 리듬을 잘 유지한다" },
  { id: 59, domain: "N", facet: "stress_vulnerability", reverse: false,
    question: "여러 일을 동시에 맡으면 과부하를 느낀다" },
  { id: 60, domain: "N", facet: "stress_vulnerability", reverse: false,
    question: "변화가 많을수록 불안정해진다" },
];

export const TOTAL_ITEMS = items60V3.length;

// 영역별 문항 수 (검증용)
export const ITEMS_PER_DOMAIN = {
  O: 12,
  C: 12,
  E: 12,
  A: 12,
  N: 12,
};

// 파셋별 문항 수 (검증용)
export const ITEMS_PER_FACET = 4;

// 역문항 ID 목록
export const REVERSE_ITEM_IDS = items60V3
  .filter(item => item.reverse)
  .map(item => item.id);

// 역문항 비율
export const REVERSE_RATIO = REVERSE_ITEM_IDS.length / TOTAL_ITEMS;

