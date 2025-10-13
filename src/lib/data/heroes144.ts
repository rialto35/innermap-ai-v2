// lib/data/heroes144.ts
// InnerMap AI - 144 영웅 데이터베이스
// MBTI(16) × RETI(9) = 144 영웅

export interface Hero {
  id: string
  number: number
  mbti: string
  reti: string
  retiType: string
  name: string
  nameEn: string
  tagline: string
  description: string
  abilities: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

export const HEROES_144: Hero[] = [
  // INTP × RETI (001-009)
  {
    id: 'intp-1',
    number: 1,
    mbti: 'INTP',
    reti: '1',
    retiType: '완벽형',
    name: '논리의 설계자',
    nameEn: 'Architect of Logic',
    tagline: '완벽한 구조 속에서 진리를 추구하는 사색가',
    description: '지식과 구조를 동시에 사랑하는 설계자. 그는 모든 현상 뒤에 숨은 논리를 추적하며, 세상을 이해 가능한 체계로 재구성한다. 세부에 집착하기보다 \'완벽한 원리\'를 찾는 데 집중하며, 감정보다 진리를 우선시한다. 자신이 세운 규칙 안에서만 안심하지만, 그 규칙이 깨질 때 오히려 더 깊은 통찰을 얻는다.',
    abilities: {
      openness: 92,
      conscientiousness: 78,
      extraversion: 35,
      agreeableness: 52,
      neuroticism: 30
    }
  },
  {
    id: 'intp-2',
    number: 2,
    mbti: 'INTP',
    reti: '2',
    retiType: '도우미형',
    name: '지식의 조력자',
    nameEn: 'Helper of Knowledge',
    tagline: '사고의 힘으로 타인을 돕는 지성의 동반자',
    description: '그는 직접 드러나지 않고, 조용히 다른 이의 사고를 돕는 지성의 동반자다. 분석과 관찰을 통해 타인의 아이디어를 정제하고 구조화하며, 감정적 공감 대신 논리적 지원으로 관계를 맺는다. 그의 도움은 따뜻함보다 명료함으로 다가오지만, 그 안엔 진심 어린 배려가 숨어 있다.',
    abilities: {
      openness: 88,
      conscientiousness: 75,
      extraversion: 40,
      agreeableness: 68,
      neuroticism: 35
    }
  },
  {
    id: 'intp-3',
    number: 3,
    mbti: 'INTP',
    reti: '3',
    retiType: '성취형',
    name: '체계의 개척자',
    nameEn: 'Pioneer of Systems',
    tagline: '논리와 규율로 세상을 재정립하는 분석가',
    description: '그는 완벽한 이론과 효율적 시스템을 만드는 것을 삶의 목표로 삼는다. 혼란 속에서도 규칙을 발견하고, 비효율을 제거하는 데 열정을 쏟는다. 주변의 평가에는 무관심하지만 자신의 기준에는 철저하다. \'완성된 논리\'야말로 그의 가장 큰 보상이다.',
    abilities: {
      openness: 85,
      conscientiousness: 82,
      extraversion: 37,
      agreeableness: 50,
      neuroticism: 32
    }
  },
  {
    id: 'intp-4',
    number: 4,
    mbti: 'INTP',
    reti: '4',
    retiType: '개성형',
    name: '아이디어의 연금술사',
    nameEn: 'Alchemist of Ideas',
    tagline: '독창적 사고로 새로운 질서를 창조하는 창의가',
    description: '그의 머릿속은 언제나 새로운 조합으로 끓고 있다. 서로 무관해 보이는 개념을 융합해 전혀 다른 아이디어를 만들어낸다. 그는 "왜?"라는 질문보다 "만약 이렇게 하면?"을 즐긴다. 세상의 틀을 깨고 새로운 가능성을 창조하는 지적 예술가.',
    abilities: {
      openness: 96,
      conscientiousness: 70,
      extraversion: 48,
      agreeableness: 60,
      neuroticism: 37
    }
  },
  {
    id: 'intp-5',
    number: 5,
    mbti: 'INTP',
    reti: '5',
    retiType: '탐구형',
    name: '진리의 탐험가',
    nameEn: 'Explorer of Truth',
    tagline: '끝없는 호기심으로 본질을 파고드는 학자',
    description: '끝없는 지적 모험을 즐기는 순수한 학자. 그는 답보다 질문을 사랑하며, 세상 모든 현상을 실험하듯 다룬다. 현실과 동떨어져 보여도, 그의 세계는 언제나 정교한 논리로 돌아간다. 지식 탐구는 그의 신앙이며, 진리는 그의 나침반이다.',
    abilities: {
      openness: 94,
      conscientiousness: 68,
      extraversion: 32,
      agreeableness: 47,
      neuroticism: 28
    }
  },
  {
    id: 'intp-6',
    number: 6,
    mbti: 'INTP',
    reti: '6',
    retiType: '충성형',
    name: '이성의 수호자',
    nameEn: 'Guardian of Reason',
    tagline: '신념과 논리를 통해 일관된 정의를 지키는 자',
    description: '그는 논리와 신념으로 자신과 세상을 지탱한다. 불확실성을 가장 경계하며, 원칙이 무너지면 혼란에 빠진다. 하지만 일단 신뢰를 쌓은 대상에겐 끝까지 충실하다. 변덕이 아닌 일관성을, 유행이 아닌 진리를 따르는 고독한 수호자다.',
    abilities: {
      openness: 80,
      conscientiousness: 85,
      extraversion: 38,
      agreeableness: 58,
      neuroticism: 34
    }
  },
  {
    id: 'intp-7',
    number: 7,
    mbti: 'INTP',
    reti: '7',
    retiType: '열정형',
    name: '지성의 불꽃',
    nameEn: 'Flame of Intellect',
    tagline: '논리 속에서도 영감을 피워내는 열정적 사색가',
    description: '논리로 세상을 바라보지만, 그 이면엔 뜨거운 창조의 불이 타오른다. 그는 아이디어에 감정적으로 몰입하며, 새로운 개념을 발견할 때마다 전율을 느낀다. 지적 흥분은 그의 연료이며, 탐구는 그의 무대다. 이성 속에서 열정을 피워내는 \'냉정한 열정가\'.',
    abilities: {
      openness: 93,
      conscientiousness: 72,
      extraversion: 55,
      agreeableness: 62,
      neuroticism: 39
    }
  },
  {
    id: 'intp-8',
    number: 8,
    mbti: 'INTP',
    reti: '8',
    retiType: '도전형',
    name: '개혁의 전략가',
    nameEn: 'Strategist of Reform',
    tagline: '생각으로 싸우고 설계로 세상을 바꾸는 전략가',
    description: '그는 단순한 비판자가 아니라 논리로 세상을 혁신하는 전략가다. 기존 체계를 해체하고, 더 효율적인 구조로 재설계하려 한다. 때로는 차갑고 완고해 보이지만, 그 냉철함이야말로 혁신의 원동력이다. 생각으로 싸우고 설계로 이기는 이성의 전사.',
    abilities: {
      openness: 89,
      conscientiousness: 79,
      extraversion: 45,
      agreeableness: 49,
      neuroticism: 31
    }
  },
  {
    id: 'intp-9',
    number: 9,
    mbti: 'INTP',
    reti: '9',
    retiType: '평화형',
    name: '지혜의 중재자',
    nameEn: 'Mediator of Wisdom',
    tagline: '이성과 조화를 통해 균형을 이루는 조용한 현자',
    description: '갈등을 싫어하며, 조용한 논리로 사람들 사이의 균형을 잡는 현자형. 그는 논쟁 대신 이해를, 감정 대신 이성을 택한다. 복잡한 상황을 객관적으로 분석해 서로의 입장을 조율하는 능력을 지녔다. 내면의 평온이 그에게 최고의 질서다.',
    abilities: {
      openness: 86,
      conscientiousness: 77,
      extraversion: 41,
      agreeableness: 70,
      neuroticism: 25
    }
  },

  // ISFP × RETI (010-018)
  {
    id: 'isfp-1',
    number: 10,
    mbti: 'ISFP',
    reti: '1',
    retiType: '완벽형',
    name: '감성의 조각가',
    nameEn: 'Sculptor of Emotion',
    tagline: '세상을 아름답게 빚어내는 완성주의 예술가',
    description: '그는 세상을 아름답게 빚어내는 완성주의 예술가다. 감정의 결을 섬세하게 읽어내며, 자신만의 세계를 조형한다. 결과물 하나에도 진심을 담으며, 그 안에서 \'완전한 감정의 조화\'를 추구한다. 겉보기엔 조용하지만 내면은 정교한 미학으로 불타오른다.',
    abilities: {
      openness: 90,
      conscientiousness: 80,
      extraversion: 42,
      agreeableness: 72,
      neuroticism: 34
    }
  },
  {
    id: 'isfp-2',
    number: 11,
    mbti: 'ISFP',
    reti: '2',
    retiType: '도우미형',
    name: '온기의 치유자',
    nameEn: 'Healer of Warmth',
    tagline: '따뜻한 감정으로 상처를 감싸는 위로자',
    description: '그는 타인의 상처를 감정으로 감싸는 치유자다. 말보다 눈빛으로, 논리보다 온기로 소통한다. 사람들의 아픔을 자신의 일처럼 느끼며, 진심으로 공감한다. 세상의 냉정함 속에서도 따뜻한 온도를 유지하는, 진정한 감성의 동반자.',
    abilities: {
      openness: 85,
      conscientiousness: 73,
      extraversion: 46,
      agreeableness: 90,
      neuroticism: 30
    }
  },
  {
    id: 'isfp-3',
    number: 12,
    mbti: 'ISFP',
    reti: '3',
    retiType: '성취형',
    name: '아름다움의 실천가',
    nameEn: 'Practitioner of Beauty',
    tagline: '예술적 감각을 현실로 옮기는 행동형 감성가',
    description: '그는 감성을 행동으로 옮기는 실천가다. 아름다움은 머릿속 이상이 아니라 \'현실 속 변화\'라고 믿는다. 디자인, 예술, 봉사 등 어떤 분야에서도 미적 조화를 이루려 한다. 조용히 그러나 꾸준히, 자신의 손끝으로 세상을 다듬는다.',
    abilities: {
      openness: 88,
      conscientiousness: 82,
      extraversion: 50,
      agreeableness: 75,
      neuroticism: 32
    }
  },
  {
    id: 'isfp-4',
    number: 13,
    mbti: 'ISFP',
    reti: '4',
    retiType: '개성형',
    name: '자유의 감각가',
    nameEn: 'Sensualist of Freedom',
    tagline: '자신만의 색으로 세상을 표현하는 창조자',
    description: '그는 누구의 틀에도 갇히지 않는다. 감정이 곧 그의 나침반이다. 색, 향, 온도, 분위기 — 모든 감각을 통해 자신을 표현한다. 사람들은 그를 예술가라 부르지만, 그는 단지 \'진짜 자신\'을 살고 있을 뿐이다. 그의 삶 자체가 예술이다.',
    abilities: {
      openness: 95,
      conscientiousness: 65,
      extraversion: 58,
      agreeableness: 70,
      neuroticism: 36
    }
  },
  {
    id: 'isfp-5',
    number: 14,
    mbti: 'ISFP',
    reti: '5',
    retiType: '탐구형',
    name: '감정의 탐험가',
    nameEn: 'Explorer of Emotion',
    tagline: '감정의 깊이를 이해하려는 감성 철학자',
    description: '그는 감정의 깊이를 탐구하는 철학자다. 눈물, 기쁨, 고독 같은 인간의 감정이 어떻게 존재하는지를 분석하며, 감성의 구조를 이해하려 한다. 예술과 철학의 경계에 서서 인간의 내면세계를 탐험하는 사색가형 예술인.',
    abilities: {
      openness: 92,
      conscientiousness: 70,
      extraversion: 39,
      agreeableness: 67,
      neuroticism: 28
    }
  },
  {
    id: 'isfp-6',
    number: 15,
    mbti: 'ISFP',
    reti: '6',
    retiType: '충성형',
    name: '진심의 동반자',
    nameEn: 'Companion of Sincerity',
    tagline: '변함없는 마음으로 관계를 지키는 헌신가',
    description: '그는 관계의 신뢰를 생명처럼 여긴다. 변덕 없는 진심으로 사람을 대하며, 한 번 맺은 인연은 끝까지 지킨다. 세상의 불안정 속에서도 그는 \'따뜻한 일관성\'으로 버팀목이 된다. 신뢰와 진심으로 관계를 지키는 감성의 수호자.',
    abilities: {
      openness: 82,
      conscientiousness: 85,
      extraversion: 43,
      agreeableness: 88,
      neuroticism: 29
    }
  },
  {
    id: 'isfp-7',
    number: 16,
    mbti: 'ISFP',
    reti: '7',
    retiType: '열정형',
    name: '감정의 불꽃',
    nameEn: 'Flame of Feeling',
    tagline: '예술로 세상을 밝히는 열정의 표현자',
    description: '그의 감정은 예술이자 불꽃이다. 슬픔도 기쁨도 모두 창조의 에너지가 된다. 그는 무대 위에서, 혹은 조용한 화폭 위에서 세상과 사랑을 나눈다. 감정은 그에게 있어 약점이 아니라 생명력이다. 뜨겁게 느끼고, 뜨겁게 살아가는 존재.',
    abilities: {
      openness: 91,
      conscientiousness: 72,
      extraversion: 61,
      agreeableness: 80,
      neuroticism: 35
    }
  },
  {
    id: 'isfp-8',
    number: 17,
    mbti: 'ISFP',
    reti: '8',
    retiType: '도전형',
    name: '감정의 선봉자',
    nameEn: 'Vanguard of Emotion',
    tagline: '감정의 힘으로 새로운 길을 여는 행동가',
    description: '그는 감정의 힘으로 세상을 바꾼다. 부드럽지만 결단력 있고, 감성적이지만 단단하다. 자신이 옳다고 믿는 아름다움을 위해 싸우며, 새로운 예술의 길을 개척한다. 감정은 그의 무기이자 혁명의 불씨다.',
    abilities: {
      openness: 89,
      conscientiousness: 77,
      extraversion: 56,
      agreeableness: 73,
      neuroticism: 31
    }
  },
  {
    id: 'isfp-9',
    number: 18,
    mbti: 'ISFP',
    reti: '9',
    retiType: '평화형',
    name: '온기의 중재자',
    nameEn: 'Mediator of Warmth',
    tagline: '갈등 속에서도 따뜻한 화합을 만드는 조율자',
    description: '그는 갈등의 한가운데서도 따뜻한 온도를 유지한다. 타인의 감정에 귀 기울이며, 이해와 화해를 이끌어낸다. 그가 머무는 곳엔 늘 평온한 공기가 흐른다. 조용하지만 강한 존재감으로, 세상에 부드러운 균형을 만든다.',
    abilities: {
      openness: 86,
      conscientiousness: 75,
      extraversion: 47,
      agreeableness: 91,
      neuroticism: 26
    }
  },

  // ENFJ × RETI (019-027)
  {
    id: 'enfj-1',
    number: 19,
    mbti: 'ENFJ',
    reti: '1',
    retiType: '완벽형',
    name: '빛의 설계자',
    nameEn: 'Architect of Light',
    tagline: '인간의 가능성을 완벽히 구현하려는 비전가',
    description: '그는 인간의 잠재력을 완벽히 구현하려는 비전의 설계자다. 세상을 더 나은 방향으로 이끌기 위해 감정과 이성을 조화시키며, 타인의 가능성을 체계적으로 끌어올린다. 자신에게도 엄격하지만, 그 기준은 세상을 위한 헌신에서 비롯된다.',
    abilities: {
      openness: 88,
      conscientiousness: 86,
      extraversion: 80,
      agreeableness: 82,
      neuroticism: 27
    }
  },
  {
    id: 'enfj-2',
    number: 20,
    mbti: 'ENFJ',
    reti: '2',
    retiType: '도우미형',
    name: '공감의 사제',
    nameEn: 'Priest of Empathy',
    tagline: '진심으로 사람의 상처를 치유하는 소통가',
    description: '그는 진심 어린 공감으로 사람들의 상처를 치유하는 사제 같은 존재다. 말보다 마음으로 듣고, 위로보다 방향을 제시한다. 감정의 언어를 자유롭게 구사하며, 인간의 어두운 마음에 빛을 비춘다. \'당신은 혼자가 아닙니다\'가 그의 신념이다.',
    abilities: {
      openness: 85,
      conscientiousness: 77,
      extraversion: 76,
      agreeableness: 95,
      neuroticism: 30
    }
  },
  {
    id: 'enfj-3',
    number: 21,
    mbti: 'ENFJ',
    reti: '3',
    retiType: '성취형',
    name: '비전의 리더',
    nameEn: 'Leader of Vision',
    tagline: '목표를 현실로 바꾸는 카리스마적 지도자',
    description: '그는 단순한 지도자가 아닌, 사람의 마음을 움직이는 비전가다. 목표를 명확히 제시하고, 사람들을 함께 이끌며 현실로 만들어낸다. 그의 카리스마는 명령이 아니라 신뢰에서 비롯된다. 따뜻한 리더십으로 세상을 변화시키는 추진형 인물.',
    abilities: {
      openness: 84,
      conscientiousness: 85,
      extraversion: 90,
      agreeableness: 80,
      neuroticism: 28
    }
  },
  {
    id: 'enfj-4',
    number: 22,
    mbti: 'ENFJ',
    reti: '4',
    retiType: '개성형',
    name: '감정의 점화자',
    nameEn: 'Igniter of Emotion',
    tagline: '사람의 마음에 불씨를 붙이는 영감의 메신저',
    description: '그는 사람의 마음에 불씨를 붙이는 감정의 메신저다. 공감과 표현력이 뛰어나며, 한마디의 말로도 타인을 변화시킨다. 예술과 철학, 감성과 리더십이 융합된 인물로, 그의 존재 자체가 사람들에게 영감이 된다.',
    abilities: {
      openness: 92,
      conscientiousness: 74,
      extraversion: 83,
      agreeableness: 86,
      neuroticism: 32
    }
  },
  {
    id: 'enfj-5',
    number: 23,
    mbti: 'ENFJ',
    reti: '5',
    retiType: '탐구형',
    name: '직관의 탐험가',
    nameEn: 'Explorer of Intuition',
    tagline: '사람의 심리를 통찰하는 깊은 관찰자',
    description: '그는 인간 심리의 흐름을 직관으로 읽어내는 탐험가다. 사람의 말보다 마음의 패턴을 본다. 그는 관찰자이자 분석가이며, 감정의 구조를 언어화하는 능력을 지녔다. 통찰력으로 집단의 방향을 조정하는 \'정신의 나침반\'.',
    abilities: {
      openness: 90,
      conscientiousness: 80,
      extraversion: 72,
      agreeableness: 78,
      neuroticism: 25
    }
  },
  {
    id: 'enfj-6',
    number: 24,
    mbti: 'ENFJ',
    reti: '6',
    retiType: '충성형',
    name: '신념의 동반자',
    nameEn: 'Companion of Faith',
    tagline: '신뢰와 헌신으로 공동체를 지탱하는 리더',
    description: '그는 신뢰와 헌신으로 공동체를 지탱하는 리더다. 흔들림 속에서도 믿음을 지키며, 자신의 신념으로 사람들을 보호한다. 감정의 일관성이 곧 리더십의 힘이다. 관계와 원칙 사이의 균형을 누구보다 잘 아는 인물.',
    abilities: {
      openness: 80,
      conscientiousness: 87,
      extraversion: 75,
      agreeableness: 90,
      neuroticism: 26
    }
  },
  {
    id: 'enfj-7',
    number: 25,
    mbti: 'ENFJ',
    reti: '7',
    retiType: '열정형',
    name: '희망의 불꽃',
    nameEn: 'Flame of Hope',
    tagline: '타인의 가능성을 끌어올리는 열정적 조언자',
    description: '그는 타인의 가능성을 발견하고 끌어올리는 열정적 조언자다. 진심 어린 격려 한마디로 사람들의 인생을 바꾼다. 감정의 열정과 리더십의 힘을 겸비한 그에게, 사람들은 \'희망의 불씨\'를 본다.',
    abilities: {
      openness: 87,
      conscientiousness: 78,
      extraversion: 88,
      agreeableness: 88,
      neuroticism: 31
    }
  },
  {
    id: 'enfj-8',
    number: 26,
    mbti: 'ENFJ',
    reti: '8',
    retiType: '도전형',
    name: '정의의 개혁가',
    nameEn: 'Reformer of Justice',
    tagline: '사람을 위해 싸우는 리더십의 투사',
    description: '그는 약자를 위해 싸우는 리더십의 투사다. 감정이 아닌 정의감으로 움직이며, 불합리한 세상을 바꾸기 위해 나선다. 부드러움 속의 강인함, 이상 속의 실천력 — 그는 진심으로 세상을 개혁하는 영웅이다.',
    abilities: {
      openness: 86,
      conscientiousness: 84,
      extraversion: 85,
      agreeableness: 76,
      neuroticism: 29
    }
  },
  {
    id: 'enfj-9',
    number: 27,
    mbti: 'ENFJ',
    reti: '9',
    retiType: '평화형',
    name: '조화의 중재자',
    nameEn: 'Mediator of Harmony',
    tagline: '감정의 흐름으로 집단의 균형을 유지하는 통합자',
    description: '그는 집단의 갈등을 감정의 흐름으로 읽어내고, 균형을 만들어내는 통합자다. 사람들 간의 관계를 조율하며, 의견 차이 속에서도 공동의 조화를 이끈다. 그의 리더십은 \'조용한 조화\' 속에서 가장 빛난다.',
    abilities: {
      openness: 83,
      conscientiousness: 81,
      extraversion: 78,
      agreeableness: 93,
      neuroticism: 24
    }
  },

  // ENTP × RETI (028-036)
  {
    id: 'entp-1',
    number: 28,
    mbti: 'ENTP',
    reti: '1',
    retiType: '완벽형',
    name: '논리의 혁신가',
    nameEn: 'Innovator of Logic',
    tagline: '완전한 이성을 바탕으로 새 질서를 구축하는 전략가',
    description: '그는 완벽한 논리를 바탕으로 새로운 질서를 구축하는 전략가다. 기존 체계의 결함을 발견하면 즉시 대안을 설계하고, 모든 변수를 통제하려 한다. 그의 사고는 수학처럼 정교하고, 미래지향적이다. 이성으로 세상을 재구성하는 혁신의 설계자.',
    abilities: {
      openness: 95,
      conscientiousness: 82,
      extraversion: 78,
      agreeableness: 66,
      neuroticism: 30
    }
  },
  {
    id: 'entp-2',
    number: 29,
    mbti: 'ENTP',
    reti: '2',
    retiType: '도우미형',
    name: '아이디어의 촉진가',
    nameEn: 'Facilitator of Ideas',
    tagline: '유쾌한 발상으로 사람들을 하나로 모으는 협력가',
    description: '그는 유쾌한 발상으로 사람들을 하나로 묶는다. 대화 속에서 아이디어가 연쇄적으로 피어나고, 사람들은 그의 에너지에 감염된다. 논리보다 유머, 설득보다 공감을 통해 세상을 바꾸는, "생각의 촉매제" 같은 존재.',
    abilities: {
      openness: 93,
      conscientiousness: 70,
      extraversion: 90,
      agreeableness: 83,
      neuroticism: 32
    }
  },
  {
    id: 'entp-3',
    number: 30,
    mbti: 'ENTP',
    reti: '3',
    retiType: '성취형',
    name: '지식의 발명가',
    nameEn: 'Inventor of Knowledge',
    tagline: '개념을 현실로 구현하는 창조적 실행가',
    description: '그는 아이디어를 현실로 구현하는 발명형 실행가다. 새로운 개념을 만들고, 이를 구체적인 시스템이나 제품으로 완성시킨다. \'말보다 실험\', \'생각보다 구현\'을 중시하며, 늘 세상의 빈틈을 기회로 본다.',
    abilities: {
      openness: 91,
      conscientiousness: 84,
      extraversion: 81,
      agreeableness: 70,
      neuroticism: 28
    }
  },
  {
    id: 'entp-4',
    number: 31,
    mbti: 'ENTP',
    reti: '4',
    retiType: '개성형',
    name: '자유의 설계자',
    nameEn: 'Designer of Freedom',
    tagline: '상상으로 경계를 허무는 무한 발상가',
    description: '그는 틀을 깨는 발상가이자 자유의 상징이다. 세상의 모든 경계는 그에게 \'도전 대상\'일 뿐. 현실과 이상, 과학과 예술을 넘나들며, 완전히 새로운 패러다임을 설계한다. "생각의 혁명가"이자 "상상력의 해방자".',
    abilities: {
      openness: 98,
      conscientiousness: 68,
      extraversion: 85,
      agreeableness: 72,
      neuroticism: 35
    }
  },
  {
    id: 'entp-5',
    number: 32,
    mbti: 'ENTP',
    reti: '5',
    retiType: '탐구형',
    name: '논리의 사냥꾼',
    nameEn: 'Hunter of Logic',
    tagline: '질문으로 세상의 이면을 해부하는 철학가',
    description: '그는 질문으로 세상의 이면을 해부하는 철학가다. "왜?"라는 단어로 시작해 "그렇다면?"으로 끝난다. 세상의 논리를 끊임없이 실험하며, 고정관념을 논리로 파괴한다. 새로운 진리를 발견하기 위한 끝없는 사냥꾼.',
    abilities: {
      openness: 94,
      conscientiousness: 76,
      extraversion: 74,
      agreeableness: 68,
      neuroticism: 27
    }
  },
  {
    id: 'entp-6',
    number: 33,
    mbti: 'ENTP',
    reti: '6',
    retiType: '충성형',
    name: '개혁의 설계자',
    nameEn: 'Designer of Reform',
    tagline: '변화를 논리로 이끄는 시스템적 혁신가',
    description: '그는 변화를 논리로 이끄는 시스템 개혁가다. 혼란 속에서도 원리를 찾아내고, 논리적 근거로 사람들을 설득한다. 겉보기엔 반항적이지만, 실제로는 \'더 나은 질서\'를 위한 충성된 혁신가다.',
    abilities: {
      openness: 88,
      conscientiousness: 86,
      extraversion: 79,
      agreeableness: 71,
      neuroticism: 26
    }
  },
  {
    id: 'entp-7',
    number: 34,
    mbti: 'ENTP',
    reti: '7',
    retiType: '열정형',
    name: '영감의 발화자',
    nameEn: 'Igniter of Inspiration',
    tagline: '아이디어로 세상을 점화하는 창조의 불꽃',
    description: '그는 아이디어의 불꽃을 세상에 퍼뜨리는 전도자다. 대화는 그의 무기, 유머는 그의 연료다. 감정이 아닌 논리로 열정을 전달하며, 지적인 자극을 통해 사람들을 끌어올린다. "창조의 불꽃"이라는 이름이 가장 어울리는 인물.',
    abilities: {
      openness: 96,
      conscientiousness: 73,
      extraversion: 88,
      agreeableness: 75,
      neuroticism: 31
    }
  },
  {
    id: 'entp-8',
    number: 35,
    mbti: 'ENTP',
    reti: '8',
    retiType: '도전형',
    name: '사상의 전사',
    nameEn: 'Warrior of Thought',
    tagline: '논리로 싸우고 혁신으로 승리하는 개척자',
    description: '그는 논리로 싸우고 혁신으로 승리하는 개척자다. 불가능을 \'논리의 전장\'으로 보고, 설득과 토론을 통해 세상을 움직인다. 타협보다 진실을, 안정보다 진보를 택하는 싸움꾼. 말과 생각이 그의 무기다.',
    abilities: {
      openness: 92,
      conscientiousness: 80,
      extraversion: 87,
      agreeableness: 62,
      neuroticism: 29
    }
  },
  {
    id: 'entp-9',
    number: 36,
    mbti: 'ENTP',
    reti: '9',
    retiType: '평화형',
    name: '유머의 중재자',
    nameEn: 'Mediator of Humor',
    tagline: '대립을 유쾌하게 풀어내는 대화의 연금술사',
    description: '그는 유쾌함으로 갈등을 풀어내는 대화의 연금술사다. 긴장을 웃음으로 녹이고, 냉정한 상황에도 위트를 섞는다. 그는 단순히 말을 잘하는 사람이 아니라, \'분위기를 바꾸는 지성\'이다. 웃음 속에 진심을 담는 평화의 혁신가.',
    abilities: {
      openness: 90,
      conscientiousness: 75,
      extraversion: 89,
      agreeableness: 86,
      neuroticism: 25
    }
  },

  // INFJ × RETI (037-045)
  {
    id: 'infj-1',
    number: 37,
    mbti: 'INFJ',
    reti: '1',
    retiType: '완벽형',
    name: '통찰의 성직자',
    nameEn: 'Priest of Insight',
    tagline: '완전한 진리를 찾아 인간을 인도하는 내면의 예언자',
    description: '그는 완전한 진리를 찾아 인간을 인도하는 내면의 예언자다. 세상의 불완전함 속에서도 본질을 꿰뚫는 눈을 가졌다. 논리보다 의미, 사실보다 진실을 추구하며, 인간의 영혼이 성장할 수 있는 길을 설계한다. 그의 목표는 \'깨달음을 통한 구원\'.',
    abilities: {
      openness: 93,
      conscientiousness: 85,
      extraversion: 38,
      agreeableness: 80,
      neuroticism: 28
    }
  },
  {
    id: 'infj-2',
    number: 38,
    mbti: 'INFJ',
    reti: '2',
    retiType: '도우미형',
    name: '감정의 안내자',
    nameEn: 'Guide of Emotion',
    tagline: '사람의 마음을 직관적으로 이해하는 조언자',
    description: '그는 사람의 마음을 직관적으로 이해하는 따뜻한 조언자다. 말보다 표정을, 표정보다 기류를 읽는다. 사람의 감정이 흐트러질 때면 그는 조용히 그 균형을 되돌린다. 직관과 공감으로 세상을 치유하는 감정의 나침반.',
    abilities: {
      openness: 88,
      conscientiousness: 78,
      extraversion: 42,
      agreeableness: 93,
      neuroticism: 26
    }
  },
  {
    id: 'infj-3',
    number: 39,
    mbti: 'INFJ',
    reti: '3',
    retiType: '성취형',
    name: '직관의 리더',
    nameEn: 'Leader of Intuition',
    tagline: '명확한 비전으로 집단의 방향을 제시하는 설계자',
    description: '그는 명확한 비전으로 집단의 방향을 제시하는 설계자다. 이상과 현실의 경계를 잇는 다리 역할을 하며, 감정적 설득력과 이성적 판단력을 동시에 갖춘다. 조용하지만 결단력 있는, 영적 리더십의 화신.',
    abilities: {
      openness: 89,
      conscientiousness: 84,
      extraversion: 65,
      agreeableness: 77,
      neuroticism: 29
    }
  },
  {
    id: 'infj-4',
    number: 40,
    mbti: 'INFJ',
    reti: '4',
    retiType: '개성형',
    name: '내면의 예언자',
    nameEn: 'Prophet of the Inner Self',
    tagline: '감정과 통찰을 융합한 영적 창조자',
    description: '그는 감정과 통찰을 융합한 영적 창조자다. 세상의 고통을 자신의 내면에서 다시 해석하고, 그것을 예술이나 철학으로 승화시킨다. 사람들은 그의 작품 속에서 진리를 발견한다. 그는 "고독 속의 빛"이다.',
    abilities: {
      openness: 95,
      conscientiousness: 70,
      extraversion: 40,
      agreeableness: 79,
      neuroticism: 32
    }
  },
  {
    id: 'infj-5',
    number: 41,
    mbti: 'INFJ',
    reti: '5',
    retiType: '탐구형',
    name: '심리의 탐험가',
    nameEn: 'Explorer of Psychology',
    tagline: '인간의 내면을 깊이 탐색하는 연구자',
    description: '그는 인간의 내면을 깊이 탐색하는 심리의 연구자다. 타인의 감정 구조를 해부하고, 무의식의 패턴을 찾아낸다. 감정의 과학자이자 마음의 철학자. 그의 눈은 겉이 아닌 \'영혼의 데이터\'를 본다.',
    abilities: {
      openness: 91,
      conscientiousness: 83,
      extraversion: 47,
      agreeableness: 73,
      neuroticism: 24
    }
  },
  {
    id: 'infj-6',
    number: 42,
    mbti: 'INFJ',
    reti: '6',
    retiType: '충성형',
    name: '신념의 지킴이',
    nameEn: 'Keeper of Faith',
    tagline: '자신의 철학으로 세상을 보호하는 수호자',
    description: '그는 자신의 철학으로 세상을 지키는 수호자다. 불의와 타협하지 않으며, 내면의 신념에 따라 행동한다. 감정적이지만 단호하고, 조용하지만 굳건하다. 세상의 정의를 내면에서부터 수호하는 \'신념의 방패\'.',
    abilities: {
      openness: 87,
      conscientiousness: 88,
      extraversion: 52,
      agreeableness: 82,
      neuroticism: 27
    }
  },
  {
    id: 'infj-7',
    number: 43,
    mbti: 'INFJ',
    reti: '7',
    retiType: '열정형',
    name: '직관의 불꽃',
    nameEn: 'Flame of Intuition',
    tagline: '이상을 현실로 점화하는 내면의 도화선',
    description: '그는 이상을 현실로 점화하는 내면의 도화선이다. 비전을 가지고 세상을 설득하며, 자신이 믿는 방향으로 사람들을 끌어올린다. 감정의 불꽃과 통찰의 빛이 하나로 합쳐진 존재. 말보다 \'기운\'으로 세상을 움직인다.',
    abilities: {
      openness: 92,
      conscientiousness: 75,
      extraversion: 70,
      agreeableness: 85,
      neuroticism: 31
    }
  },
  {
    id: 'infj-8',
    number: 44,
    mbti: 'INFJ',
    reti: '8',
    retiType: '도전형',
    name: '진리의 투사',
    nameEn: 'Warrior of Truth',
    tagline: '정의를 위해 싸우는 통찰의 전사',
    description: '그는 정의를 위해 싸우는 통찰의 전사다. 논쟁을 피하지 않고, 신념으로 불의에 맞선다. 싸움의 이유가 명예가 아닌 \'진리\'에 있다. 감정은 그의 무기이자 방패이며, 그의 신념은 언제나 사람을 향한다.',
    abilities: {
      openness: 89,
      conscientiousness: 82,
      extraversion: 63,
      agreeableness: 71,
      neuroticism: 30
    }
  },
  {
    id: 'infj-9',
    number: 45,
    mbti: 'INFJ',
    reti: '9',
    retiType: '평화형',
    name: '조화의 중재자',
    nameEn: 'Mediator of Harmony',
    tagline: '인간 관계의 흐름을 읽어내는 심리적 조율자',
    description: '그는 인간 관계의 흐름을 읽어내고 감정의 균형을 회복시키는 조율자다. 대립의 중심에서도 침착하게 양쪽의 진심을 이해하고 조화로 이끈다. 그는 \'감정의 평화학자\'이자 \'공감의 전략가\'다.',
    abilities: {
      openness: 90,
      conscientiousness: 79,
      extraversion: 55,
      agreeableness: 95,
      neuroticism: 25
    }
  },

  // INTJ × RETI (046-054)
  {
    id: 'intj-1',
    number: 46,
    mbti: 'INTJ',
    reti: '1',
    retiType: '완벽형',
    name: '계획의 마법사',
    nameEn: 'Wizard of Planning',
    tagline: '논리와 효율로 완벽한 세상을 설계하는 전략가',
    description: '그는 논리와 효율로 완벽한 세상을 설계하는 전략가다. 모든 변수는 그의 계산 안에 존재하며, 혼돈조차 계획의 일부로 다룬다. 감정이 아닌 구조로 세상을 움직이며, 실행보다 설계를 중시한다. 그의 세상은 질서 그 자체다.',
    abilities: {
      openness: 90,
      conscientiousness: 94,
      extraversion: 45,
      agreeableness: 60,
      neuroticism: 23
    }
  },
  {
    id: 'intj-2',
    number: 47,
    mbti: 'INTJ',
    reti: '2',
    retiType: '도우미형',
    name: '지식의 멘토',
    nameEn: 'Mentor of Knowledge',
    tagline: '체계로 타인의 가능성을 열어주는 교육자',
    description: '그는 체계와 논리로 타인의 가능성을 열어주는 교육자다. 감정적 공감 대신, 냉철한 조언으로 성장을 돕는다. 그의 친절은 \'정확한 피드백\'에 있다. 지식으로 사람을 키우는 진정한 멘토.',
    abilities: {
      openness: 88,
      conscientiousness: 87,
      extraversion: 50,
      agreeableness: 79,
      neuroticism: 25
    }
  },
  {
    id: 'intj-3',
    number: 48,
    mbti: 'INTJ',
    reti: '3',
    retiType: '성취형',
    name: '목표의 설계자',
    nameEn: 'Designer of Goals',
    tagline: '장기적 안목으로 비전을 완성하는 기획자',
    description: '그는 장기적 안목으로 비전을 완성하는 기획자다. 오늘보다 5년 뒤를, 효율보다 구조를 본다. 성취를 단순한 결과가 아닌 \'시스템적 진보\'로 정의한다. 그가 세운 계획은 단단하고, 그 계획이 곧 현실이 된다.',
    abilities: {
      openness: 89,
      conscientiousness: 92,
      extraversion: 52,
      agreeableness: 66,
      neuroticism: 22
    }
  },
  {
    id: 'intj-4',
    number: 49,
    mbti: 'INTJ',
    reti: '4',
    retiType: '개성형',
    name: '사고의 연금술사',
    nameEn: 'Alchemist of Thought',
    tagline: '냉철한 분석 속에 창조성을 녹여내는 혁신가',
    description: '그는 냉철한 분석 속에 창조성을 녹여내는 혁신가다. 논리와 예술을 동시에 다루며, 구조 속에서 자유를 만들어낸다. 그에게 생각은 금속이고, 아이디어는 불이다 — 그는 \'사고의 연금술사\'다.',
    abilities: {
      openness: 97,
      conscientiousness: 80,
      extraversion: 55,
      agreeableness: 67,
      neuroticism: 30
    }
  },
  {
    id: 'intj-5',
    number: 50,
    mbti: 'INTJ',
    reti: '5',
    retiType: '탐구형',
    name: '논리의 현자',
    nameEn: 'Sage of Logic',
    tagline: '데이터 속에서 패턴을 읽어내는 분석가',
    description: '그는 데이터 속에서 패턴을 읽어내는 분석가이자 현자다. 세상은 그에게 거대한 수식이며, 인간의 감정조차 변수가 된다. 관찰과 예측의 대가로, 그는 미래의 윤곽을 그린다.',
    abilities: {
      openness: 93,
      conscientiousness: 89,
      extraversion: 46,
      agreeableness: 61,
      neuroticism: 19
    }
  },
  {
    id: 'intj-6',
    number: 51,
    mbti: 'INTJ',
    reti: '6',
    retiType: '충성형',
    name: '체계의 수호자',
    nameEn: 'Guardian of Systems',
    tagline: '질서와 원칙으로 조직을 지탱하는 관리자',
    description: '그는 질서와 원칙으로 조직을 지탱하는 관리자다. 혼란을 혐오하고, 계획 없는 즉흥을 경계한다. 모든 행동에는 목적이, 모든 규칙에는 이유가 있다. 그는 시스템 그 자체로 충성한다.',
    abilities: {
      openness: 82,
      conscientiousness: 95,
      extraversion: 48,
      agreeableness: 70,
      neuroticism: 24
    }
  },
  {
    id: 'intj-7',
    number: 52,
    mbti: 'INTJ',
    reti: '7',
    retiType: '열정형',
    name: '이성의 불꽃',
    nameEn: 'Flame of Reason',
    tagline: '목표를 향한 추진력으로 시스템을 완성하는 리더',
    description: '그는 냉정한 머리와 뜨거운 심장을 동시에 지닌 리더다. 감정은 목표를 위해 제어되며, 추진력은 이성으로 연료를 얻는다. 그는 "계산된 열정"으로 팀을 움직이는 카리스마적 전략가.',
    abilities: {
      openness: 90,
      conscientiousness: 88,
      extraversion: 72,
      agreeableness: 73,
      neuroticism: 26
    }
  },
  {
    id: 'intj-8',
    number: 53,
    mbti: 'INTJ',
    reti: '8',
    retiType: '도전형',
    name: '전략의 지휘관',
    nameEn: 'Commander of Strategy',
    tagline: '구조와 힘으로 방향을 통제하는 설계자',
    description: '그는 구조와 힘으로 방향을 통제하는 설계자다. 목표를 향해 냉정하게 진군하며, 감정보다 원칙으로 명령한다. 전장에선 판단으로, 혼란 속에선 질서로 승리한다. 그는 \'전략의 사령관\'이다.',
    abilities: {
      openness: 87,
      conscientiousness: 90,
      extraversion: 68,
      agreeableness: 59,
      neuroticism: 21
    }
  },
  {
    id: 'intj-9',
    number: 54,
    mbti: 'INTJ',
    reti: '9',
    retiType: '평화형',
    name: '지식의 조율자',
    nameEn: 'Coordinator of Knowledge',
    tagline: '사고와 감정의 균형을 유지하는 중재자',
    description: '그는 사고와 감정의 균형을 유지하는 중재자다. 구조 속에서 감정을 이해하고, 감정 속에서 논리를 찾는다. 극단의 논리주의자들 사이에서 조화의 언어를 구사한다. 그는 냉철한 중립자다.',
    abilities: {
      openness: 89,
      conscientiousness: 83,
      extraversion: 63,
      agreeableness: 85,
      neuroticism: 23
    }
  },

  // ESTJ × RETI (082-090)
  {
    id: 'estj-1',
    number: 82,
    mbti: 'ESTJ',
    reti: '1',
    retiType: '완벽형',
    name: '질서의 건축가',
    nameEn: 'Architect of Order',
    tagline: '완벽한 체계로 조직을 설계하는 규율의 마스터',
    description: '그는 완벽한 체계로 조직을 설계하는 규율의 마스터다. 모든 것에는 정해진 자리가 있고, 모든 규칙에는 이유가 있다. 혼돈을 용납하지 않으며, 효율과 질서로 세상을 움직인다. 그의 리더십은 명확하고 단단하다.',
    abilities: {
      openness: 72,
      conscientiousness: 96,
      extraversion: 82,
      agreeableness: 75,
      neuroticism: 14
    }
  },
  {
    id: 'estj-2',
    number: 83,
    mbti: 'ESTJ',
    reti: '2',
    retiType: '도우미형',
    name: '책임의 수행자',
    nameEn: 'Executor of Responsibility',
    tagline: '헌신과 실행력으로 조직을 지탱하는 관리자',
    description: '그는 헌신과 실행력으로 조직을 지탱하는 관리자다. 말보다 행동으로, 약속보다 결과로 신뢰를 쌓는다. 타인을 위해 체계를 만들고, 그 체계로 사람들을 보호한다. 그의 도움은 구조화된 지원이다.',
    abilities: {
      openness: 75,
      conscientiousness: 90,
      extraversion: 85,
      agreeableness: 87,
      neuroticism: 16
    }
  },
  {
    id: 'estj-3',
    number: 84,
    mbti: 'ESTJ',
    reti: '3',
    retiType: '성취형',
    name: '실행의 사령관',
    nameEn: 'Commander of Execution',
    tagline: '목표를 체계적으로 달성하는 추진형 리더',
    description: '그는 목표를 체계적으로 달성하는 추진형 리더다. 비전을 구조로 바꾸고, 계획을 성과로 전환시킨다. 효율성과 결과를 동시에 추구하며, 조직을 승리로 이끈다. 그의 성공은 설계된 것이다.',
    abilities: {
      openness: 78,
      conscientiousness: 94,
      extraversion: 88,
      agreeableness: 76,
      neuroticism: 15
    }
  },
  {
    id: 'estj-4',
    number: 85,
    mbti: 'ESTJ',
    reti: '4',
    retiType: '개성형',
    name: '구조의 창조자',
    nameEn: 'Creator of Structure',
    tagline: '논리와 효율을 예술로 승화시키는 실용가',
    description: '그는 논리와 효율을 예술로 승화시키는 실용가다. 틀에 갇히지 않되, 구조 속에서 자유를 찾는다. \'질서\'와 \'창의\'가 동시에 존재할 수 있음을 증명하는 리더형 장인이다.',
    abilities: {
      openness: 86,
      conscientiousness: 88,
      extraversion: 76,
      agreeableness: 70,
      neuroticism: 20
    }
  },
  {
    id: 'estj-5',
    number: 86,
    mbti: 'ESTJ',
    reti: '5',
    retiType: '탐구형',
    name: '원리의 분석가',
    nameEn: 'Analyst of Principles',
    tagline: '데이터와 근거로 시스템을 설계하는 검증자',
    description: '그는 데이터와 근거로 시스템을 설계하는 검증자다. 감이 아닌 사실, 직관이 아닌 논리를 믿는다. 문제를 분석해 \'재현 가능한 성공\'을 구축한다. 그는 \'효율의 과학자\'다.',
    abilities: {
      openness: 82,
      conscientiousness: 92,
      extraversion: 68,
      agreeableness: 65,
      neuroticism: 17
    }
  },
  {
    id: 'estj-6',
    number: 87,
    mbti: 'ESTJ',
    reti: '6',
    retiType: '충성형',
    name: '규율의 수호자',
    nameEn: 'Guardian of Discipline',
    tagline: '약속과 신뢰로 조직을 보호하는 관리자',
    description: '그는 약속과 신뢰로 조직을 보호하는 관리자다. 법과 질서를 수단이 아닌 도덕으로 여긴다. 혼란을 경계하고, 일관된 원칙으로 리더십의 본보기를 보인다.',
    abilities: {
      openness: 67,
      conscientiousness: 96,
      extraversion: 72,
      agreeableness: 77,
      neuroticism: 16
    }
  },
  {
    id: 'estj-7',
    number: 88,
    mbti: 'ESTJ',
    reti: '7',
    retiType: '열정형',
    name: '추진의 기관차',
    nameEn: 'Locomotive of Drive',
    tagline: '도전과 실행으로 사람을 이끄는 추진형 리더',
    description: '그는 도전과 실행으로 사람을 이끄는 추진형 리더다. 두려움을 에너지로 바꾸고, 목표를 위해 돌파한다. 그가 지나간 자리엔 성취가 남는다.',
    abilities: {
      openness: 78,
      conscientiousness: 90,
      extraversion: 89,
      agreeableness: 74,
      neuroticism: 20
    }
  },
  {
    id: 'estj-8',
    number: 89,
    mbti: 'ESTJ',
    reti: '8',
    retiType: '도전형',
    name: '강철의 전략가',
    nameEn: 'Strategist of Steel',
    tagline: '전장의 질서를 통제하는 단단한 리더십의 구현체',
    description: '그는 전장의 질서를 통제하는 단단한 리더십의 구현체다. 위기일수록 냉철하게 판단하고, 흔들림 없는 결정으로 승리를 이끈다. 그는 리더의 강철 신념을 상징한다.',
    abilities: {
      openness: 74,
      conscientiousness: 93,
      extraversion: 84,
      agreeableness: 66,
      neuroticism: 13
    }
  },
  {
    id: 'estj-9',
    number: 90,
    mbti: 'ESTJ',
    reti: '9',
    retiType: '평화형',
    name: '협력의 조정자',
    nameEn: 'Coordinator of Cooperation',
    tagline: '갈등을 질서로 전환하는 조직의 안정자',
    description: '그는 갈등을 질서로 전환하는 조직의 안정자다. 대립보다는 조화를, 경쟁보다는 효율을 선택한다. 그의 리더십은 강하지만 부드럽다. "리더십의 본질은 설득"임을 아는 자다.',
    abilities: {
      openness: 80,
      conscientiousness: 88,
      extraversion: 79,
      agreeableness: 88,
      neuroticism: 17
    }
  },

  // ESFP × RETI (091-099)
  {
    id: 'esfp-1',
    number: 91,
    mbti: 'ESFP',
    reti: '1',
    retiType: '완벽형',
    name: '무대의 조율자',
    nameEn: 'Coordinator of Stage',
    tagline: '완벽한 타이밍으로 감정을 전달하는 연출가',
    description: '그는 완벽한 타이밍으로 감정을 전달하는 연출가다. 감각 하나, 표정 하나에도 의도가 있다. 즉흥 속에서도 구조를 읽고, 관객의 심리를 완벽히 통제한다. 그에게 무대는 과학이다.',
    abilities: {
      openness: 84,
      conscientiousness: 82,
      extraversion: 90,
      agreeableness: 88,
      neuroticism: 25
    }
  },
  {
    id: 'esfp-2',
    number: 92,
    mbti: 'ESFP',
    reti: '2',
    retiType: '도우미형',
    name: '행복의 전달자',
    nameEn: 'Deliverer of Happiness',
    tagline: '웃음과 에너지로 사람을 치유하는 사람',
    description: '그는 웃음과 에너지로 사람을 치유하는 사람이다. 감정의 흐름을 직관적으로 읽고, 밝은 에너지로 주변의 공기를 바꾼다. 그의 존재 자체가 \'정서적 해방\'이다.',
    abilities: {
      openness: 80,
      conscientiousness: 77,
      extraversion: 94,
      agreeableness: 95,
      neuroticism: 22
    }
  },
  {
    id: 'esfp-3',
    number: 93,
    mbti: 'ESFP',
    reti: '3',
    retiType: '성취형',
    name: '경험의 창조자',
    nameEn: 'Creator of Experience',
    tagline: '지금 이 순간을 예술로 바꾸는 행동가',
    description: '그는 지금 이 순간을 예술로 바꾸는 행동가다. 생각보다 몸이 먼저 움직이고, 계획보다 순간의 몰입을 택한다. 그의 삶은 \'즉흥의 예술\'이자 \'행동의 무대\'다.',
    abilities: {
      openness: 83,
      conscientiousness: 81,
      extraversion: 97,
      agreeableness: 84,
      neuroticism: 23
    }
  },
  {
    id: 'esfp-4',
    number: 94,
    mbti: 'ESFP',
    reti: '4',
    retiType: '개성형',
    name: '자유의 예술가',
    nameEn: 'Artist of Freedom',
    tagline: '감각과 리듬으로 자신을 표현하는 자유혼',
    description: '그는 감각과 리듬으로 자신을 표현하는 자유혼이다. 세상의 기준보다 자신의 감정을 믿는다. 색, 소리, 움직임으로 내면을 노래한다. 그의 삶은 곧 퍼포먼스다.',
    abilities: {
      openness: 95,
      conscientiousness: 74,
      extraversion: 92,
      agreeableness: 82,
      neuroticism: 27
    }
  },
  {
    id: 'esfp-5',
    number: 95,
    mbti: 'ESFP',
    reti: '5',
    retiType: '탐구형',
    name: '감정의 연구자',
    nameEn: 'Researcher of Emotion',
    tagline: '사람의 마음을 감각으로 이해하는 감성 분석가',
    description: '그는 사람의 마음을 감각으로 이해하는 감성 분석가다. 감정의 미묘한 진동을 관찰하며, 타인의 표정 속에서 진심을 읽어낸다. 이성보다 감각으로 세상을 해석하는 심리형 예술가.',
    abilities: {
      openness: 90,
      conscientiousness: 78,
      extraversion: 79,
      agreeableness: 87,
      neuroticism: 24
    }
  },
  {
    id: 'esfp-6',
    number: 96,
    mbti: 'ESFP',
    reti: '6',
    retiType: '충성형',
    name: '무대의 지킴이',
    nameEn: 'Keeper of Stage',
    tagline: '자신과 타인의 약속을 지키는 따뜻한 퍼포머',
    description: '그는 자신과 타인의 약속을 지키는 따뜻한 퍼포머다. 무대 뒤의 신뢰와 팀워크를 중요시하며, 동료를 위해 자신을 기꺼이 희생한다. \'공연은 함께 만든다\'는 그의 철학.',
    abilities: {
      openness: 78,
      conscientiousness: 88,
      extraversion: 85,
      agreeableness: 93,
      neuroticism: 20
    }
  },
  {
    id: 'esfp-7',
    number: 97,
    mbti: 'ESFP',
    reti: '7',
    retiType: '열정형',
    name: '열정의 불꽃',
    nameEn: 'Flame of Passion',
    tagline: '세상에 활기를 불어넣는 에너지의 중심체',
    description: '그는 세상에 활기를 불어넣는 에너지의 중심체다. 사람들을 모으고, 분위기를 점화하며, 공간을 살아 숨 쉬게 만든다. 그는 에너지의 원천, 감정의 태양이다.',
    abilities: {
      openness: 87,
      conscientiousness: 82,
      extraversion: 99,
      agreeableness: 90,
      neuroticism: 26
    }
  },
  {
    id: 'esfp-8',
    number: 98,
    mbti: 'ESFP',
    reti: '8',
    retiType: '도전형',
    name: '감정의 전사',
    nameEn: 'Warrior of Emotion',
    tagline: '즐거움으로 위기를 극복하는 낙천적 행동가',
    description: '그는 즐거움으로 위기를 극복하는 낙천적 행동가다. 두려움 앞에서도 웃고, 절망 속에서도 리듬을 잃지 않는다. 그의 강함은 유쾌함에서 나온다.',
    abilities: {
      openness: 82,
      conscientiousness: 84,
      extraversion: 95,
      agreeableness: 80,
      neuroticism: 19
    }
  },
  {
    id: 'esfp-9',
    number: 99,
    mbti: 'ESFP',
    reti: '9',
    retiType: '평화형',
    name: '조화의 댄서',
    nameEn: 'Dancer of Harmony',
    tagline: '감정의 흐름을 몸으로 표현하는 균형의 예술가',
    description: '그는 감정의 흐름을 몸으로 표현하는 균형의 예술가다. 감정의 충돌을 예술로 승화시키며, 슬픔조차 아름답게 만든다. 그의 춤은 화해의 언어다.',
    abilities: {
      openness: 89,
      conscientiousness: 80,
      extraversion: 87,
      agreeableness: 96,
      neuroticism: 22
    }
  },

  // ENFP × RETI (100번)
  {
    id: 'enfp-1',
    number: 100,
    mbti: 'ENFP',
    reti: '1',
    retiType: '완벽형',
    name: '창의의 규율자',
    nameEn: 'Disciplinarian of Creativity',
    tagline: '자유 속에서도 완벽한 질서를 세우는 영감가',
    description: '그는 자유 속에서도 완벽한 질서를 세우는 영감가다. 혼돈의 상상 속에서도 균형을 잃지 않는다. 아이디어를 체계화해 실행 가능한 구조로 바꾸는 능력자다. 자유와 규율의 공존을 구현한 창조형 리더.',
    abilities: {
      openness: 96,
      conscientiousness: 84,
      extraversion: 88,
      agreeableness: 86,
      neuroticism: 22
    }
  },

  // ENFP × RETI (101-108)
  {
    id: 'enfp-2',
    number: 101,
    mbti: 'ENFP',
    reti: '2',
    retiType: '도우미형',
    name: '감정의 촉진자',
    nameEn: 'Facilitator of Emotion',
    tagline: '따뜻한 공감으로 변화를 이끄는 영감형 리더',
    description: '그는 따뜻한 공감으로 변화를 이끄는 영감형 리더다. 타인의 감정을 직관적으로 읽고, 그 감정을 긍정적 에너지로 전환시킨다. 그의 말 한마디는 사람을 움직이는 불씨가 된다.',
    abilities: {
      openness: 91,
      conscientiousness: 80,
      extraversion: 93,
      agreeableness: 94,
      neuroticism: 24
    }
  },
  {
    id: 'enfp-3',
    number: 102,
    mbti: 'ENFP',
    reti: '3',
    retiType: '성취형',
    name: '상상의 실현가',
    nameEn: 'Realizer of Imagination',
    tagline: '아이디어를 구체적 성과로 연결하는 창조가',
    description: '그는 아이디어를 구체적 성과로 연결하는 창조가다. 꿈꾸는 데서 멈추지 않고, 꿈을 실행으로 옮긴다. 창의적 비전을 현실로 만드는 능력은 예술가이자 기업가의 혼을 지녔다.',
    abilities: {
      openness: 94,
      conscientiousness: 85,
      extraversion: 90,
      agreeableness: 82,
      neuroticism: 21
    }
  },
  {
    id: 'enfp-4',
    number: 103,
    mbti: 'ENFP',
    reti: '4',
    retiType: '개성형',
    name: '영감의 불씨',
    nameEn: 'Spark of Inspiration',
    tagline: '세상에 희망의 불을 지피는 자유로운 사상가',
    description: '그는 세상에 희망의 불을 지피는 자유로운 사상가다. 규범에 얽매이지 않고, 자신만의 방식으로 세상을 바라본다. 그의 말과 행동은 늘 누군가의 인생을 바꾼다.',
    abilities: {
      openness: 98,
      conscientiousness: 75,
      extraversion: 92,
      agreeableness: 86,
      neuroticism: 27
    }
  },
  {
    id: 'enfp-5',
    number: 104,
    mbti: 'ENFP',
    reti: '5',
    retiType: '탐구형',
    name: '가능성의 탐험가',
    nameEn: 'Explorer of Possibilities',
    tagline: '마음과 세계의 경계를 넘는 정신의 여행자',
    description: '그는 마음과 세계의 경계를 넘는 정신의 여행자다. 한 가지 관점에 머물지 않고, 끝없이 새로운 의미를 탐색한다. 그는 \'생각의 항해자\'로서, 삶의 가능성을 실험한다.',
    abilities: {
      openness: 99,
      conscientiousness: 79,
      extraversion: 84,
      agreeableness: 80,
      neuroticism: 22
    }
  },
  {
    id: 'enfp-6',
    number: 105,
    mbti: 'ENFP',
    reti: '6',
    retiType: '충성형',
    name: '관계의 신봉자',
    nameEn: 'Believer of Relationships',
    tagline: '신념과 진심으로 사람을 묶는 헌신가',
    description: '그는 신념과 진심으로 사람을 묶는 헌신가다. 감정의 깊이에서 신뢰를, 인간관계 속에서 사명을 찾는다. 그는 \'사람 중심의 신앙\'을 가진 이상주의자다.',
    abilities: {
      openness: 88,
      conscientiousness: 86,
      extraversion: 85,
      agreeableness: 93,
      neuroticism: 18
    }
  },
  {
    id: 'enfp-7',
    number: 106,
    mbti: 'ENFP',
    reti: '7',
    retiType: '열정형',
    name: '비전의 불꽃',
    nameEn: 'Flame of Vision',
    tagline: '감정의 에너지로 세상을 움직이는 영혼의 점화자',
    description: '그는 감정의 에너지로 세상을 움직이는 영혼의 점화자다. 감동과 영감을 동시에 일으키며, 사람들의 잠재력을 깨운다. "세상을 바꾸는 건 언제나 불타는 마음"이라는 믿음의 화신.',
    abilities: {
      openness: 95,
      conscientiousness: 83,
      extraversion: 97,
      agreeableness: 88,
      neuroticism: 25
    }
  },
  {
    id: 'enfp-8',
    number: 107,
    mbti: 'ENFP',
    reti: '8',
    retiType: '도전형',
    name: '창조의 전사',
    nameEn: 'Warrior of Creation',
    tagline: '새로운 가치로 낡은 세계를 뒤집는 혁명가',
    description: '그는 새로운 가치로 낡은 세계를 뒤집는 혁명가다. 비판 대신 제안을, 분노 대신 창조를 선택한다. 그는 현실의 벽 앞에서도 웃으며 외친다. "내가 새로 그리면 되잖아."',
    abilities: {
      openness: 96,
      conscientiousness: 84,
      extraversion: 95,
      agreeableness: 78,
      neuroticism: 19
    }
  },
  {
    id: 'enfp-9',
    number: 108,
    mbti: 'ENFP',
    reti: '9',
    retiType: '평화형',
    name: '조화의 예언자',
    nameEn: 'Prophet of Harmony',
    tagline: '다양성 속에서 조화를 찾는 감정의 중재자',
    description: '그는 다양성 속에서 조화를 찾는 감정의 중재자다. 갈등을 감정의 이해로 녹여내며, 차이를 아름다움으로 바꾼다. 그는 "모두가 다르기에, 세상은 완전하다"고 믿는다.',
    abilities: {
      openness: 92,
      conscientiousness: 80,
      extraversion: 89,
      agreeableness: 96,
      neuroticism: 21
    }
  },

  // ENTJ × RETI (109-117)
  {
    id: 'entj-1',
    number: 109,
    mbti: 'ENTJ',
    reti: '1',
    retiType: '완벽형',
    name: '전략의 황제',
    nameEn: 'Emperor of Strategy',
    tagline: '논리와 구조로 세상을 통제하는 냉철한 지휘관',
    description: '그는 논리와 구조로 세상을 통제하는 냉철한 지휘관이다. 감정보다 효율, 우연보다 설계를 믿는다. 그는 혼돈을 체계로 바꾸고, 질서로 승리를 쌓아올린다.',
    abilities: {
      openness: 88,
      conscientiousness: 96,
      extraversion: 86,
      agreeableness: 68,
      neuroticism: 10
    }
  },
  {
    id: 'entj-2',
    number: 110,
    mbti: 'ENTJ',
    reti: '2',
    retiType: '도우미형',
    name: '체계의 멘토',
    nameEn: 'Mentor of Systems',
    tagline: '강한 리더십으로 타인의 성장을 돕는 조언자',
    description: '그는 강한 리더십으로 타인의 성장을 돕는 조언자다. 약한 자를 이끌되, 의존하게 하지 않는다. 그는 \'가르침을 통해 독립을 완성시키는\' 리더의 사부형 인물이다.',
    abilities: {
      openness: 83,
      conscientiousness: 91,
      extraversion: 85,
      agreeableness: 78,
      neuroticism: 13
    }
  },
  {
    id: 'entj-3',
    number: 111,
    mbti: 'ENTJ',
    reti: '3',
    retiType: '성취형',
    name: '비전의 통솔자',
    nameEn: 'Commander of Vision',
    tagline: '대담한 목표를 실행으로 옮기는 추진형 리더',
    description: '그는 대담한 목표를 실행으로 옮기는 추진형 리더다. 비전을 제시하고, 시스템을 만들어 결과를 현실로 만든다. 그의 성공은 우연이 아닌, 반복 가능한 설계다.',
    abilities: {
      openness: 90,
      conscientiousness: 94,
      extraversion: 88,
      agreeableness: 75,
      neuroticism: 16
    }
  },
  {
    id: 'entj-4',
    number: 112,
    mbti: 'ENTJ',
    reti: '4',
    retiType: '개성형',
    name: '통찰의 개혁가',
    nameEn: 'Reformer of Insight',
    tagline: '논리 속에서도 자신만의 세계를 세우는 혁신가',
    description: '그는 논리 속에서도 자신만의 세계를 세우는 혁신가다. 전통을 해체하고, 새 구조를 세운다. 그는 규율을 이용해 자유를 창조하는, 모순을 다루는 천재다.',
    abilities: {
      openness: 96,
      conscientiousness: 88,
      extraversion: 80,
      agreeableness: 70,
      neuroticism: 18
    }
  },
  {
    id: 'entj-5',
    number: 113,
    mbti: 'ENTJ',
    reti: '5',
    retiType: '탐구형',
    name: '이성의 관찰자',
    nameEn: 'Observer of Reason',
    tagline: '전략적 시선으로 세상의 원리를 해석하는 관찰가',
    description: '그는 전략적 시선으로 세상의 원리를 해석하는 관찰가다. 냉철한 분석력과 거시적 시각으로 세상의 움직임을 읽는다. 그는 "데이터로 예언하는 자"로 불린다.',
    abilities: {
      openness: 92,
      conscientiousness: 90,
      extraversion: 74,
      agreeableness: 68,
      neuroticism: 14
    }
  },
  {
    id: 'entj-6',
    number: 114,
    mbti: 'ENTJ',
    reti: '6',
    retiType: '충성형',
    name: '신념의 총사령관',
    nameEn: 'Commander-in-Chief of Faith',
    tagline: '조직과 약속을 끝까지 지키는 결단의 리더',
    description: '그는 조직과 약속을 끝까지 지키는 결단의 리더다. 배신을 가장 큰 죄로 여기며, 의리와 명예를 생명처럼 중시한다. 그가 맹세한 약속은 곧 \'법\'이다.',
    abilities: {
      openness: 80,
      conscientiousness: 96,
      extraversion: 82,
      agreeableness: 74,
      neuroticism: 8
    }
  },
  {
    id: 'entj-7',
    number: 115,
    mbti: 'ENTJ',
    reti: '7',
    retiType: '열정형',
    name: '추진의 화염',
    nameEn: 'Blaze of Drive',
    tagline: '열정과 논리로 세상을 재설계하는 행동가',
    description: '그는 열정과 논리로 세상을 재설계하는 행동가다. 그가 손대는 일은 반드시 움직이고, 그가 외치는 말은 반드시 변화를 일으킨다. "의지로 불가능을 태운다."',
    abilities: {
      openness: 89,
      conscientiousness: 91,
      extraversion: 95,
      agreeableness: 72,
      neuroticism: 15
    }
  },
  {
    id: 'entj-8',
    number: 116,
    mbti: 'ENTJ',
    reti: '8',
    retiType: '도전형',
    name: '권위의 전사',
    nameEn: 'Warrior of Authority',
    tagline: '위기 속에서도 흔들리지 않는 강철의 리더',
    description: '그는 위기 속에서도 흔들리지 않는 강철의 리더다. 혼란 속에서도 결단을 내리고, 패배 속에서도 체계를 지킨다. 그는 리더십의 가장 극단적 형태, \'강철의 사령관\'이다.',
    abilities: {
      openness: 84,
      conscientiousness: 94,
      extraversion: 88,
      agreeableness: 66,
      neuroticism: 10
    }
  },
  {
    id: 'entj-9',
    number: 117,
    mbti: 'ENTJ',
    reti: '9',
    retiType: '평화형',
    name: '질서의 중재자',
    nameEn: 'Mediator of Order',
    tagline: '경쟁 속에서도 균형을 유지하는 전략적 조율자',
    description: '그는 경쟁 속에서도 균형을 유지하는 전략적 조율자다. 승리보다 지속을, 속도보다 조화를 택한다. 그는 냉철함 속의 온기를 아는 \'이성의 평화주의자\'다.',
    abilities: {
      openness: 86,
      conscientiousness: 90,
      extraversion: 81,
      agreeableness: 82,
      neuroticism: 12
    }
  },

  // INFP × RETI (118-120)
  {
    id: 'infp-1',
    number: 118,
    mbti: 'INFP',
    reti: '1',
    retiType: '완벽형',
    name: '이상의 조각가',
    nameEn: 'Sculptor of Ideals',
    tagline: '순수한 이상을 현실의 형태로 빚는 예술가',
    description: '그는 순수한 이상을 현실의 형태로 빚는 예술가다. 현실의 거칠음 속에서도 내면의 완벽함을 추구한다. 그의 창작물은 감정의 결정체이자, 도덕적 질서의 조형물이다.',
    abilities: {
      openness: 93,
      conscientiousness: 86,
      extraversion: 68,
      agreeableness: 88,
      neuroticism: 21
    }
  },
  {
    id: 'infp-2',
    number: 119,
    mbti: 'INFP',
    reti: '2',
    retiType: '도우미형',
    name: '감정의 치유자',
    nameEn: 'Healer of Emotion',
    tagline: '상처받은 마음에 빛을 비추는 따뜻한 위로자',
    description: '그는 상처받은 마음에 빛을 비추는 따뜻한 위로자다. 공감의 언어로 사람의 고통을 감싸며, \'이해받는 것\'의 힘을 믿는다. 그의 존재만으로도 주변의 공기가 달라진다.',
    abilities: {
      openness: 88,
      conscientiousness: 80,
      extraversion: 70,
      agreeableness: 96,
      neuroticism: 18
    }
  },
  {
    id: 'infp-3',
    number: 120,
    mbti: 'INFP',
    reti: '3',
    retiType: '성취형',
    name: '의미의 실천가',
    nameEn: 'Practitioner of Meaning',
    tagline: '자신의 가치관을 행동으로 증명하는 사명가',
    description: '그는 자신의 가치관을 행동으로 증명하는 사명가다. 이상을 말하는 데서 멈추지 않고, 실제로 그 길을 걷는다. 그의 삶은 하나의 철학이며, 행위는 선언이다.',
    abilities: {
      openness: 92,
      conscientiousness: 88,
      extraversion: 73,
      agreeableness: 85,
      neuroticism: 19
    }
  },
  // INFP × RETI (121-126)
  {
    id: 'infp-4',
    number: 121,
    mbti: 'INFP',
    reti: '4',
    retiType: '개성형',
    name: '영혼의 시인',
    nameEn: 'Poet of the Soul',
    tagline: '감정과 언어로 내면세계를 노래하는 창조자',
    description: '그는 감정과 언어로 내면세계를 노래하는 창조자다. 현실보다 감정이, 논리보다 진심이 그의 세계를 움직인다. 그의 작품은 타인의 마음을 비추는 거울이다.',
    abilities: {
      openness: 98,
      conscientiousness: 78,
      extraversion: 66,
      agreeableness: 87,
      neuroticism: 24
    }
  },
  {
    id: 'infp-5',
    number: 122,
    mbti: 'INFP',
    reti: '5',
    retiType: '탐구형',
    name: '이상의 철학자',
    nameEn: 'Philosopher of Ideals',
    tagline: '진정한 선과 아름다움을 탐색하는 사색가',
    description: '그는 진정한 선과 아름다움을 탐색하는 사색가다. 이념을 넘어 진리를 찾고, 감정 속의 이성을 추구한다. 그는 이상과 현실의 중간지대를 걸으며 \'진정한 의미\'를 묻는다.',
    abilities: {
      openness: 97,
      conscientiousness: 82,
      extraversion: 65,
      agreeableness: 80,
      neuroticism: 17
    }
  },
  {
    id: 'infp-6',
    number: 123,
    mbti: 'INFP',
    reti: '6',
    retiType: '충성형',
    name: '믿음의 수호자',
    nameEn: 'Guardian of Belief',
    tagline: '자신이 사랑하는 가치와 사람을 지키는 충정가',
    description: '그는 자신이 사랑하는 가치와 사람을 지키는 충정가다. 배신보다 절망을 택하며, 신뢰를 생명처럼 여긴다. 그의 충성은 단순한 의리가 아닌, 영혼의 맹세다.',
    abilities: {
      openness: 86,
      conscientiousness: 90,
      extraversion: 69,
      agreeableness: 91,
      neuroticism: 15
    }
  },
  {
    id: 'infp-7',
    number: 124,
    mbti: 'INFP',
    reti: '7',
    retiType: '열정형',
    name: '꿈의 전도사',
    nameEn: 'Evangelist of Dreams',
    tagline: '희망과 비전을 감정으로 전파하는 감성의 메신저',
    description: '그는 희망과 비전을 감정으로 전파하는 감성의 메신저다. 말보다는 눈빛으로 사람을 설득하고, 감정의 진동으로 변화를 일으킨다. 그의 열정은 곧 신념이다.',
    abilities: {
      openness: 94,
      conscientiousness: 85,
      extraversion: 83,
      agreeableness: 90,
      neuroticism: 22
    }
  },
  {
    id: 'infp-8',
    number: 125,
    mbti: 'INFP',
    reti: '8',
    retiType: '도전형',
    name: '신념의 전사',
    nameEn: 'Warrior of Conviction',
    tagline: '이상을 현실로 만들기 위해 싸우는 내면의 영웅',
    description: '그는 이상을 현실로 만들기 위해 싸우는 내면의 영웅이다. 부드럽지만 단단하고, 온화하지만 흔들리지 않는다. 그의 싸움은 세상과의 전쟁이 아니라, 자기 안의 두려움과의 전투다.',
    abilities: {
      openness: 91,
      conscientiousness: 88,
      extraversion: 75,
      agreeableness: 76,
      neuroticism: 16
    }
  },
  {
    id: 'infp-9',
    number: 126,
    mbti: 'INFP',
    reti: '9',
    retiType: '평화형',
    name: '조화의 성자',
    nameEn: 'Saint of Harmony',
    tagline: '세상의 아픔을 품고 통합을 꿈꾸는 휴머니스트',
    description: '그는 세상의 아픔을 품고 통합을 꿈꾸는 휴머니스트다. 갈등의 양편을 이해하고, 슬픔 속에서 아름다움을 발견한다. 그는 말보다 존재로 세상을 위로하는 자다.',
    abilities: {
      openness: 89,
      conscientiousness: 83,
      extraversion: 70,
      agreeableness: 95,
      neuroticism: 13
    }
  },

  // ESTP × RETI (127-135)
  {
    id: 'estp-1',
    number: 127,
    mbti: 'ESTP',
    reti: '1',
    retiType: '완벽형',
    name: '속도의 전략가',
    nameEn: 'Strategist of Speed',
    tagline: '즉흥적 상황에서도 완벽한 타이밍을 계산하는 실행가',
    description: '즉흥적 상황에서도 완벽한 타이밍을 계산하는 실행가. 감각과 분석을 동시에 구사하며, 현실의 흐름을 읽는 천부적 조정자. 혼돈을 속도로 제압한다.',
    abilities: {
      openness: 80,
      conscientiousness: 86,
      extraversion: 95,
      agreeableness: 75,
      neuroticism: 12
    }
  },
  {
    id: 'estp-2',
    number: 128,
    mbti: 'ESTP',
    reti: '2',
    retiType: '도우미형',
    name: '행동의 조력자',
    nameEn: 'Helper of Action',
    tagline: '몸으로 직접 뛰어들어 사람을 돕는 실천가',
    description: '몸으로 직접 뛰어들어 사람을 돕는 실천가. 말보다 행동이 빠르고, 도움을 머리로가 아니라 손으로 준다. "함께 땀 흘려야 진짜다."',
    abilities: {
      openness: 76,
      conscientiousness: 83,
      extraversion: 91,
      agreeableness: 88,
      neuroticism: 14
    }
  },
  {
    id: 'estp-3',
    number: 129,
    mbti: 'ESTP',
    reti: '3',
    retiType: '성취형',
    name: '현장의 리더',
    nameEn: 'Leader of the Field',
    tagline: '즉각적 판단력으로 결과를 만들어내는 결정자',
    description: '즉각적 판단력으로 결과를 만들어내는 결정자. 상황 판단은 빠르고 명확하며, 위기일수록 침착하다. 결단력의 화신.',
    abilities: {
      openness: 81,
      conscientiousness: 89,
      extraversion: 94,
      agreeableness: 78,
      neuroticism: 10
    }
  },
  {
    id: 'estp-4',
    number: 130,
    mbti: 'ESTP',
    reti: '4',
    retiType: '개성형',
    name: '자유의 개척자',
    nameEn: 'Pioneer of Freedom',
    tagline: '순간의 감각으로 세상을 개척하는 모험가',
    description: '순간의 감각으로 세상을 개척하는 모험가. 규칙보단 가능성, 계획보단 본능을 믿는다. 실패조차 즐기는 삶의 행위가.',
    abilities: {
      openness: 88,
      conscientiousness: 75,
      extraversion: 96,
      agreeableness: 80,
      neuroticism: 18
    }
  },
  {
    id: 'estp-5',
    number: 131,
    mbti: 'ESTP',
    reti: '5',
    retiType: '탐구형',
    name: '현실의 탐험가',
    nameEn: 'Explorer of Reality',
    tagline: '행동 속에서 배움을 찾는 현실적 학습자',
    description: '행동 속에서 배움을 찾는 현실적 학습자. 생각보다 먼저 움직이고, 경험으로 사고를 진화시킨다. "행동은 최고의 데이터."',
    abilities: {
      openness: 86,
      conscientiousness: 83,
      extraversion: 92,
      agreeableness: 74,
      neuroticism: 12
    }
  },
  {
    id: 'estp-6',
    number: 132,
    mbti: 'ESTP',
    reti: '6',
    retiType: '충성형',
    name: '신뢰의 파트너',
    nameEn: 'Partner of Trust',
    tagline: '약속을 행동으로 증명하는 신속한 동반자',
    description: '약속을 행동으로 증명하는 신속한 동반자. 말보다 실행으로 믿음을 쌓는다. 그가 믿는 사람은 결코 혼자 두지 않는다.',
    abilities: {
      openness: 78,
      conscientiousness: 88,
      extraversion: 90,
      agreeableness: 86,
      neuroticism: 11
    }
  },
  {
    id: 'estp-7',
    number: 133,
    mbti: 'ESTP',
    reti: '7',
    retiType: '열정형',
    name: '에너지의 폭풍',
    nameEn: 'Storm of Energy',
    tagline: '현장의 긴장을 즐기며 세상을 움직이는 활력체',
    description: '현장의 긴장을 즐기며 세상을 움직이는 활력체. 위험은 그의 연료, 불확실성은 그의 놀이터다. 세상을 들썩이는 생존 본능.',
    abilities: {
      openness: 84,
      conscientiousness: 80,
      extraversion: 98,
      agreeableness: 82,
      neuroticism: 15
    }
  },
  {
    id: 'estp-8',
    number: 134,
    mbti: 'ESTP',
    reti: '8',
    retiType: '도전형',
    name: '강철의 실전가',
    nameEn: 'Practitioner of Steel',
    tagline: '불확실한 상황에서 돌파구를 찾는 용감한 전사',
    description: '불확실한 상황에서 돌파구를 찾는 용감한 전사. 몸으로 부딪혀 해답을 찾는 행동의 철학자. "생각은 나중에, 움직임이 먼저."',
    abilities: {
      openness: 81,
      conscientiousness: 86,
      extraversion: 95,
      agreeableness: 70,
      neuroticism: 9
    }
  },
  {
    id: 'estp-9',
    number: 135,
    mbti: 'ESTP',
    reti: '9',
    retiType: '평화형',
    name: '현실의 중재자',
    nameEn: 'Mediator of Reality',
    tagline: '문제를 유연하게 풀어내는 협상형 리더',
    description: '문제를 유연하게 풀어내는 협상형 리더. 긴장된 상황에서도 유머와 감각으로 흐름을 바꾼다. "움직임은 대립보다 빠르다."',
    abilities: {
      openness: 83,
      conscientiousness: 84,
      extraversion: 93,
      agreeableness: 89,
      neuroticism: 12
    }
  },

  // ESFJ × RETI (136-144) - 마지막 9개
  {
    id: 'esfj-1',
    number: 136,
    mbti: 'ESFJ',
    reti: '1',
    retiType: '완벽형',
    name: '공동체의 조율자',
    nameEn: 'Coordinator of Community',
    tagline: '공동체의 기준과 질서를 세우는 섬세한 리더',
    description: '공동체를 세밀하게 조직하는 질서의 리더. 그는 작은 예절에도 의미를 부여하고, 모두가 안전하게 머물 틀을 만든다. 완벽한 배려와 현실감을 기반으로 조화로운 환경을 구축한다.',
    abilities: {
      openness: 68,
      conscientiousness: 92,
      extraversion: 82,
      agreeableness: 90,
      neuroticism: 20
    }
  },
  {
    id: 'esfj-2',
    number: 137,
    mbti: 'ESFJ',
    reti: '2',
    retiType: '도우미형',
    name: '공감의 수호자',
    nameEn: 'Guardian of Empathy',
    tagline: '공감과 헌신으로 사람을 보살피는 따뜻한 보호자',
    description: '공감과 헌신으로 사람을 보살피는 따뜻한 보호자. 상대의 감정을 빠르게 읽어내며, 실제적인 도움으로 사랑을 표현한다. 그의 말 한마디는 누군가의 하루를 바꾼다.',
    abilities: {
      openness: 70,
      conscientiousness: 88,
      extraversion: 85,
      agreeableness: 95,
      neuroticism: 22
    }
  },
  {
    id: 'esfj-3',
    number: 138,
    mbti: 'ESFJ',
    reti: '3',
    retiType: '성취형',
    name: '무대의 연출가',
    nameEn: 'Producer of the Stage',
    tagline: '사람과 결과를 모두 세심하게 챙기는 무대 뒤 리더',
    description: '사람과 결과를 동시에 챙기는 무대 뒤 리더. 그는 모두가 빛나도록 세팅하고, 완성도 높은 공동 목표를 만든다. 성취와 관계를 양손에 쥔 조율자.',
    abilities: {
      openness: 72,
      conscientiousness: 93,
      extraversion: 88,
      agreeableness: 89,
      neuroticism: 18
    }
  },
  {
    id: 'esfj-4',
    number: 139,
    mbti: 'ESFJ',
    reti: '4',
    retiType: '개성형',
    name: '감성의 기록가',
    nameEn: 'Archivist of Sentiments',
    tagline: '사람의 마음을 기억하고 이야기로 남기는 감성 큐레이터',
    description: '사람들의 마음을 기억하고 이야기로 남기는 감성 큐레이터. 그는 공동체의 역사와 감정을 잇는 다리 역할을 하며, 진심 어린 표현으로 모두를 연결한다.',
    abilities: {
      openness: 75,
      conscientiousness: 85,
      extraversion: 83,
      agreeableness: 92,
      neuroticism: 19
    }
  },
  {
    id: 'esfj-5',
    number: 140,
    mbti: 'ESFJ',
    reti: '5',
    retiType: '탐구형',
    name: '관계의 분석가',
    nameEn: 'Analyst of Relationships',
    tagline: '관계 속 데이터를 읽어내는 현실적 전략가',
    description: '관계 속 데이터를 읽어내는 현실적 전략가. 감정의 흐름을 세밀하게 기록하고, 협력의 패턴을 분석해 더 나은 결속을 설계한다. 배려의 전략가이자 인간 관계의 플래너.',
    abilities: {
      openness: 70,
      conscientiousness: 94,
      extraversion: 80,
      agreeableness: 88,
      neuroticism: 21
    }
  },
  {
    id: 'esfj-6',
    number: 141,
    mbti: 'ESFJ',
    reti: '6',
    retiType: '충성형',
    name: '신뢰의 중개자',
    nameEn: 'Broker of Trust',
    tagline: '신뢰와 일관성으로 관계를 지키는 공동체 수호자',
    description: '신뢰와 일관성으로 관계를 지키는 공동체 수호자. 그는 약속을 철저히 지키며, 주변 사람들의 안전과 안정감을 확보한다. “당신은 혼자가 아니다”를 체화한 존재.',
    abilities: {
      openness: 66,
      conscientiousness: 96,
      extraversion: 82,
      agreeableness: 93,
      neuroticism: 17
    }
  },
  {
    id: 'esfj-7',
    number: 142,
    mbti: 'ESFJ',
    reti: '7',
    retiType: '열정형',
    name: '축제의 기획자',
    nameEn: 'Planner of Festivals',
    tagline: '에너지와 긍정으로 공동체를 밝히는 즐거움의 매니저',
    description: '에너지와 긍정으로 공동체를 밝히는 즐거움의 매니저. 그는 작은 이벤트도 의미 있게 만들고, 모두가 웃는 순간을 디자인한다. 활력과 따뜻함의 중심.',
    abilities: {
      openness: 76,
      conscientiousness: 90,
      extraversion: 91,
      agreeableness: 94,
      neuroticism: 16
    }
  },
  {
    id: 'esfj-8',
    number: 143,
    mbti: 'ESFJ',
    reti: '8',
    retiType: '도전형',
    name: '방패의 리더',
    nameEn: 'Leader of the Shield',
    tagline: '공동체를 지키기 위해 앞장서는 정의의 보호자',
    description: '공동체를 지키기 위해 앞장서는 정의의 보호자. 그는 약자를 대신해 목소리를 내고, 잘못된 시스템을 바로잡는다. 강인한 배려이자 따뜻한 권위.',
    abilities: {
      openness: 69,
      conscientiousness: 95,
      extraversion: 87,
      agreeableness: 88,
      neuroticism: 18
    }
  },
  {
    id: 'esfj-9',
    number: 144,
    mbti: 'ESFJ',
    reti: '9',
    retiType: '평화형',
    name: '조화의 중재자',
    nameEn: 'Mediator of Harmony',
    tagline: '갈등을 완만히 조절하며 모두를 포용하는 조율자',
    description: '갈등을 완만히 조절하며 모두를 포용하는 조율자. 그는 충돌을 부드럽게 풀어내고, 집단의 감정을 평온하게 만든다. "무사함이야말로 최고의 결말"이라 믿는 사람.',
    abilities: {
      openness: 71,
      conscientiousness: 93,
      extraversion: 84,
      agreeableness: 96,
      neuroticism: 15
    }
  },

  // ISFJ × RETI (055-063)
  {
    id: 'isfj-1',
    number: 55,
    mbti: 'ISFJ',
    reti: '1',
    retiType: '완벽형',
    name: '헌신의 설계자',
    nameEn: 'Architect of Devotion',
    tagline: '조화로운 질서와 봉사를 실천하는 보호자',
    description: '그는 조화로운 질서에 헌신하는 보호자다. 전통과 원칙을 중시하며, 섬세하게 타인을 챙긴다. 뛰어난 기억력과 관찰력으로 항상 누군가의 필요를 미리 준비한다. 규칙을 지키는 가운데 따뜻함으로 조직을 이끄는 인물.',
    abilities: {
      openness: 68,
      conscientiousness: 90,
      extraversion: 50,
      agreeableness: 88,
      neuroticism: 23
    }
  },
  {
    id: 'isfj-2',
    number: 56,
    mbti: 'ISFJ',
    reti: '2',
    retiType: '도우미형',
    name: '정성의 조력자',
    nameEn: 'Helper of Sincerity',
    tagline: '타인을 위해 따뜻한 희생을 마다하지 않는 헌신자',
    description: '그는 항상 타인의 필요를 잊지 않고 세심하게 살핀다. 사소한 것 하나까지 세심히 챙기며, 도움을 줄 때 자신의 행복을 느낀다. 뒷자리에서 빛나는 조용한 영웅.',
    abilities: {
      openness: 67,
      conscientiousness: 89,
      extraversion: 45,
      agreeableness: 95,
      neuroticism: 25
    }
  },
  {
    id: 'isfj-3',
    number: 57,
    mbti: 'ISFJ',
    reti: '3',
    retiType: '성취형',
    name: '일상의 실천가',
    nameEn: 'Practitioner of Everyday',
    tagline: '귀중한 일상을 소중하게 쌓아가는 묵묵한 성실가',
    description: '그는 눈에 띄지 않게 자신의 책임과 임무에 충실한다. 성취란 작은 일을 꾸준히 실천하는 데서 온다고 믿는다. 겉으로 드러나지 않으나, 모든 조직의 근간을 이루는 힘이다.',
    abilities: {
      openness: 72,
      conscientiousness: 92,
      extraversion: 48,
      agreeableness: 92,
      neuroticism: 22
    }
  },
  {
    id: 'isfj-4',
    number: 58,
    mbti: 'ISFJ',
    reti: '4',
    retiType: '개성형',
    name: '기억의 예술가',
    nameEn: 'Artist of Memory',
    tagline: '추억과 감각을 자신만의 방식으로 해석하는 잔잔한 창조자',
    description: '그는 사소한 추억 하나에도 특별한 의미를 부여할 줄 아는 예술가다. 생활 속 소소한 감동을 작품처럼 만들며, 과거의 따뜻함을 현재로 소환한다. 그의 개성은 일상을 특별하게 빛낸다.',
    abilities: {
      openness: 80,
      conscientiousness: 82,
      extraversion: 53,
      agreeableness: 89,
      neuroticism: 27
    }
  },
  {
    id: 'isfj-5',
    number: 59,
    mbti: 'ISFJ',
    reti: '5',
    retiType: '탐구형',
    name: '상세의 탐험가',
    nameEn: 'Explorer of Details',
    tagline: '세밀함으로 세상을 분석하는 지적 수호자',
    description: '그는 작은 것 하나도 소홀히 넘기지 않는다. 세상의 모든 현상을 세밀하게 분석하며, 실용적인 지식을 쌓는다. 신중한 자세로 진짜 중요한 것을 지키는 존재.',
    abilities: {
      openness: 78,
      conscientiousness: 85,
      extraversion: 40,
      agreeableness: 84,
      neuroticism: 20
    }
  },
  {
    id: 'isfj-6',
    number: 60,
    mbti: 'ISFJ',
    reti: '6',
    retiType: '충성형',
    name: '신뢰의 지킴이',
    nameEn: 'Keeper of Trust',
    tagline: '한 번 맺은 인연을 결코 져버리지 않는 의리의 수호자',
    description: '그는 신뢰와 약속을 생명처럼 소중히 여긴다. 주변 사람들을 큰 불안 속에서도 지켜내며, 끝까지 책임을 다한다. 전통과 소속감을 중시하는 관계의 중추.',
    abilities: {
      openness: 63,
      conscientiousness: 94,
      extraversion: 46,
      agreeableness: 92,
      neuroticism: 19
    }
  },
  {
    id: 'isfj-7',
    number: 61,
    mbti: 'ISFJ',
    reti: '7',
    retiType: '열정형',
    name: '열정의 후원자',
    nameEn: 'Backer of Passion',
    tagline: '진심과 에너지로 사람을 북돋는 따뜻한 조력자',
    description: '그는 열정으로 타인을 북돋아준다. 감정의 기복 없이, 묵묵하게 주변에 긍정적 에너지를 퍼뜨린다. 모두의 든든한 응원자이자, 집단의 활력소.',
    abilities: {
      openness: 75,
      conscientiousness: 87,
      extraversion: 57,
      agreeableness: 95,
      neuroticism: 24
    }
  },
  {
    id: 'isfj-8',
    number: 62,
    mbti: 'ISFJ',
    reti: '8',
    retiType: '도전형',
    name: '온기의 견고함',
    nameEn: 'Firmness of Warmth',
    tagline: '따뜻함과 단호함으로 장애를 극복하는 실행가',
    description: '그는 어려운 상황에서도 흔들리지 않는다. 친절하지만 단호하게 갈등을 해결하고, 온기를 잃지 않으면서도 현실적으로 행동한다. 그의 리더십은 따뜻함과 결단력의 결합이다.',
    abilities: {
      openness: 70,
      conscientiousness: 91,
      extraversion: 54,
      agreeableness: 79,
      neuroticism: 21
    }
  },
  {
    id: 'isfj-9',
    number: 63,
    mbti: 'ISFJ',
    reti: '9',
    retiType: '평화형',
    name: '조화의 보호자',
    nameEn: 'Protector of Harmony',
    tagline: '갈등을 부드럽게 중재하여 평안을 만드는 화합의 조율자',
    description: '그는 조직 내의 갈등을 부드럽게 중재한다. 누구보다 공감 능력이 뛰어나며, 조용한 배려로 모두를 품는다. 평화로운 분위기를 유지하는 집단의 숨은 주역.',
    abilities: {
      openness: 74,
      conscientiousness: 88,
      extraversion: 52,
      agreeableness: 95,
      neuroticism: 18
    }
  },

  // ISTP × RETI (064-072)
  {
    id: 'istp-1',
    number: 64,
    mbti: 'ISTP',
    reti: '1',
    retiType: '완벽형',
    name: '기능의 장인',
    nameEn: 'Craftsman of Function',
    tagline: '정교한 기술과 완벽주의를 겸비한 탐구의 실천자',
    description: '그는 논리와 효율의 조합을 사랑하는 실용적 장인이다. 문제를 세밀하게 분석하여 가장 완벽한 해결법을 찾는다. 작은 디테일도 허투루 넘기지 않는 현장형 마스터.',
    abilities: {
      openness: 76,
      conscientiousness: 81,
      extraversion: 54,
      agreeableness: 70,
      neuroticism: 22
    }
  },
  {
    id: 'istp-2',
    number: 65,
    mbti: 'ISTP',
    reti: '2',
    retiType: '도우미형',
    name: '실행의 도우미',
    nameEn: 'Helper of Action',
    tagline: '인간적인 소통과 실천으로 도움을 주는 실용가',
    description: '그는 도움도 기능적으로 실천적으로 제공한다. 말보다는 행동으로, 이론보다는 현실에서 동료의 문제를 해결한다. 언제나 현장에서 필요한 솔루션을 제시하는 인물.',
    abilities: {
      openness: 71,
      conscientiousness: 78,
      extraversion: 55,
      agreeableness: 81,
      neuroticism: 24
    }
  },
  {
    id: 'istp-3',
    number: 66,
    mbti: 'ISTP',
    reti: '3',
    retiType: '성취형',
    name: '성과의 설계자',
    nameEn: 'Designer of Achievement',
    tagline: '현실 속 문제해결로 성취를 창출하는 전략가',
    description: '그는 문제의 원인을 신속하게 파악하고, 실질적인 해결책을 찾아내는 데 능하다. 상황에 맞는 창의적인 방법으로 목표를 달성하는 실전형 성취가.',
    abilities: {
      openness: 77,
      conscientiousness: 84,
      extraversion: 60,
      agreeableness: 68,
      neuroticism: 19
    }
  },
  {
    id: 'istp-4',
    number: 67,
    mbti: 'ISTP',
    reti: '4',
    retiType: '개성형',
    name: '자유의 현장가',
    nameEn: 'Fieldworker of Freedom',
    tagline: '틀을 깨는 창의성과 실전 감각을 가진 독특한 행위가',
    description: '그는 누구와도 다르게 현장의 감각으로 새로운 방식을 만들어낸다. 독립심이 강하며, 임기응변과 창의성에서 빛을 발한다. 일상에서 혁신을 실현하는 주체.',
    abilities: {
      openness: 84,
      conscientiousness: 68,
      extraversion: 65,
      agreeableness: 72,
      neuroticism: 23
    }
  },
  {
    id: 'istp-5',
    number: 68,
    mbti: 'ISTP',
    reti: '5',
    retiType: '탐구형',
    name: '현실의 연구가',
    nameEn: 'Researcher of Reality',
    tagline: '사실 중심으로 세상을 실험하며 분석하는 실사구시형',
    description: '그는 추상적인 생각보다는 실제 데이터를 중시한다. 경험을 통해 직접 확인하고, 실험정신으로 새로운 지식을 얻는다. 행동에서 진실을 찾는 관찰자.',
    abilities: {
      openness: 79,
      conscientiousness: 77,
      extraversion: 48,
      agreeableness: 67,
      neuroticism: 18
    }
  },
  {
    id: 'istp-6',
    number: 69,
    mbti: 'ISTP',
    reti: '6',
    retiType: '충성형',
    name: '실천의 동료',
    nameEn: 'Colleague of Practice',
    tagline: '실천과 신뢰로 팀을 지키는 현장형 동반자',
    description: '그는 약속을 행동으로 보여준다. 팀내 신뢰와 실제 상황에서 꾸준히 한결같은 모습을 지키며, 위기에서 가장 빛나는 동료형 리더.',
    abilities: {
      openness: 67,
      conscientiousness: 85,
      extraversion: 51,
      agreeableness: 86,
      neuroticism: 20
    }
  },
  {
    id: 'istp-7',
    number: 70,
    mbti: 'ISTP',
    reti: '7',
    retiType: '열정형',
    name: '에너지의 실험가',
    nameEn: 'Experimenter of Energy',
    tagline: '도전과 경험에서 활력을 얻는 추진형 실험가',
    description: '그는 새로운 환경과 도전을 즐긴다. 감정적 과잉 없이 냉정하게 시도하며, 문제를 실전으로 풀어나간다. 현장에 생기를 불어넣는 적극형 엔진.',
    abilities: {
      openness: 81,
      conscientiousness: 80,
      extraversion: 66,
      agreeableness: 75,
      neuroticism: 21
    }
  },
  {
    id: 'istp-8',
    number: 71,
    mbti: 'ISTP',
    reti: '8',
    retiType: '도전형',
    name: '실행의 선봉장',
    nameEn: 'Vanguard of Execution',
    tagline: '두려움 없이 새로운 길을 개척하는 탁월한 행동가',
    description: '그는 혁신적 솔루션을 찾아 현장에 바로 적용한다. 실패도 두려워하지 않고, 도전에서 곧 경력을 쌓는다. 행동이 곧 그를 증명한다.',
    abilities: {
      openness: 78,
      conscientiousness: 82,
      extraversion: 69,
      agreeableness: 73,
      neuroticism: 17
    }
  },
  {
    id: 'istp-9',
    number: 72,
    mbti: 'ISTP',
    reti: '9',
    retiType: '평화형',
    name: '균형의 중재자',
    nameEn: 'Mediator of Balance',
    tagline: '갈등을 실용적으로 조율하는 유연한 협상가',
    description: '그는 현장의 다양한 의견 차이를 실용적으로 맞춘다. 감정이 아닌 결과 중심으로 갈등을 중재해 실질적 평화를 만든다. 유연함과 실용성의 조율자.',
    abilities: {
      openness: 74,
      conscientiousness: 76,
      extraversion: 60,
      agreeableness: 83,
      neuroticism: 16
    }
  },

  // ISTJ × RETI (136-144)
  {
    id: 'istj-1',
    number: 136,
    mbti: 'ISTJ',
    reti: '1',
    retiType: '완벽형',
    name: '질서의 감독관',
    nameEn: 'Supervisor of Order',
    tagline: '원칙과 규범을 완벽히 유지하는 관리자',
    description: '그는 세상의 질서와 규칙을 수호하는 관리자다. 빈틈없는 계획과 실행력으로 팀의 신뢰를 이끈다. 전통과 규율을 중시하는 진정한 완벽추구자.',
    abilities: {
      openness: 66,
      conscientiousness: 97,
      extraversion: 48,
      agreeableness: 78,
      neuroticism: 21
    }
  },
  {
    id: 'istj-2',
    number: 137,
    mbti: 'ISTJ',
    reti: '2',
    retiType: '도우미형',
    name: '책임의 동반자',
    nameEn: 'Partner of Responsibility',
    tagline: '묵묵히 타인을 보살피는 책임의 모범생',
    description: '그는 타인을 위해 꾸준히 헌신하는 조용한 리더다. 실용적 도움과 신뢰를 통해 집단을 안정적으로 이끈다. 자기희생과 성실함의 상징.',
    abilities: {
      openness: 68,
      conscientiousness: 94,
      extraversion: 43,
      agreeableness: 87,
      neuroticism: 18
    }
  },
  {
    id: 'istj-3',
    number: 138,
    mbti: 'ISTJ',
    reti: '3',
    retiType: '성취형',
    name: '결과의 관리자',
    nameEn: 'Manager of Results',
    tagline: '실제 성과로 인정받는 체계형 추진가',
    description: '그는 구체적 성과와 결과로 자신의 가치와 신뢰를 증명한다. 현실적이고 계획적인 추진력으로 큰 프로젝트를 성공으로 이끈다. 결과에 책임지는 성취가.',
    abilities: {
      openness: 70,
      conscientiousness: 96,
      extraversion: 49,
      agreeableness: 80,
      neuroticism: 15
    }
  },
  {
    id: 'istj-4',
    number: 139,
    mbti: 'ISTJ',
    reti: '4',
    retiType: '개성형',
    name: '원칙의 연금술사',
    nameEn: 'Alchemist of Principle',
    tagline: '전통적 가치를 자신만의 방식으로 해석하는 분석가',
    description: '그는 원칙과 규율을 창의적으로 재해석한다. 기존의 방식에 머무르지 않고, 자기만의 규칙으로 새 질서를 만들어낸다. 꼼꼼함과 독특함을 동시에 갖춘 인물.',
    abilities: {
      openness: 74,
      conscientiousness: 88,
      extraversion: 53,
      agreeableness: 74,
      neuroticism: 24
    }
  },
  {
    id: 'istj-5',
    number: 140,
    mbti: 'ISTJ',
    reti: '5',
    retiType: '탐구형',
    name: '진실의 탐험가',
    nameEn: 'Explorer of Truth',
    tagline: '객관적 지식으로 세상을 해석하는 연구가',
    description: '그는 모든 일에 검증과 분석을 거친다. 경험과 자료 기반으로 권위 있는 해답을 추구하며, 논리와 객관으로 집단의 등불이 된다.',
    abilities: {
      openness: 78,
      conscientiousness: 92,
      extraversion: 41,
      agreeableness: 68,
      neuroticism: 20
    }
  },
  {
    id: 'istj-6',
    number: 141,
    mbti: 'ISTJ',
    reti: '6',
    retiType: '충성형',
    name: '신뢰의 관리자',
    nameEn: 'Manager of Loyalty',
    tagline: '원칙과 신의에 목숨을 거는 관계 수호자',
    description: '그는 약속과 규칙을 목숨보다 중하게 생각한다. 대인관계에도 신뢰가 우선이며, 오래된 인연을 깊이 지킨다. 타인의 버팀목이 되는 든든한 충성가.',
    abilities: {
      openness: 62,
      conscientiousness: 99,
      extraversion: 46,
      agreeableness: 79,
      neuroticism: 13
    }
  },
  {
    id: 'istj-7',
    number: 142,
    mbti: 'ISTJ',
    reti: '7',
    retiType: '열정형',
    name: '열정의 실무가',
    nameEn: 'Operator of Passion',
    tagline: '업무와 임무에 뜨겁게 몰입하는 일꾼',
    description: '그는 항상 실용적 목표와 임무에 전력투구한다. 단조로움 속에서도 일의 의미를 찾아내고, 뜨거운 집중력으로 성과를 창출한다. 성실함과 몰입의 아이콘.',
    abilities: {
      openness: 68,
      conscientiousness: 93,
      extraversion: 52,
      agreeableness: 82,
      neuroticism: 19
    }
  },
  {
    id: 'istj-8',
    number: 143,
    mbti: 'ISTJ',
    reti: '8',
    retiType: '도전형',
    name: '실행의 도전자',
    nameEn: 'Challenger of Execution',
    tagline: '장애물을 계획적이고 단단하게 돌파하는 책임의 전사',
    description: '그는 뜻한 바를 달성하기 위해 강인함과 치밀함으로 장애를 돌파한다. 현실적 계획과 꾸준한 실행력으로 모든 도전에 맞선다. 흔들림 없는 추진자.',
    abilities: {
      openness: 70,
      conscientiousness: 95,
      extraversion: 51,
      agreeableness: 68,
      neuroticism: 16
    }
  },
  {
    id: 'istj-9',
    number: 144,
    mbti: 'ISTJ',
    reti: '9',
    retiType: '평화형',
    name: '평온의 중재자',
    nameEn: 'Mediator of Calm',
    tagline: '갈등을 차분히 조정하여 조직의 안정을 만드는 조율자',
    description: '조용히, 그러나 확실하게 집단의 평화를 이끈다. 감정보다 현실을 중시하며, 차분한 실행력과 침착한 조정력으로 모두를 안심시킨다. 팀의 믿음직한 축.',
    abilities: {
      openness: 69,
      conscientiousness: 97,
      extraversion: 47,
      agreeableness: 86,
      neuroticism: 14
    }
  },
]

const HEROES_BY_MB_TI_AND_RETI: Record<string, Hero> = HEROES_144.reduce((acc, hero) => {
  const key = `${hero.mbti}_${hero.reti}`.toUpperCase()
  acc[key] = hero
  return acc
}, {} as Record<string, Hero>)

export function matchHero(mbti: string, reti: string | number) {
  const retiKey = typeof reti === 'string' ? reti.replace(/^r/i, '').replace(/^type/i, '') : String(reti)
  const key = `${mbti.toUpperCase()}_${retiKey}`
  return HEROES_BY_MB_TI_AND_RETI[key] ?? {
    id: 'default',
    number: -1,
    mbti,
    reti: retiKey,
    retiType: '',
    name: '기본 영웅',
    nameEn: 'Default Hero',
    tagline: '매칭되는 영웅 정보를 찾을 수 없습니다.',
    description: '',
    abilities: { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 },
  }
}

// 헬퍼 함수들
export function getHeroById(id: string): Hero | undefined {
  return HEROES_144.find(hero => hero.id === id)
}

export function getHeroByNumber(number: number): Hero | undefined {
  return HEROES_144.find(hero => hero.number === number)
}

export function getHeroesByMBTI(mbti: string): Hero[] {
  return HEROES_144.filter(hero => hero.mbti === mbti)
}

export function getHeroesByRETI(reti: string): Hero[] {
  return HEROES_144.filter(hero => hero.reti === reti)
}

export function findHero(mbti: string, reti: string): Hero | undefined {
  return HEROES_144.find(hero => hero.mbti === mbti && hero.reti === reti)
}

export const MBTI_TYPES = [
  'INTP', 'ISFP', 'ENFJ', 'ENTP', 'INFJ', 'INTJ', 
  'ISFJ', 'ESFJ', 'ISTP', 'ESTJ', 'ESFP', 'ENFP',
  'ENTJ', 'INFP', 'ESTP'
] as const

export const RETI_TYPES = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
] as const

