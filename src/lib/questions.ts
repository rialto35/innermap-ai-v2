import { Question } from './types'

export const questions: Question[] = [
  // === 슬라이더형 30문항 ===
  {
    id: 1,
    kind: 'slider',
    text: '사람들과 토론할수록 생각이 정리되고 에너지가 난다.',
    leftLabel: '아니다',
    rightLabel: '그렇다',
    weights: { MBTI: { E: 0.8 }, Big5: { E_b5: 0.5 }, Growth: { harmony: 0.2 } }
  },
  {
    id: 2,
    kind: 'slider',
    text: '세부 사실보다 패턴과 가능성에서 먼저 의미를 찾는다.',
    leftLabel: '아니다',
    rightLabel: '그렇다',
    weights: { MBTI: { N: 0.8, S: -0.8 }, Big5: { O: 0.5 } }
  },
  {
    id: 3,
    kind: 'slider',
    text: '결정할 때 감정보다 원칙과 논리를 우선한다.',
    leftLabel: '아니다',
    rightLabel: '그렇다',
    weights: { MBTI: { T: 0.8, F: -0.8 }, Big5: { A: -0.3 } }
  },
  {
    id: 4,
    kind: 'slider',
    text: '계획대로 진행될 때 가장 편안하고 효율적이다.',
    leftLabel: '아니다',
    rightLabel: '그렇다',
    weights: { MBTI: { J: 0.8, P: -0.8 }, Big5: { C: 0.6 }, Growth: { stability: 0.2 } }
  },
  {
    id: 5,
    kind: 'slider',
    text: '새로운 환경에서도 빠르게 적응하는 편이다.',
    weights: { MBTI: { P: 0.6 }, Big5: { O: 0.4, E_b5: 0.3 }, Growth: { growth: 0.3 } }
  },
  {
    id: 6,
    kind: 'slider',
    text: '감정이입보다 객관적 조언을 선호한다.',
    weights: { MBTI: { T: 0.5, F: -0.5 }, RETI: { r5: 0.4 }, Big5: { A: -0.4 } }
  },
  {
    id: 7,
    kind: 'slider',
    text: '매일 일정한 루틴을 유지하면 안정감을 느낀다.',
    weights: { MBTI: { J: 0.5 }, Big5: { C: 0.5 }, Growth: { stability: 0.4 } }
  },
  {
    id: 8,
    kind: 'slider',
    text: '사람들의 감정을 빨리 알아차리는 편이다.',
    weights: { MBTI: { F: 0.6 }, Big5: { A: 0.5 }, RETI: { r2: 0.3 } }
  },
  {
    id: 9,
    kind: 'slider',
    text: '복잡한 문제를 분석하고 구조화하는 것을 즐긴다.',
    weights: { MBTI: { T: 0.6, N: 0.4 }, Big5: { O: 0.5 }, RETI: { r5: 0.4 } }
  },
  {
    id: 10,
    kind: 'slider',
    text: '여러 사람과 함께 있을 때 에너지가 오른다.',
    weights: { MBTI: { E: 0.6 }, Big5: { E_b5: 0.6 }, Growth: { harmony: 0.3 } }
  },
  {
    id: 11,
    kind: 'slider',
    text: '새로운 아이디어를 떠올리는 일이 즐겁다.',
    weights: { MBTI: { N: 0.7 }, Big5: { O: 0.6 }, RETI: { r4: 0.3 } }
  },
  {
    id: 12,
    kind: 'slider',
    text: '다른 사람의 고민을 듣고 해결책을 제시하는 편이다.',
    weights: { MBTI: { F: 0.4, T: 0.2 }, RETI: { r2: 0.5 }, Growth: { harmony: 0.3 } }
  },
  {
    id: 13,
    kind: 'slider',
    text: '실수 없는 완성도를 추구한다.',
    weights: { RETI: { r1: 0.9 }, Big5: { C: 0.5, N_b5: 0.2 }, Growth: { stability: 0.2 } }
  },
  {
    id: 14,
    kind: 'slider',
    text: '팀 프로젝트에서 리더 역할을 자주 맡는다.',
    weights: { MBTI: { E: 0.4, J: 0.4 }, RETI: { r8: 0.4 }, Growth: { growth: 0.3 } }
  },
  {
    id: 15,
    kind: 'slider',
    text: '주변의 분위기 변화를 민감하게 느낀다.',
    weights: { RETI: { r2: 0.6 }, Big5: { A: 0.5 }, Growth: { harmony: 0.4 } }
  },
  {
    id: 16,
    kind: 'slider',
    text: '불확실한 상황에서도 기회부터 찾는다.',
    weights: { MBTI: { P: 0.5, N: 0.4 }, Big5: { O: 0.6 }, Growth: { growth: 0.4 } }
  },
  {
    id: 17,
    kind: 'slider',
    text: '타인의 감정보다 객관적인 사실을 먼저 본다.',
    weights: { MBTI: { T: 0.5 }, RETI: { r5: 0.3 }, Big5: { A: -0.3 } }
  },
  {
    id: 18,
    kind: 'slider',
    text: '하나의 일에 몰입하기보다는 여러 일을 동시에 진행한다.',
    weights: { MBTI: { P: 0.4 }, Big5: { O: 0.4 }, Growth: { growth: 0.3 } }
  },
  {
    id: 19,
    kind: 'slider',
    text: '새로움·즐거움·경험을 끊임없이 추구한다.',
    weights: { RETI: { r7: 0.9 }, Big5: { E_b5: 0.4, O: 0.5 } }
  },
  {
    id: 20,
    kind: 'slider',
    text: '감정적 공감을 크게 중요시하지 않는다.',
    weights: { MBTI: { T: 0.4, F: -0.4 }, Big5: { A: -0.5 } }
  },
  {
    id: 21,
    kind: 'slider',
    text: '시스템과 프로세스를 만들고 관리하는 것을 좋아한다.',
    weights: { MBTI: { J: 0.5, T: 0.4 }, RETI: { r8: 0.5 }, Growth: { stability: 0.3 } }
  },
  {
    id: 22,
    kind: 'slider',
    text: '남들과 다른 독창적인 해석을 자주 떠올린다.',
    weights: { MBTI: { N: 0.6 }, RETI: { r4: 0.5 }, Big5: { O: 0.6 } }
  },
  {
    id: 23,
    kind: 'slider',
    text: '협력보다는 혼자서 결정하고 실행하는 편이 편하다.',
    weights: { MBTI: { I: 0.4, T: 0.4 }, Big5: { A: -0.4 }, Growth: { individual: 0.3 } }
  },
  {
    id: 24,
    kind: 'slider',
    text: '감정 기복이 적고 침착한 편이다.',
    weights: { Big5: { N_b5: -0.5, C: 0.4 }, Growth: { stability: 0.3 } }
  },
  {
    id: 25,
    kind: 'slider',
    text: '감각적 경험(미술·음악·미식 등)에 몰입한다.',
    weights: { MBTI: { S: 0.5 }, RETI: { r4: 0.3 }, Big5: { O: 0.5 } }
  },
  {
    id: 26,
    kind: 'slider',
    text: '위기 상황에서 즉각 행동으로 문제를 해결한다.',
    weights: { RETI: { r8: 0.5 }, Big5: { E_b5: 0.4, C: 0.3 }, Growth: { growth: 0.4 } }
  },
  {
    id: 27,
    kind: 'slider',
    text: '긴 대화보다 핵심 요약을 선호한다.',
    weights: { MBTI: { T: 0.4, N: 0.2 }, Big5: { A: -0.3 } }
  },
  {
    id: 28,
    kind: 'slider',
    text: '새로운 사람이 많은 모임에 가면 쉽게 친해진다.',
    weights: { MBTI: { E: 0.6 }, Big5: { E_b5: 0.6 }, RETI: { r7: 0.3 } }
  },
  {
    id: 29,
    kind: 'slider',
    text: '거시적인 전략을 세우는 데 능숙하다.',
    weights: { MBTI: { N: 0.5, J: 0.4 }, RETI: { r3: 0.4 }, Growth: { growth: 0.3 } }
  },
  {
    id: 30,
    kind: 'slider',
    text: '집단의 조화를 위해 개인적 개성을 조정할 수 있다.',
    leftLabel: '개성 우선',
    rightLabel: '조화 우선',
    weights: { Growth: { individual: -0.7, harmony: 0.7 }, MBTI: { F: 0.2 } }
  },

  // === 강요선택형 5문항 ===
  {
    id: 31,
    kind: 'pair',
    a: '사람들과 아이디어를 나누면 에너지가 생긴다.',
    b: '조용히 생각 정리하는 시간이 더 필요하다.',
    weightsA: { MBTI: { E: 0.9 }, Big5: { E_b5: 0.6, O: 0.2 } },
    weightsB: { MBTI: { I: 0.9 }, Big5: { E_b5: -0.3 }, Growth: { individual: 0.2 } }
  },
  {
    id: 32,
    kind: 'pair',
    a: '즉흥적인 기회라도 먼저 경험해 본다.',
    b: '충분한 정보와 준비 후에 움직인다.',
    weightsA: { MBTI: { P: 0.8 }, Big5: { O: 0.5, E_b5: 0.3 }, RETI: { r7: 0.4 } },
    weightsB: { MBTI: { J: 0.8 }, Big5: { C: 0.6 }, RETI: { r1: 0.3 }, Growth: { stability: 0.4 } }
  },
  {
    id: 33,
    kind: 'pair',
    a: '상대의 감정에 쉽게 흔들린다.',
    b: '냉정한 판단으로 중심을 잡는다.',
    weightsA: { MBTI: { F: 0.7 }, RETI: { r2: 0.5 }, Big5: { A: 0.6 } },
    weightsB: { MBTI: { T: 0.7 }, RETI: { r8: 0.4 }, Big5: { A: -0.3 } }
  },
  {
    id: 34,
    kind: 'pair',
    a: '변화가 잦은 환경에서도 즐겁게 적응한다.',
    b: '변화가 적고 예측 가능한 환경이 편하다.',
    weightsA: { MBTI: { P: 0.6, N: 0.3 }, RETI: { r7: 0.4 }, Growth: { growth: 0.4 } },
    weightsB: { MBTI: { J: 0.6, S: 0.3 }, Big5: { C: 0.5 }, Growth: { stability: 0.3 } }
  },
  {
    id: 35,
    kind: 'pair',
    a: '아이디어가 떠오르면 곧바로 실행하고 본다.',
    b: '실행 전에 모든 리스크를 점검해야 안심된다.',
    weightsA: { MBTI: { E: 0.4, P: 0.6 }, RETI: { r7: 0.3 }, Growth: { growth: 0.3 } },
    weightsB: { MBTI: { I: 0.4, J: 0.6 }, Big5: { C: 0.6 }, Growth: { stability: 0.4 } }
  }
]

