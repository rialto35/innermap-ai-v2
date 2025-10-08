import { Question } from '@/types/question';

export const questionBank: Question[] = [
  // ========== MBTI 문항 ==========
  // E/I (외향-내향)
  { id: 'mbti_ei_1', text: '새로운 사람들과 어울리는 것이 즐겁고 에너지를 얻는다', scale: '5', tag: 'MBTI', dimension: 'EI', reverse: false },
  { id: 'mbti_ei_2', text: '혼자 있는 시간이 필요하고, 그것이 재충전의 시간이다', scale: '5', tag: 'MBTI', dimension: 'EI', reverse: true },
  { id: 'mbti_ei_3', text: '파티나 모임에서 먼저 대화를 시작하는 편이다', scale: '5', tag: 'MBTI', dimension: 'EI', reverse: false },
  { id: 'mbti_ei_4', text: '소수의 깊은 관계를 대규모 네트워크보다 선호한다', scale: '5', tag: 'MBTI', dimension: 'EI', reverse: true },
  { id: 'mbti_ei_5', text: '생각을 말로 표현하면서 정리하는 편이다', scale: '5', tag: 'MBTI', dimension: 'EI', reverse: false },

  // S/N (감각-직관)
  { id: 'mbti_sn_1', text: '구체적인 사실과 세부사항에 집중하는 편이다', scale: '5', tag: 'MBTI', dimension: 'SN', reverse: false },
  { id: 'mbti_sn_2', text: '전체적인 패턴과 가능성을 보는 것을 좋아한다', scale: '5', tag: 'MBTI', dimension: 'SN', reverse: true },
  { id: 'mbti_sn_3', text: '현실적이고 실용적인 해결책을 선호한다', scale: '5', tag: 'MBTI', dimension: 'SN', reverse: false },
  { id: 'mbti_sn_4', text: '새로운 아이디어와 이론을 탐구하는 것이 흥미롭다', scale: '5', tag: 'MBTI', dimension: 'SN', reverse: true },
  { id: 'mbti_sn_5', text: '경험한 것을 바탕으로 판단하는 편이다', scale: '5', tag: 'MBTI', dimension: 'SN', reverse: false },

  // T/F (사고-감정)
  { id: 'mbti_tf_1', text: '결정을 내릴 때 논리와 객관성을 우선한다', scale: '5', tag: 'MBTI', dimension: 'TF', reverse: false },
  { id: 'mbti_tf_2', text: '결정이 사람들에게 미치는 영향을 중요하게 고려한다', scale: '5', tag: 'MBTI', dimension: 'TF', reverse: true },
  { id: 'mbti_tf_3', text: '비판적 분석이 공감보다 자연스럽다', scale: '5', tag: 'MBTI', dimension: 'TF', reverse: false },
  { id: 'mbti_tf_4', text: '다른 사람의 감정에 민감하게 반응한다', scale: '5', tag: 'MBTI', dimension: 'TF', reverse: true },
  { id: 'mbti_tf_5', text: '옳고 그름을 판단할 때 원칙을 중시한다', scale: '5', tag: 'MBTI', dimension: 'TF', reverse: false },

  // J/P (판단-인식)
  { id: 'mbti_jp_1', text: '계획을 세우고 그대로 실행하는 것을 선호한다', scale: '5', tag: 'MBTI', dimension: 'JP', reverse: false },
  { id: 'mbti_jp_2', text: '상황에 따라 유연하게 대처하는 것이 편하다', scale: '5', tag: 'MBTI', dimension: 'JP', reverse: true },
  { id: 'mbti_jp_3', text: '마감 전에 미리미리 끝내는 편이다', scale: '5', tag: 'MBTI', dimension: 'JP', reverse: false },
  { id: 'mbti_jp_4', text: '여러 가능성을 열어두고 결정을 미루는 편이다', scale: '5', tag: 'MBTI', dimension: 'JP', reverse: true },
  { id: 'mbti_jp_5', text: '정리정돈된 환경에서 일하는 것을 좋아한다', scale: '5', tag: 'MBTI', dimension: 'JP', reverse: false },

  // ========== RETI (에니어그램) 문항 ==========
  { id: 'reti_1', text: '옳고 그름에 대한 기준이 명확하고 완벽을 추구한다', scale: '7', tag: 'RETI', dimension: 'type1' },
  { id: 'reti_2', text: '다른 사람을 돕는 것에서 보람을 느끼고 관계를 중시한다', scale: '7', tag: 'RETI', dimension: 'type2' },
  { id: 'reti_3', text: '목표 달성과 성공이 중요하고 효율적으로 일한다', scale: '7', tag: 'RETI', dimension: 'type3' },
  { id: 'reti_4', text: '나만의 개성과 감성을 표현하는 것이 중요하다', scale: '7', tag: 'RETI', dimension: 'type4' },
  { id: 'reti_5', text: '지식을 탐구하고 독립적으로 사고하는 것을 좋아한다', scale: '7', tag: 'RETI', dimension: 'type5' },
  { id: 'reti_6', text: '안전과 신뢰를 중요하게 여기고 책임감이 강하다', scale: '7', tag: 'RETI', dimension: 'type6' },
  { id: 'reti_7', text: '새로운 경험과 즐거움을 추구하고 긍정적이다', scale: '7', tag: 'RETI', dimension: 'type7' },
  { id: 'reti_8', text: '강하고 자신감 있으며 주도권을 가지는 것을 선호한다', scale: '7', tag: 'RETI', dimension: 'type8' },
  { id: 'reti_9', text: '평화롭고 조화로운 환경을 추구하고 갈등을 피한다', scale: '7', tag: 'RETI', dimension: 'type9' },

  { id: 'reti_1b', text: '실수나 불완전함을 받아들이기 어렵다', scale: '7', tag: 'RETI', dimension: 'type1' },
  { id: 'reti_2b', text: '다른 사람의 필요를 내 필요보다 우선한다', scale: '7', tag: 'RETI', dimension: 'type2' },
  { id: 'reti_3b', text: '타인의 인정과 평가가 나에게 중요하다', scale: '7', tag: 'RETI', dimension: 'type3' },
  { id: 'reti_4b', text: '평범함보다는 특별함을 추구한다', scale: '7', tag: 'RETI', dimension: 'type4' },
  { id: 'reti_5b', text: '감정 표현보다 분석과 관찰을 선호한다', scale: '7', tag: 'RETI', dimension: 'type5' },
  { id: 'reti_6b', text: '최악의 상황을 미리 예상하고 대비한다', scale: '7', tag: 'RETI', dimension: 'type6' },
  { id: 'reti_7b', text: '제약이나 한계를 싫어하고 자유를 갈망한다', scale: '7', tag: 'RETI', dimension: 'type7' },
  { id: 'reti_8b', text: '약해 보이는 것을 싫어하고 강인함을 중시한다', scale: '7', tag: 'RETI', dimension: 'type8' },
  { id: 'reti_9b', text: '자신의 의견을 주장하기보다 타협을 선호한다', scale: '7', tag: 'RETI', dimension: 'type9' },

  { id: 'reti_1c', text: '원칙과 규칙을 지키는 것이 중요하다', scale: '7', tag: 'RETI', dimension: 'type1' },
  { id: 'reti_2c', text: '사람들이 나를 필요로 할 때 뿌듯함을 느낀다', scale: '7', tag: 'RETI', dimension: 'type2' },
  { id: 'reti_3c', text: '경쟁에서 이기는 것이 중요하다', scale: '7', tag: 'RETI', dimension: 'type3' },
  { id: 'reti_4c', text: '깊은 감정과 의미를 추구한다', scale: '7', tag: 'RETI', dimension: 'type4' },

  // ========== Big5 문항 ==========
  // O (개방성)
  { id: 'big5_o_1', text: '새로운 아이디어와 예술적 경험에 열려있다', scale: '5', tag: 'BIG5', dimension: 'O', reverse: false },
  { id: 'big5_o_2', text: '상상력이 풍부하고 창의적이다', scale: '5', tag: 'BIG5', dimension: 'O', reverse: false },
  { id: 'big5_o_3', text: '전통적인 방식보다 새로운 방법을 시도한다', scale: '5', tag: 'BIG5', dimension: 'O', reverse: false },
  { id: 'big5_o_4', text: '익숙한 것보다 낯선 것이 불편하다', scale: '5', tag: 'BIG5', dimension: 'O', reverse: true },

  // C (성실성)
  { id: 'big5_c_1', text: '계획을 철저히 세우고 실행한다', scale: '5', tag: 'BIG5', dimension: 'C', reverse: false },
  { id: 'big5_c_2', text: '약속과 마감을 잘 지킨다', scale: '5', tag: 'BIG5', dimension: 'C', reverse: false },
  { id: 'big5_c_3', text: '세심하고 꼼꼼하게 일을 처리한다', scale: '5', tag: 'BIG5', dimension: 'C', reverse: false },
  { id: 'big5_c_4', text: '즉흥적이고 계획 없이 행동하는 편이다', scale: '5', tag: 'BIG5', dimension: 'C', reverse: true },

  // E (외향성)
  { id: 'big5_e_1', text: '활기차고 에너지가 넘친다', scale: '5', tag: 'BIG5', dimension: 'E', reverse: false },
  { id: 'big5_e_2', text: '사람들과 함께 있을 때 즐겁다', scale: '5', tag: 'BIG5', dimension: 'E', reverse: false },
  { id: 'big5_e_3', text: '말이 많고 적극적으로 소통한다', scale: '5', tag: 'BIG5', dimension: 'E', reverse: false },
  { id: 'big5_e_4', text: '조용하고 내성적인 편이다', scale: '5', tag: 'BIG5', dimension: 'E', reverse: true },

  // A (친화성)
  { id: 'big5_a_1', text: '다른 사람에게 친절하고 배려한다', scale: '5', tag: 'BIG5', dimension: 'A', reverse: false },
  { id: 'big5_a_2', text: '협력하고 타협하는 것을 선호한다', scale: '5', tag: 'BIG5', dimension: 'A', reverse: false },
  { id: 'big5_a_3', text: '타인을 믿고 신뢰한다', scale: '5', tag: 'BIG5', dimension: 'A', reverse: false },
  { id: 'big5_a_4', text: '때로는 냉정하고 비판적이다', scale: '5', tag: 'BIG5', dimension: 'A', reverse: true },

  // N (신경증)
  { id: 'big5_n_1', text: '스트레스를 받으면 쉽게 불안해진다', scale: '5', tag: 'BIG5', dimension: 'N', reverse: false },
  { id: 'big5_n_2', text: '감정 기복이 있는 편이다', scale: '5', tag: 'BIG5', dimension: 'N', reverse: false },
  { id: 'big5_n_3', text: '걱정이 많고 예민하다', scale: '5', tag: 'BIG5', dimension: 'N', reverse: false },
  { id: 'big5_n_4', text: '대부분의 상황에서 평온하고 안정적이다', scale: '5', tag: 'BIG5', dimension: 'N', reverse: true },
];

// 모드별 문항 샘플링
export function buildTestPlan(mode: 'simple' | 'deep'): Question[] {
  const pick = (tag: 'MBTI' | 'RETI' | 'BIG5', n: number) => {
    const filtered = questionBank.filter(q => q.tag === tag);
    return filtered.sort(() => Math.random() - 0.5).slice(0, n);
  };

  const questions = mode === 'simple'
    ? [...pick('MBTI', 8), ...pick('RETI', 8), ...pick('BIG5', 8)]
    : [...pick('MBTI', 20), ...pick('RETI', 20), ...pick('BIG5', 20)];

  // 랜덤 섞기
  return questions.sort(() => Math.random() - 0.5);
}