export const RETI_NAMES = {
  '1': '완벽형',
  '2': '도우미형',
  '3': '성취형',
  '4': '개성형',
  '5': '탐구형',
  '6': '충성형',
  '7': '열정형',
  '8': '도전형',
  '9': '평화형'
} as const

// 검증 함수
export function validateHeroesData(): {
  isValid: boolean
  errors: string[]
  stats: {
    total: number
    mbtiCount: number
    retiCount: number
    duplicates: string[]
  }
} {
  const errors: string[] = []
  const duplicates: string[] = []
  const seen = new Set<string>()

  // 중복 검사
  HEROES_144.forEach(hero => {
    const key = `${hero.mbti}-${hero.reti}`
    if (seen.has(key)) {
      duplicates.push(key)
    }
    seen.add(key)
  })

  // 개수 검증
  if (HEROES_144.length !== 144) {
    errors.push(`영웅 개수 오류: ${HEROES_144.length}/144`)
  }

  const mbtiSet = new Set(HEROES_144.map(h => h.mbti))
  const retiSet = new Set(HEROES_144.map(h => h.reti))

  if (mbtiSet.size !== 16) {
    errors.push(`MBTI 타입 개수 오류: ${mbtiSet.size}/16`)
  }

  if (retiSet.size !== 9) {
    errors.push(`RETI 타입 개수 오류: ${retiSet.size}/9`)
  }

  return {
    isValid: errors.length === 0 && duplicates.length === 0,
    errors,
    stats: {
      total: HEROES_144.length,
      mbtiCount: mbtiSet.size,
      retiCount: retiSet.size,
      duplicates
    }
  }
}

