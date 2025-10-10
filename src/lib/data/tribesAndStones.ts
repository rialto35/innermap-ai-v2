// lib/data/tribesAndStones.ts
// 이너맵 AI - 12부족 + 12결정석 완전 정의

export interface Tribe {
  id: number
  name: string          // 부족 이름
  nameKo: string        // 한글 이름
  nameEn: string        // 영문 이름
  symbol: string        // 상징
  color: string         // 상징 색
  colorHex: string      // HEX 코드
  emoji: string         // 이모지
  // 핵심 특성
  coreValue: string     // 핵심 가치
  archetype: string     // 성향 코드
  keywords: string[]    // 키워드들
  // 설명
  description: string
  // 대립 관계
  opposingTribe?: string
}

export interface Stone {
  id: number
  name: string          // 결정석 이름
  nameKo: string        // 한글 이름
  nameEn: string        // 영문 이름
  symbol: string        // 상징
  // Big5 대응
  big5Mapping: {
    openness?: 'high' | 'low' | 'avg'
    conscientiousness?: 'high' | 'low' | 'avg'
    extraversion?: 'high' | 'low' | 'avg'
    agreeableness?: 'high' | 'low' | 'avg'
    neuroticism?: 'high' | 'low' | 'avg'
  }
  // 핵심 특성
  coreValue: string     // 핵심 가치
  growthKeyword: string // 성장 키워드
  // 설명
  description: string
  // 효과
  effect: string
}

