// MBTI 16가지 × 에니어그램 6가지(3,4,5,6,7,8) = 96개 영웅 조합
export const heroMapping = {
  // ENFP 영웅들 (6개)
  "ENFP_type3": { 
    name: "스프린트 어드벤처", 
    title: "자유로운 탐험가", 
    powers: ["창의적 해결", "빠른 적응", "성취 지향"], 
    personality: "열정적이고 목표 지향적인 모험가" 
  },
  "ENFP_type4": { 
    name: "드림 위버", 
    title: "꿈의 직조자", 
    powers: ["감성적 통찰", "예술적 표현", "독창적 사고"], 
    personality: "깊은 감수성과 창의성을 가진 예술가" 
  },
  "ENFP_type5": { 
    name: "커리어스 마인드", 
    title: "호기심의 탐구자", 
    powers: ["지적 탐구", "혁신적 아이디어", "다각적 분석"], 
    personality: "끊임없이 새로운 것을 탐구하는 지식인" 
  },
  "ENFP_type6": { 
    name: "로열 가디언", 
    title: "충성의 수호자", 
    powers: ["신뢰성", "팀워크", "안전 보장"], 
    personality: "동료를 위해 헌신하는 충성스러운 수호자" 
  },
  "ENFP_type7": { 
    name: "즉흥 플레이어", 
    title: "즉흥의 마법사", 
    powers: ["즉흥적 창의", "다양한 경험", "긍정적 에너지"], 
    personality: "즉흥적이고 다재다능한 엔터테이너" 
  },
  "ENFP_type8": { 
    name: "패션 리더", 
    title: "열정의 지도자", 
    powers: ["강력한 리더십", "정의감", "변화 추진"], 
    personality: "강력한 의지로 변화를 이끄는 열정적 지도자" 
  },

  // INTJ 영웅들 (6개)
  "INTJ_type3": { 
    name: "마스터 아키텍트", 
    title: "완벽한 설계자", 
    powers: ["전략적 계획", "효율성 극대화", "성과 달성"], 
    personality: "완벽한 계획으로 목표를 달성하는 설계자" 
  },
  "INTJ_type4": { 
    name: "사이언티스트", 
    title: "지혜의 탐구자", 
    powers: ["깊은 분석", "독창적 통찰", "지적 완성"], 
    personality: "깊이 있는 지식과 독창적 사고의 소유자" 
  },
  "INTJ_type5": { 
    name: "마스터 스트래티지스트", 
    title: "전략의 지배자", 
    powers: ["완벽한 계획", "강인한 의지", "리더십"], 
    personality: "냉철하고 강력한 전략가" 
  },
  "INTJ_type6": { 
    name: "시스템 가디언", 
    title: "체계의 수호자", 
    powers: ["체계적 분석", "위험 예측", "안정성 확보"], 
    personality: "체계적이고 신중한 시스템 수호자" 
  },
  "INTJ_type7": { 
    name: "비전리 스트래티지스트", 
    title: "미래의 설계자", 
    powers: ["미래 예측", "혁신적 전략", "지적 모험"], 
    personality: "미래를 내다보는 혁신적 전략가" 
  },
  "INTJ_type8": { 
    name: "임페리얼 마스터", 
    title: "권력의 지배자", 
    powers: ["절대적 권위", "강력한 의지", "체계적 지배"], 
    personality: "강력한 의지로 체계를 지배하는 권력자" 
  },

  // ESFJ 영웅들 (6개)
  "ESFJ_type3": { 
    name: "하모니 리더", 
    title: "조화의 지도자", 
    powers: ["팀워크 조율", "성과 달성", "관계 구축"], 
    personality: "조화로운 팀워크로 성과를 달성하는 지도자" 
  },
  "ESFJ_type4": { 
    name: "컴패션 가디언", 
    title: "동정의 수호자", 
    powers: ["감정적 지원", "예술적 감성", "공감 능력"], 
    personality: "따뜻한 마음으로 타인을 보호하는 수호자" 
  },
  "ESFJ_type5": { 
    name: "커뮤니티 스콜라", 
    title: "지식의 공유자", 
    powers: ["지식 전달", "체계적 교육", "공동체 발전"], 
    personality: "지식을 나누어 공동체를 발전시키는 교육자" 
  },
  "ESFJ_type6": { 
    name: "로열 프로텍터", 
    title: "충성의 보호자", 
    powers: ["신뢰성", "안전 보장", "팀 지원"], 
    personality: "동료를 위해 헌신하는 충성스러운 보호자" 
  },
  "ESFJ_type7": { 
    name: "소셜 엔터테이너", 
    title: "사회의 즐거움", 
    powers: ["사교성", "즐거운 분위기", "관계 네트워킹"], 
    personality: "사교적이고 즐거운 분위기를 만드는 엔터테이너" 
  },
  "ESFJ_type8": { 
    name: "커뮤니티 챔피언", 
    title: "공동체의 챔피언", 
    powers: ["강력한 리더십", "공동체 보호", "정의감"], 
    personality: "공동체를 위해 강력하게 싸우는 챔피언" 
  },

  // ISTP 영웅들 (6개)
  "ISTP_type3": { 
    name: "프로덕트 마스터", 
    title: "완성의 장인", 
    powers: ["실용적 해결", "효율성", "성과 달성"], 
    personality: "실용적이고 효율적으로 목표를 달성하는 장인" 
  },
  "ISTP_type4": { 
    name: "아티잔 크리에이터", 
    title: "예술의 장인", 
    powers: ["예술적 기술", "독창적 표현", "감성적 완성"], 
    personality: "예술적 감성과 기술을 결합한 창작자" 
  },
  "ISTP_type5": { 
    name: "테크니컬 아날리스트", 
    title: "기술의 분석가", 
    powers: ["기술적 분석", "문제 해결", "지적 탐구"], 
    personality: "기술적 지식과 분석력을 가진 전문가" 
  },
  "ISTP_type6": { 
    name: "시스템 엔지니어", 
    title: "체계의 기술자", 
    powers: ["체계적 해결", "안정성 확보", "실용적 보호"], 
    personality: "체계적이고 안정적인 시스템을 구축하는 기술자" 
  },
  "ISTP_type7": { 
    name: "어드벤처 메카닉", 
    title: "모험의 정비사", 
    powers: ["즉흥적 해결", "다양한 기술", "모험 정신"], 
    personality: "즉흥적이고 다재다능한 모험가" 
  },
  "ISTP_type8": { 
    name: "워리어 크래프터", 
    title: "전사의 장인", 
    powers: ["강력한 기술", "전투 능력", "실용적 전략"], 
    personality: "강력한 기술과 전투력을 가진 전사" 
  },

  // INFP 영웅들 (6개)
  "INFP_type3": { 
    name: "드림 아치브", 
    title: "꿈의 성취자", 
    powers: ["창의적 성취", "감성적 동기", "이상 실현"], 
    personality: "꿈을 현실로 만드는 감성적 성취자" 
  },
  "INFP_type4": { 
    name: "소울 아티스트", 
    title: "영혼의 예술가", 
    powers: ["깊은 감성", "예술적 표현", "독창적 통찰"], 
    personality: "깊은 감성과 예술적 영감을 가진 예술가" 
  },
  "INFP_type5": { 
    name: "와이즈 드리머", 
    title: "지혜의 꿈꾸는이", 
    powers: ["지적 통찰", "창의적 사고", "깊은 이해"], 
    personality: "지적 깊이와 창의적 상상력을 가진 꿈꾸는이" 
  },
  "INFP_type6": { 
    name: "페이스풀 가디언", 
    title: "신념의 수호자", 
    powers: ["신념의 지킴", "감성적 지원", "안전한 공간"], 
    personality: "신념을 지키며 타인을 보호하는 수호자" 
  },
  "INFP_type7": { 
    name: "임프로브 드리머", 
    title: "즉흥의 꿈꾸는이", 
    powers: ["즉흥적 창의", "다양한 상상", "자유로운 영혼"], 
    personality: "즉흥적이고 자유로운 상상력을 가진 꿈꾸는이" 
  },
  "INFP_type8": { 
    name: "패션 드리머", 
    title: "열정의 꿈꾸는이", 
    powers: ["강력한 신념", "정의감", "변화 추진"], 
    personality: "강력한 신념으로 변화를 꿈꾸는 이상주의자" 
  },

  // ENTJ 영웅들 (6개)
  "ENTJ_type3": { 
    name: "엑제큐티브 마스터", 
    title: "실행의 지배자", 
    powers: ["전략적 실행", "효율성 극대화", "성과 달성"], 
    personality: "전략적 사고로 목표를 달성하는 실행가" 
  },
  "ENTJ_type4": { 
    name: "비전리 리더", 
    title: "비전의 지도자", 
    powers: ["강력한 비전", "감성적 리더십", "혁신 추진"], 
    personality: "강력한 비전으로 혁신을 이끄는 지도자" 
  },
  "ENTJ_type5": { 
    name: "스트래티지 마스터", 
    title: "전략의 대가", 
    powers: ["완벽한 전략", "지적 분석", "강력한 의지"], 
    personality: "완벽한 전략과 강력한 의지를 가진 대가" 
  },
  "ENTJ_type6": { 
    name: "시스템 리더", 
    title: "체계의 지도자", 
    powers: ["체계적 리더십", "안정성 확보", "신뢰성"], 
    personality: "체계적이고 안정적인 시스템을 이끄는 지도자" 
  },
  "ENTJ_type7": { 
    name: "비전리 어드벤처", 
    title: "미래의 모험가", 
    powers: ["미래 예측", "혁신적 모험", "지적 도전"], 
    personality: "미래를 내다보며 혁신을 추구하는 모험가" 
  },
  "ENTJ_type8": { 
    name: "임페리얼 리더", 
    title: "제국의 지배자", 
    powers: ["절대적 권위", "강력한 리더십", "체계적 지배"], 
    personality: "절대적 권위로 체계를 지배하는 제국의 지배자" 
  },

  // ISFJ 영웅들 (6개)
  "ISFJ_type3": { 
    name: "커뮤니티 빌더", 
    title: "공동체의 건설자", 
    powers: ["실용적 건설", "효율성", "성과 달성"], 
    personality: "실용적으로 공동체를 건설하는 건설자" 
  },
  "ISFJ_type4": { 
    name: "커뮤니티 아티스트", 
    title: "공동체의 예술가", 
    powers: ["감성적 건설", "예술적 표현", "공동체 미화"], 
    personality: "감성적으로 공동체를 아름답게 만드는 예술가" 
  },
  "ISFJ_type5": { 
    name: "커뮤니티 스콜라", 
    title: "공동체의 학자", 
    powers: ["지식적 건설", "체계적 교육", "공동체 발전"], 
    personality: "지식으로 공동체를 발전시키는 학자" 
  },
  "ISFJ_type6": { 
    name: "커뮤니티 가디언", 
    title: "공동체의 수호자", 
    powers: ["안전 보장", "신뢰성", "공동체 보호"], 
    personality: "공동체의 안전을 지키는 충성스러운 수호자" 
  },
  "ISFJ_type7": { 
    name: "커뮤니티 엔터테이너", 
    title: "공동체의 즐거움", 
    powers: ["즐거운 분위기", "사교성", "공동체 활성화"], 
    personality: "공동체에 즐거움을 가져오는 엔터테이너" 
  },
  "ISFJ_type8": { 
    name: "커뮤니티 챔피언", 
    title: "공동체의 챔피언", 
    powers: ["강력한 보호", "정의감", "공동체 수호"], 
    personality: "공동체를 위해 강력하게 싸우는 챔피언" 
  },

  // ENTP 영웅들 (6개)
  "ENTP_type3": { 
    name: "이노베이션 마스터", 
    title: "혁신의 지배자", 
    powers: ["혁신적 해결", "효율성", "성과 달성"], 
    personality: "혁신적으로 목표를 달성하는 창의적 지배자" 
  },
  "ENTP_type4": { 
    name: "크리에이티브 리벨", 
    title: "창의의 반역자", 
    powers: ["창의적 반역", "예술적 혁신", "독창적 사고"], 
    personality: "창의적으로 기존을 뒤엎는 혁신가" 
  },
  "ENTP_type5": { 
    name: "인텔렉추얼 디베이터", 
    title: "지적 논쟁가", 
    powers: ["지적 논쟁", "혁신적 아이디어", "분석적 사고"], 
    personality: "지적 논쟁을 통해 혁신을 추구하는 사상가" 
  },
  "ENTP_type6": { 
    name: "어드벤처 가디언", 
    title: "모험의 수호자", 
    powers: ["모험적 보호", "혁신적 안전", "팀워크"], 
    personality: "모험적이면서도 안전을 고려하는 수호자" 
  },
  "ENTP_type7": { 
    name: "즉흥 이노베이터", 
    title: "즉흥의 혁신가", 
    powers: ["즉흥적 혁신", "다양한 아이디어", "즉흥적 창의"], 
    personality: "즉흥적이고 창의적인 혁신가" 
  },
  "ENTP_type8": { 
    name: "리벨리언 리더", 
    title: "반역의 지도자", 
    powers: ["강력한 반역", "혁신적 리더십", "변화 추진"], 
    personality: "강력한 의지로 혁신을 이끄는 반역의 지도자" 
  },

  // ISFP 영웅들 (6개)
  "ISFP_type3": { 
    name: "아티잔 아치브", 
    title: "예술의 성취자", 
    powers: ["예술적 성취", "감성적 완성", "아름다움 창조"], 
    personality: "예술적 감성으로 아름다움을 창조하는 성취자" 
  },
  "ISFP_type4": { 
    name: "소울 크리에이터", 
    title: "영혼의 창작자", 
    powers: ["깊은 감성", "예술적 표현", "독창적 영감"], 
    personality: "깊은 감성과 예술적 영감을 가진 창작자" 
  },
  "ISFP_type5": { 
    name: "와이즈 아티잔", 
    title: "지혜의 장인", 
    powers: ["지적 예술", "깊은 이해", "예술적 완성"], 
    personality: "지적 깊이와 예술적 완성을 추구하는 장인" 
  },
  "ISFP_type6": { 
    name: "페이스풀 아티잔", 
    title: "신념의 예술가", 
    powers: ["신념의 예술", "감성적 안정", "아름다운 보호"], 
    personality: "신념을 예술로 표현하는 안정적인 예술가" 
  },
  "ISFP_type7": { 
    name: "임프로브 아티잔", 
    title: "즉흥의 예술가", 
    powers: ["즉흥적 예술", "다양한 표현", "자유로운 창작"], 
    personality: "즉흥적이고 자유로운 예술적 표현을 하는 예술가" 
  },
  "ISFP_type8": { 
    name: "패션 아티잔", 
    title: "열정의 예술가", 
    powers: ["강력한 예술", "정의감", "변화의 아름다움"], 
    personality: "강력한 열정으로 변화를 아름답게 표현하는 예술가" 
  },

  // ESTJ 영웅들 (6개)
  "ESTJ_type3": { 
    name: "엑제큐티브 빌더", 
    title: "실행의 건설자", 
    powers: ["체계적 건설", "효율성", "성과 달성"], 
    personality: "체계적으로 목표를 달성하는 실행가" 
  },
  "ESTJ_type4": { 
    name: "커뮤니티 비전리", 
    title: "공동체의 비전", 
    powers: ["체계적 비전", "감성적 건설", "공동체 발전"], 
    personality: "체계적 비전으로 공동체를 발전시키는 지도자" 
  },
  "ESTJ_type5": { 
    name: "시스템 마스터", 
    title: "체계의 대가", 
    powers: ["완벽한 체계", "지적 분석", "효율적 관리"], 
    personality: "완벽한 체계와 효율적 관리를 추구하는 대가" 
  },
  "ESTJ_type6": { 
    name: "로열 시스템", 
    title: "충성의 체계", 
    powers: ["충성적 체계", "안정성", "신뢰성"], 
    personality: "충성스럽고 안정적인 체계를 구축하는 관리자" 
  },
  "ESTJ_type7": { 
    name: "어드벤처 시스템", 
    title: "모험의 체계", 
    powers: ["모험적 체계", "효율적 모험", "다양한 경험"], 
    personality: "모험적이면서도 효율적인 체계를 추구하는 관리자" 
  },
  "ESTJ_type8": { 
    name: "임페리얼 시스템", 
    title: "제국의 체계", 
    powers: ["절대적 체계", "강력한 관리", "권위적 지배"], 
    personality: "절대적 권위로 체계를 지배하는 제국의 관리자" 
  },

  // INFJ 영웅들 (6개)
  "INFJ_type3": { 
    name: "비전리 아치브", 
    title: "비전의 성취자", 
    powers: ["비전적 성취", "감성적 완성", "이상 실현"], 
    personality: "비전을 현실로 만드는 감성적 성취자" 
  },
  "INFJ_type4": { 
    name: "소울 비전리", 
    title: "영혼의 비전", 
    powers: ["깊은 비전", "예술적 통찰", "독창적 이상"], 
    personality: "깊은 감성과 예술적 통찰을 가진 비전가" 
  },
  "INFJ_type5": { 
    name: "와이즈 비전리", 
    title: "지혜의 비전", 
    powers: ["지적 비전", "깊은 통찰", "완벽한 이해"], 
    personality: "지적 깊이와 완벽한 통찰을 가진 비전가" 
  },
  "INFJ_type6": { 
    name: "페이스풀 비전리", 
    title: "신념의 비전", 
    powers: ["신념의 비전", "감성적 안정", "이상적 보호"], 
    personality: "신념을 바탕으로 이상적 세계를 꿈꾸는 비전가" 
  },
  "INFJ_type7": { 
    name: "임프로브 비전리", 
    title: "즉흥의 비전", 
    powers: ["즉흥적 비전", "다양한 이상", "자유로운 꿈"], 
    personality: "즉흥적이고 자유로운 이상을 꿈꾸는 비전가" 
  },
  "INFJ_type8": { 
    name: "패션 비전리", 
    title: "열정의 비전", 
    powers: ["강력한 비전", "정의감", "변화 추진"], 
    personality: "강력한 열정으로 변화를 꿈꾸는 이상주의자" 
  },

  // ESTP 영웅들 (6개)
  "ESTP_type3": { 
    name: "액션 아치브", 
    title: "행동의 성취자", 
    powers: ["즉흥적 성취", "효율성", "성과 달성"], 
    personality: "즉흥적으로 목표를 달성하는 행동가" 
  },
  "ESTP_type4": { 
    name: "어드벤처 아티스트", 
    title: "모험의 예술가", 
    powers: ["모험적 예술", "즉흥적 표현", "자유로운 창작"], 
    personality: "모험적이고 즉흥적인 예술적 표현을 하는 예술가" 
  },
  "ESTP_type5": { 
    name: "액션 아날리스트", 
    title: "행동의 분석가", 
    powers: ["즉흥적 분석", "실용적 지식", "행동적 해결"], 
    personality: "즉흥적이고 실용적인 분석을 하는 행동가" 
  },
  "ESTP_type6": { 
    name: "어드벤처 가디언", 
    title: "모험의 수호자", 
    powers: ["모험적 보호", "즉흥적 안전", "자유로운 수호"], 
    personality: "모험적이면서도 안전을 고려하는 자유로운 수호자" 
  },
  "ESTP_type7": { 
    name: "즉흥 어드벤처", 
    title: "즉흥의 모험가", 
    powers: ["즉흥적 모험", "다양한 경험", "자유로운 행동"], 
    personality: "즉흥적이고 자유로운 모험을 추구하는 행동가" 
  },
  "ESTP_type8": { 
    name: "액션 리더", 
    title: "행동의 지도자", 
    powers: ["강력한 행동", "즉흥적 리더십", "변화 추진"], 
    personality: "강력한 행동력으로 변화를 이끄는 지도자" 
  },

  // ISTJ 영웅들 (6개)
  "ISTJ_type3": { 
    name: "시스템 빌더", 
    title: "체계의 건설자", 
    powers: ["체계적 건설", "효율성", "성과 달성"], 
    personality: "체계적으로 목표를 달성하는 건설자" 
  },
  "ISTJ_type4": { 
    name: "로열 아티잔", 
    title: "충성의 장인", 
    powers: ["충성적 예술", "체계적 완성", "신뢰성"], 
    personality: "충성스럽고 체계적인 완성을 추구하는 장인" 
  },
  "ISTJ_type5": { 
    name: "시스템 아날리스트", 
    title: "체계의 분석가", 
    powers: ["체계적 분석", "지적 완성", "효율적 해결"], 
    personality: "체계적이고 지적인 분석을 하는 전문가" 
  },
  "ISTJ_type6": { 
    name: "로열 가디언", 
    title: "충성의 수호자", 
    powers: ["충성적 보호", "체계적 안전", "신뢰성"], 
    personality: "충성스럽고 체계적으로 안전을 지키는 수호자" 
  },
  "ISTJ_type7": { 
    name: "시스템 어드벤처", 
    title: "체계의 모험가", 
    powers: ["체계적 모험", "효율적 경험", "안정적 도전"], 
    personality: "체계적이면서도 모험을 추구하는 안정적인 모험가" 
  },
  "ISTJ_type8": { 
    name: "로열 시스템", 
    title: "충성의 체계", 
    powers: ["충성적 체계", "강력한 보호", "권위적 안정"], 
    personality: "충성스럽고 강력한 체계를 구축하는 권위자" 
  },

  // ENFJ 영웅들 (6개)
  "ENFJ_type3": { 
    name: "하모니 리더", 
    title: "조화의 지도자", 
    powers: ["조화적 리더십", "효율성", "성과 달성"], 
    personality: "조화롭게 목표를 달성하는 지도자" 
  },
  "ENFJ_type4": { 
    name: "컴패션 비전리", 
    title: "동정의 비전", 
    powers: ["감성적 비전", "예술적 리더십", "공감 능력"], 
    personality: "따뜻한 마음으로 비전을 제시하는 지도자" 
  },
  "ENFJ_type5": { 
    name: "와이즈 리더", 
    title: "지혜의 지도자", 
    powers: ["지적 리더십", "깊은 통찰", "완벽한 이해"], 
    personality: "지적 깊이와 완벽한 통찰을 가진 지도자" 
  },
  "ENFJ_type6": { 
    name: "로열 리더", 
    title: "충성의 지도자", 
    powers: ["충성적 리더십", "신뢰성", "팀 보호"], 
    personality: "충성스럽고 신뢰할 수 있는 팀의 지도자" 
  },
  "ENFJ_type7": { 
    name: "소셜 리더", 
    title: "사회의 지도자", 
    powers: ["사교적 리더십", "즐거운 분위기", "관계 조율"], 
    personality: "사교적이고 즐거운 분위기를 만드는 지도자" 
  },
  "ENFJ_type8": { 
    name: "커뮤니티 챔피언", 
    title: "공동체의 챔피언", 
    powers: ["강력한 리더십", "정의감", "공동체 보호"], 
    personality: "강력한 의지로 공동체를 보호하는 챔피언" 
  },

  // INTP 영웅들 (6개)
  "INTP_type3": { 
    name: "로직 아치브", 
    title: "논리의 성취자", 
    powers: ["논리적 성취", "지적 완성", "이상 실현"], 
    personality: "논리적으로 목표를 달성하는 지적 성취자" 
  },
  "INTP_type4": { 
    name: "크리에이티브 로직", 
    title: "창의의 논리", 
    powers: ["창의적 논리", "예술적 분석", "독창적 사고"], 
    personality: "창의적이고 예술적인 논리를 추구하는 사상가" 
  },
  "INTP_type5": { 
    name: "마스터 로직", 
    title: "논리의 대가", 
    powers: ["완벽한 논리", "지적 분석", "깊은 이해"], 
    personality: "완벽한 논리와 깊은 이해를 추구하는 대가" 
  },
  "INTP_type6": { 
    name: "시스템 로직", 
    title: "체계의 논리", 
    powers: ["체계적 논리", "안정적 분석", "신뢰성"], 
    personality: "체계적이고 안정적인 논리를 추구하는 분석가" 
  },
  "INTP_type7": { 
    name: "어드벤처 로직", 
    title: "모험의 논리", 
    powers: ["모험적 논리", "다양한 분석", "자유로운 사고"], 
    personality: "모험적이고 자유로운 논리를 추구하는 사상가" 
  },
  "INTP_type8": { 
    name: "패션 로직", 
    title: "열정의 논리", 
    powers: ["강력한 논리", "정의감", "변화 추진"], 
    personality: "강력한 논리로 변화를 추구하는 열정적 사상가" 
  },

  // ESFP 영웅들 (6개)
  "ESFP_type3": { 
    name: "즉흥 아치브", 
    title: "즉흥의 성취자", 
    powers: ["즉흥적 성취", "즐거운 성과", "즉흥적 달성"], 
    personality: "즉흥적으로 목표를 달성하는 즐거운 성취자" 
  },
  "ESFP_type4": { 
    name: "즉흥 아티스트", 
    title: "즉흥의 예술가", 
    powers: ["즉흥적 예술", "즐거운 표현", "자유로운 창작"], 
    personality: "즉흥적이고 즐거운 예술적 표현을 하는 예술가" 
  },
  "ESFP_type5": { 
    name: "즉흥 아날리스트", 
    title: "즉흥의 분석가", 
    powers: ["즉흥적 분석", "즐거운 지식", "자유로운 해결"], 
    personality: "즉흥적이고 즐거운 분석을 하는 전문가" 
  },
  "ESFP_type6": { 
    name: "즉흥 가디언", 
    title: "즉흥의 수호자", 
    powers: ["즉흥적 보호", "즐거운 안전", "자유로운 수호"], 
    personality: "즉흥적이고 즐거운 안전을 제공하는 수호자" 
  },
  "ESFP_type7": { 
    name: "즉흥 어드벤처", 
    title: "즉흥의 모험가", 
    powers: ["즉흥적 모험", "즐거운 경험", "자유로운 행동"], 
    personality: "즉흥적이고 즐거운 모험을 추구하는 행동가" 
  },
  "ESFP_type8": { 
    name: "즉흥 리더", 
    title: "즉흥의 지도자", 
    powers: ["즉흥적 리더십", "즐거운 변화", "자유로운 지도"], 
    personality: "즉흥적이고 즐거운 변화를 이끄는 지도자" 
  }
};