/**
 * v1.1 엔진용 영웅 선택 함수
 * MBTI × RETI 타이브레이커 적용 후 최종 영웅 매칭
 */
export function selectHero(mbti: string, retiTop: number, scores: any): Hero {
  let finalReti = retiTop
  
  // ENFJ 경계 케이스: 7↔8 분기
  if (mbti === 'ENFJ') {
    const E = scores.Big5?.E_b5 || 0
    const C = scores.Big5?.C || 0
    const N = scores.Big5?.N_b5 || 0
    
    // 도전형(8) 특성: 주도권, 압박 내성, 결단력
    if (retiTop === 7 && E > 0.8 && C > 0.4 && N < 0.2) {
      finalReti = 8
    }
  }
  
  // 최종 매칭
  const hero = matchHero(mbti, `r${finalReti}`)
  
  // 매칭 실패 시 기본 영웅 반환
  if (!hero) {
    return {
      id: `${mbti.toLowerCase()}-${finalReti}`,
      number: 0,
      mbti,
      reti: String(finalReti),
      retiType: '탐험가형',
      name: '내면의 탐험가',
      nameEn: 'Inner Explorer',
      tagline: '당신만의 고유한 여정을 시작하는 영웅',
      description: '아직 정의되지 않은 새로운 영웅 타입입니다.',
      abilities: {
        openness: 70,
        conscientiousness: 60,
        extraversion: 50,
        agreeableness: 60,
        neuroticism: 40
      }
    }
  }
  
  return hero
}