// ============================================
// 12부족 (Tribes of Essence) - 선천적 본질
// ============================================
export const TRIBES_12: Tribe[] = [
  {
    id: 1,
    name: 'Lumin',
    nameKo: '루민',
    nameEn: 'Lumin',
    symbol: '빛의 수정',
    color: '은백색',
    colorHex: '#E8E8F0',
    emoji: '🔮',
    coreValue: '조화·공감·치유',
    archetype: '감정 직관형 / 평화주의자',
    keywords: ['조화', '공감', '치유', '균형', '내면의 조율자'],
    description: '타인의 감정을 빛으로 읽는 자들. 이들은 세상의 균형을 유지하는 내면의 조율자다.',
    opposingTribe: 'Neva'
  },
  {
    id: 2,
    name: 'Varno',
    nameKo: '바르노',
    nameEn: 'Varno',
    symbol: '강철의 인장',
    color: '남색',
    colorHex: '#1E3A8A',
    emoji: '⚡',
    coreValue: '규율·신뢰·완벽성',
    archetype: '판단형 / 관리자형',
    keywords: ['규율', '신뢰', '완벽성', '질서', '원칙'],
    description: '바르노는 세상을 질서로 다스린다. 혼란 속에서도 원칙을 세우는 철의 의지.',
    opposingTribe: 'Aurin'
  },
  {
    id: 3,
    name: 'Aurin',
    nameKo: '아우린',
    nameEn: 'Aurin',
    symbol: '불꽃의 원환',
    color: '주황빛 불꽃',
    colorHex: '#FB923C',
    emoji: '🔥',
    coreValue: '창조·도전·변혁',
    archetype: '직관형 / 개척자형',
    keywords: ['창조', '도전', '변혁', '불가능의 부정', '개척'],
    description: '불가능을 부정하는 자들. 불꽃처럼 태어나 불꽃처럼 사라지는 창조의 손.',
    opposingTribe: 'Varno'
  },
  {
    id: 4,
    name: 'Neva',
    nameKo: '네바',
    nameEn: 'Neva',
    symbol: '그림자의 결정',
    color: '남보라색',
    colorHex: '#7C3AED',
    emoji: '🌊',
    coreValue: '감수성·통찰·예술',
    archetype: '감정 내향형 / 탐색가형',
    keywords: ['감수성', '통찰', '예술', '어둠 속 진실', '고독'],
    description: '세상의 어둠을 두려워하지 않는다. 그들은 고독 속에서 진실의 색을 본다.',
    opposingTribe: 'Lumin'
  },
  {
    id: 5,
    name: 'Silva',
    nameKo: '실바',
    nameEn: 'Silva',
    symbol: '생명의 잎새',
    color: '녹색',
    colorHex: '#10B981',
    emoji: '🌿',
    coreValue: '성장·순응·자연의 흐름',
    archetype: '감각형 / 양육자형',
    keywords: ['성장', '순응', '자연', '생명의 주기', '리듬'],
    description: '실바의 사람들은 자연의 리듬과 함께 산다. 그들은 생명의 주기 속에서 자신의 역할을 배운다.',
    opposingTribe: 'Dras'
  },
  {
    id: 6,
    name: 'Dras',
    nameKo: '드라스',
    nameEn: 'Dras',
    symbol: '톱니의 문장',
    color: '회색·은철빛',
    colorHex: '#6B7280',
    emoji: '⚙️',
    coreValue: '분석·효율·논리',
    archetype: '사고형 / 분석가형',
    keywords: ['분석', '효율', '논리', '구조', '증명'],
    description: '드라스는 감정보다 구조를, 직관보다 증명을 신뢰한다. 차가운 이성의 왕국.',
    opposingTribe: 'Silva'
  },
  {
    id: 7,
    name: 'Soran',
    nameKo: '소란',
    nameEn: 'Soran',
    symbol: '바람의 구체',
    color: '하늘색',
    colorHex: '#38BDF8',
    emoji: '🌪️',
    coreValue: '자유·탐험·변화',
    archetype: '외향형 / 모험가형',
    keywords: ['자유', '탐험', '변화', '호기심', '새로운 세상'],
    description: '바람은 멈추지 않는다. 소란의 자들은 새로운 세상을 향한 호기심으로 가득 차 있다.',
    opposingTribe: 'Verma'
  },
  {
    id: 8,
    name: 'Verma',
    nameKo: '베르마',
    nameEn: 'Verma',
    symbol: '대지의 돌기둥',
    color: '황토색',
    colorHex: '#D97706',
    emoji: '🪨',
    coreValue: '안정·근면·지속',
    archetype: '감각형 / 현실주의자',
    keywords: ['안정', '근면', '지속', '현실의 버팀목', '흔들리지 않음'],
    description: '세상은 흔들려도, 베르마는 흔들리지 않는다. 이들은 현실의 버팀목이다.',
    opposingTribe: 'Soran'
  },
  {
    id: 9,
    name: 'Eira',
    nameKo: '에이라',
    nameEn: 'Eira',
    symbol: '균형의 저울',
    color: '백금색',
    colorHex: '#E5E7EB',
    emoji: '⚖️',
    coreValue: '공정·중용·판단',
    archetype: '사고·감정의 중간형 / 조정자형',
    keywords: ['공정', '중용', '판단', '균형', '중재자'],
    description: '에이라는 어느 편에도 서지 않는다. 진리와 혼돈의 경계에서 균형을 유지하는 자들.',
    opposingTribe: undefined
  },
  {
    id: 10,
    name: 'Nova',
    nameKo: '노바',
    nameEn: 'Nova',
    symbol: '별의 핵',
    color: '보랏빛',
    colorHex: '#A855F7',
    emoji: '🌌',
    coreValue: '비전·통찰·상상',
    archetype: '직관형 / 비전가형',
    keywords: ['비전', '통찰', '상상', '시간 너머', '존재하지 않는 세상'],
    description: '그들은 아직 존재하지 않는 세상을 본다. 노바의 시선은 늘 시간 너머에 있다.',
    opposingTribe: 'Dras'
  },
  {
    id: 11,
    name: 'Tenbra',
    nameKo: '텐브라',
    nameEn: 'Tenbra',
    symbol: '심연의 반석',
    color: '암청색',
    colorHex: '#1E293B',
    emoji: '🌊',
    coreValue: '인내·생존·회복력',
    archetype: '내향형 / 현실형',
    keywords: ['인내', '생존', '회복력', '침묵의 강인함', '끝에서 살아남음'],
    description: '세상의 끝에서 살아남는 자들. 그들의 침묵은 약함이 아니라, 강인함의 증거다.',
    opposingTribe: 'Aurin'
  },
  {
    id: 12,
    name: 'Sera',
    nameKo: '세라',
    nameEn: 'Sera',
    symbol: '무지개의 심장',
    color: '무지개빛·오팔톤',
    colorHex: '#F9A8D4',
    emoji: '🌈',
    coreValue: '희망·연결·가능성',
    archetype: '감정형 / 이상주의자',
    keywords: ['희망', '연결', '가능성', '통합', '조화'],
    description: '세라의 존재는 모든 부족의 빛을 하나로 잇는다. 이들은 진정한 조화의 상징이다.',
    opposingTribe: undefined
  }
]

