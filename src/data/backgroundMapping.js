// 39개 색채심리에 따른 자연 원소와 장면 매핑
export const backgroundMapping = {
  // 기본 색상들
  "red": { 
    element: "화산 불꽃", 
    scene: "활화산 정상", 
    gradient: "from-red-500 to-red-700" 
  },
  "orange": { 
    element: "황혼의 태양", 
    scene: "사막의 일몰", 
    gradient: "from-orange-400 to-red-600" 
  },
  "yellow": { 
    element: "번개 구름", 
    scene: "천공의 뇌운", 
    gradient: "from-yellow-400 to-amber-600" 
  },
  "green": { 
    element: "깊은 숲", 
    scene: "신비로운 정글", 
    gradient: "from-green-500 to-emerald-700" 
  },
  "blue": { 
    element: "깊은 바다", 
    scene: "신비로운 수중 궁전", 
    gradient: "from-blue-500 to-blue-700" 
  },
  "purple": { 
    element: "보라빛 안개", 
    scene: "신비로운 마법 숲", 
    gradient: "from-purple-500 to-purple-700" 
  },
  "pink": { 
    element: "벚꽃 폭풍", 
    scene: "꿈의 벚꽃 정원", 
    gradient: "from-pink-400 to-pink-600" 
  },
  "brown": { 
    element: "고대 나무", 
    scene: "신성한 고목 숲", 
    gradient: "from-amber-700 to-brown-800" 
  },
  "gray": { 
    element: "구름 산", 
    scene: "안개 낀 산봉우리", 
    gradient: "from-gray-400 to-gray-600" 
  },
  "black": { 
    element: "우주의 어둠", 
    scene: "무한한 우주 공간", 
    gradient: "from-gray-800 to-black" 
  },
  "white": { 
    element: "순백의 눈", 
    scene: "무한한 설원", 
    gradient: "from-white to-gray-100" 
  },

  // 특수 색상들
  "turquoise": { 
    element: "깊은 바다", 
    scene: "신비로운 수중 궁전", 
    gradient: "from-teal-400 to-blue-600" 
  },
  "cyan": { 
    element: "열대 바다", 
    scene: "투명한 산호초", 
    gradient: "from-cyan-400 to-blue-500" 
  },
  "lime": { 
    element: "신선한 잎", 
    scene: "새싹이 돋는 봄 정원", 
    gradient: "from-lime-400 to-green-500" 
  },
  "emerald": { 
    element: "보석 숲", 
    scene: "빛나는 에메랄드 동굴", 
    gradient: "from-emerald-400 to-green-600" 
  },
  "teal": { 
    element: "깊은 호수", 
    scene: "고요한 산중 호수", 
    gradient: "from-teal-500 to-blue-600" 
  },
  "indigo": { 
    element: "밤하늘", 
    scene: "별이 빛나는 밤하늘", 
    gradient: "from-indigo-500 to-purple-600" 
  },
  "violet": { 
    element: "보라빛 안개", 
    scene: "신비로운 마법 숲", 
    gradient: "from-violet-500 to-purple-600" 
  },
  "magenta": { 
    element: "마법의 꽃", 
    scene: "환상적인 마법 정원", 
    gradient: "from-pink-500 to-purple-600" 
  },
  "rose": { 
    element: "장미 정원", 
    scene: "로맨틱한 장미원", 
    gradient: "from-rose-400 to-pink-500" 
  },
  "amber": { 
    element: "황금빛 숲", 
    scene: "가을의 황금 숲", 
    gradient: "from-amber-400 to-orange-500" 
  },
  "gold": { 
    element: "황금 사막", 
    scene: "황금빛 사막의 일출", 
    gradient: "from-yellow-400 to-amber-500" 
  },
  "silver": { 
    element: "은빛 달빛", 
    scene: "달빛이 비치는 호수", 
    gradient: "from-gray-300 to-gray-500" 
  },
  "bronze": { 
    element: "고대 유적", 
    scene: "신비로운 고대 신전", 
    gradient: "from-amber-600 to-orange-700" 
  },
  "copper": { 
    element: "구리 광산", 
    scene: "빛나는 구리 동굴", 
    gradient: "from-orange-600 to-red-700" 
  },
  "coral": { 
    element: "산호초", 
    scene: "다채로운 산호초 바다", 
    gradient: "from-orange-400 to-pink-500" 
  },
  "salmon": { 
    element: "연어 강", 
    scene: "연어가 오르는 맑은 강", 
    gradient: "from-pink-300 to-orange-400" 
  },
  "peach": { 
    element: "복숭아 과수원", 
    scene: "향기로운 복숭아 정원", 
    gradient: "from-orange-300 to-pink-400" 
  },
  "apricot": { 
    element: "살구 나무", 
    scene: "황금빛 살구 과수원", 
    gradient: "from-yellow-300 to-orange-400" 
  },
  "lemon": { 
    element: "레몬 과수원", 
    scene: "상큼한 레몬 정원", 
    gradient: "from-yellow-300 to-green-400" 
  },
  "lime": { 
    element: "라임 나무", 
    scene: "신선한 라임 과수원", 
    gradient: "from-green-300 to-yellow-400" 
  },
  "mint": { 
    element: "민트 정원", 
    scene: "시원한 민트 숲", 
    gradient: "from-green-300 to-teal-400" 
  },
  "sage": { 
    element: "세이지 초원", 
    scene: "고요한 세이지 들판", 
    gradient: "from-gray-400 to-green-500" 
  },
  "olive": { 
    element: "올리브 나무", 
    scene: "지중해의 올리브 숲", 
    gradient: "from-green-600 to-yellow-600" 
  },
  "navy": { 
    element: "깊은 바다", 
    scene: "어두운 심해", 
    gradient: "from-blue-800 to-indigo-900" 
  },
  "royal": { 
    element: "왕실 정원", 
    scene: "화려한 왕실 궁전", 
    gradient: "from-purple-600 to-blue-700" 
  },
  "plum": { 
    element: "자두 나무", 
    scene: "보라빛 자두 과수원", 
    gradient: "from-purple-600 to-pink-700" 
  },
  "maroon": { 
    element: "적갈색 숲", 
    scene: "가을의 적갈색 숲", 
    gradient: "from-red-800 to-brown-700" 
  },
  "burgundy": { 
    element: "버건디 포도밭", 
    scene: "고급스러운 포도밭", 
    gradient: "from-red-700 to-purple-800" 
  },
  "crimson": { 
    element: "진홍빛 꽃", 
    scene: "화려한 진홍 정원", 
    gradient: "from-red-600 to-pink-700" 
  },
  "scarlet": { 
    element: "주홍빛 새벽", 
    scene: "주홍빛 일출", 
    gradient: "from-red-500 to-orange-600" 
  },
  "vermilion": { 
    element: "주황빛 화산", 
    scene: "활화산의 용암", 
    gradient: "from-red-500 to-orange-500" 
  },
  "cobalt": { 
    element: "코발트 광산", 
    scene: "빛나는 코발트 동굴", 
    gradient: "from-blue-600 to-indigo-700" 
  },
  "ultramarine": { 
    element: "깊은 바다", 
    scene: "무한한 심해", 
    gradient: "from-blue-700 to-indigo-800" 
  },
  "sapphire": { 
    element: "사파이어 보석", 
    scene: "빛나는 사파이어 동굴", 
    gradient: "from-blue-600 to-purple-700" 
  },
  "amethyst": { 
    element: "자수정 동굴", 
    scene: "신비로운 자수정 광산", 
    gradient: "from-purple-500 to-pink-600" 
  },
  "jade": { 
    element: "비취 숲", 
    scene: "고요한 비취 호수", 
    gradient: "from-green-500 to-teal-600" 
  },
  "ivory": { 
    element: "상아빛 구름", 
    scene: "순백의 구름 위", 
    gradient: "from-white to-yellow-100" 
  },
  "cream": { 
    element: "크림빛 모래", 
    scene: "부드러운 해변", 
    gradient: "from-yellow-50 to-orange-100" 
  },
  "beige": { 
    element: "베이지빛 사막", 
    scene: "고요한 사막의 모래언덕", 
    gradient: "from-yellow-100 to-orange-200" 
  },
  "tan": { 
    element: "황갈색 초원", 
    scene: "넓은 사바나", 
    gradient: "from-yellow-200 to-orange-300" 
  },
  "khaki": { 
    element: "카키빛 군사기지", 
    scene: "전략적 군사 요새", 
    gradient: "from-yellow-300 to-green-400" 
  },
  "charcoal": { 
    element: "숯빛 구름", 
    scene: "폭풍 전의 어두운 하늘", 
    gradient: "from-gray-600 to-gray-800" 
  },
  "slate": { 
    element: "슬레이트 바위", 
    scene: "차가운 산악 지대", 
    gradient: "from-gray-500 to-blue-600" 
  },
  "steel": { 
    element: "강철 공장", 
    scene: "현대적인 산업 도시", 
    gradient: "from-gray-400 to-blue-500" 
  }
};