// ================================================
// 12결정석 (Stones of Growth) - 후천적 성장
// ================================================
export const STONES_12: Stone[] = [
  {
    id: 1,
    name: 'Arche',
    nameKo: '아르케',
    nameEn: 'Arche',
    symbol: '기원의 빛',
    big5Mapping: {
      openness: 'high',
      neuroticism: 'low'
    },
    coreValue: '자기이해·자각·정체성',
    growthKeyword: '나는 누구인가를 안다',
    description: '아르케는 모든 여정의 시작이다. 자기 자신을 이해할 때, 변화의 문이 열린다.',
    effect: '자기인식 +30%, 내적 안정 +25%'
  },
  {
    id: 2,
    name: 'Ignis',
    nameKo: '이그니스',
    nameEn: 'Ignis',
    symbol: '불꽃의 심장',
    big5Mapping: {
      extraversion: 'high',
      conscientiousness: 'high'
    },
    coreValue: '열정·추진력·실행',
    growthKeyword: '움직임이 나를 만든다',
    description: '이그니스는 타오르는 욕망의 에너지다. 그 불은 목표를 향해 스스로를 단련시킨다.',
    effect: '추진력 +35%, 실행력 +30%'
  },
  {
    id: 3,
    name: 'Neia',
    nameKo: '네이아',
    nameEn: 'Neia',
    symbol: '흐름의 눈물',
    big5Mapping: {
      agreeableness: 'high',
      neuroticism: 'low'
    },
    coreValue: '감정의 정화·회복·수용',
    growthKeyword: '흐름에 저항하지 않는다',
    description: '네이아의 물은 고통을 씻고 마음을 다시 맑게 한다. 감정은 약점이 아닌 재생의 힘이다.',
    effect: '감정 회복력 +30%, 정서 안정 +25%'
  },
  {
    id: 4,
    name: 'Verdi',
    nameKo: '베르디',
    nameEn: 'Verdi',
    symbol: '생명의 싹',
    big5Mapping: {
      conscientiousness: 'high',
      openness: 'high'
    },
    coreValue: '꾸준함·성장·학습',
    growthKeyword: '매일의 반복이 나를 자란다',
    description: '베르디는 작은 변화를 사랑한다. 느리지만 확실히 성장하는 루틴의 결정체다.',
    effect: '성장률 +25%, 학습 효율 +30%'
  },
  {
    id: 5,
    name: 'Noctus',
    nameKo: '노크투스',
    nameEn: 'Noctus',
    symbol: '어둠의 거울',
    big5Mapping: {
      neuroticism: 'high',
      openness: 'high'
    },
    coreValue: '내면 통찰·그림자 수용',
    growthKeyword: '어둠을 직면할 때, 빛이 보인다',
    description: '노크투스는 인간의 어두운 감정을 직시하게 한다. 불완전함 속에서 성숙이 싹튼다.',
    effect: '통찰력 +35%, 자기수용 +25%'
  },
  {
    id: 6,
    name: 'Aurea',
    nameKo: '아우레아',
    nameEn: 'Aurea',
    symbol: '황금의 조화',
    big5Mapping: {
      openness: 'avg',
      conscientiousness: 'avg',
      extraversion: 'avg',
      agreeableness: 'avg',
      neuroticism: 'avg'
    },
    coreValue: '균형·평형·내외 통합',
    growthKeyword: '균형이 완성을 만든다',
    description: '아우레아는 삶의 모든 축을 맞추려는 존재다. 조화는 멈춤이 아니라 끊임없는 미세 조정이다.',
    effect: '전체 능력치 균형 +20%'
  },
  {
    id: 7,
    name: 'Mechar',
    nameKo: '메카르',
    nameEn: 'Mechar',
    symbol: '강철의 기어',
    big5Mapping: {
      conscientiousness: 'high',
      neuroticism: 'low'
    },
    coreValue: '체계·효율·정확성',
    growthKeyword: '정확함은 신뢰를 낳는다',
    description: '메카르는 혼란 속에서도 질서를 유지한다. 시스템을 이해하고 움직이는 자들의 상징.',
    effect: '효율성 +30%, 체계성 +25%'
  },
  {
    id: 8,
    name: 'Elara',
    nameKo: '엘라라',
    nameEn: 'Elara',
    symbol: '공기의 생각',
    big5Mapping: {
      openness: 'high',
      extraversion: 'high'
    },
    coreValue: '상상·유연성·표현',
    growthKeyword: '상상은 현실의 씨앗이다',
    description: '엘라라는 자유로운 사고의 결정체다. 그들의 말은 새로운 세계를 창조한다.',
    effect: '창의력 +35%, 표현력 +30%'
  },
  {
    id: 9,
    name: 'Myr',
    nameKo: '미르',
    nameEn: 'Myr',
    symbol: '깊은 바다의 조각',
    big5Mapping: {
      agreeableness: 'high',
      conscientiousness: 'high'
    },
    coreValue: '공감·헌신·신뢰',
    growthKeyword: '함께일 때 강해진다',
    description: '미르는 관계의 돌이다. 타인과의 신뢰를 쌓으며, 그 속에서 스스로를 재발견한다.',
    effect: '공감력 +35%, 신뢰도 +30%'
  },
  {
    id: 10,
    name: 'Zarc',
    nameKo: '자르크',
    nameEn: 'Zarc',
    symbol: '번개의 핵',
    big5Mapping: {
      openness: 'high',
      extraversion: 'high',
      neuroticism: 'high'
    },
    coreValue: '직감·혁신·변속',
    growthKeyword: '충격이 새로운 질서를 만든다',
    description: '자르크는 예측 불가능한 창조자. 혼란의 전류를 통제해 변화의 시그널을 만든다.',
    effect: '혁신력 +40%, 직관력 +30%'
  },
  {
    id: 11,
    name: 'Lumer',
    nameKo: '루메르',
    nameEn: 'Lumer',
    symbol: '새벽의 깃털',
    big5Mapping: {
      neuroticism: 'low',
      agreeableness: 'high'
    },
    coreValue: '희망·회복·낙관',
    growthKeyword: '내일은 오늘보다 낫다',
    description: '루메르는 절망 속에서도 빛을 본다. 작은 긍정이 모든 변화를 이끌어낸다.',
    effect: '회복력 +35%, 낙관성 +30%'
  },
  {
    id: 12,
    name: 'Xain',
    nameKo: '크세인',
    nameEn: 'Xain',
    symbol: '반사하는 거울',
    big5Mapping: {
      openness: 'high',
      conscientiousness: 'high',
      neuroticism: 'low'
    },
    coreValue: '자기인식·피드백·성찰',
    growthKeyword: '나는 나를 관찰하는 자',
    description: '크세인은 자기 점검의 돌이다. 이들은 경험을 분석하고, 그 속에서 새로운 나를 재구성한다.',
    effect: '성찰력 +35%, 자기인식 +30%'
  }
]

// ================================================
// 헬퍼 함수들
// ================================================
export function getTribeById(id: number): Tribe | undefined {
  return TRIBES_12.find(t => t.id === id)
}

export function getTribeByName(name: string): Tribe | undefined {
  return TRIBES_12.find(t => 
    t.name.toLowerCase() === name.toLowerCase() ||
    t.nameKo === name ||
    t.nameEn.toLowerCase() === name.toLowerCase()
  )
}

export function getStoneById(id: number): Stone | undefined {
  return STONES_12.find(s => s.id === id)
}

export function getStoneByName(name: string): Stone | undefined {
  return STONES_12.find(s => 
    s.name.toLowerCase() === name.toLowerCase() ||
    s.nameKo === name ||
    s.nameEn.toLowerCase() === name.toLowerCase()
  )
}

export function getOpposingTribe(tribeName: string): Tribe | undefined {
  const tribe = getTribeByName(tribeName)
  if (!tribe || !tribe.opposingTribe) return undefined
  return getTribeByName(tribe.opposingTribe)
}

// Big5 점수로 최적 결정석 추천
export function recommendStone(big5: {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}): Stone {
  // 각 차원별 high/low/avg 판단 (50 기준)
  const profile = {
    openness: big5.openness > 65 ? 'high' : big5.openness < 35 ? 'low' : 'avg',
    conscientiousness: big5.conscientiousness > 65 ? 'high' : big5.conscientiousness < 35 ? 'low' : 'avg',
    extraversion: big5.extraversion > 65 ? 'high' : big5.extraversion < 35 ? 'low' : 'avg',
    agreeableness: big5.agreeableness > 65 ? 'high' : big5.agreeableness < 35 ? 'low' : 'avg',
    neuroticism: big5.neuroticism > 65 ? 'high' : big5.neuroticism < 35 ? 'low' : 'avg'
  }
  // 매칭 스코어 계산
  const scores = STONES_12.map(stone => {
    let score = 0
    let matches = 0
    Object.keys(stone.big5Mapping).forEach(key => {
      const k = key as keyof typeof profile
      if (stone.big5Mapping[k] === profile[k]) {
        score += 1
        matches += 1
      }
    })
    return { stone, score, matches }
  })
  // 가장 높은 스코어의 결정석 반환
  scores.sort((a, b) => b.score - a.score)
  return scores[0].stone
}

export function generateHeroIntro(tribeName: string, stoneName: string): string {
  const tribe = getTribeByName(tribeName)
  const stone = getStoneByName(stoneName)
  if (!tribe || !stone) {
    return '영웅 정보를 찾을 수 없습니다.'
  }
  return `당신은 ${tribe.nameKo} 부족에서 태어난 자이며,\n후천적으로 '${stone.nameKo} 결정석'과 공명합니다.\n\n${tribe.coreValue}의 본질을 타고났으며,\n${stone.coreValue}로 성장하는 여정을 걷습니다.\n\n당신의 영웅 서사는 ${tribe.symbol}에서 시작해\n${stone.symbol}로 완성됩니다.`
}

// 검증 함수
export function validateTribesAndStones(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  if (TRIBES_12.length !== 12) {
    errors.push(`부족 개수 오류: ${TRIBES_12.length}/12`)
  }
  if (STONES_12.length !== 12) {
    errors.push(`결정석 개수 오류: ${STONES_12.length}/12`)
  }
  return {
    isValid: errors.length === 0,
    errors
  }
}
