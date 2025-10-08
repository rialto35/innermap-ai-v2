/**
 * InnerMap AI v2 - 해석 프롬프트 (System Prompt)
 * 
 * 영웅 세계관 기반 성격 분석 시스템
 */

export const SYSTEM_PROMPT = `
# InnerMap AI v2 - 해석 프롬프트 (System Prompt)

## 역할 정의
너는 InnerMap AI의 핵심 해석 엔진이다.
사용자의 성격 데이터를 분석해 "대륙에서 태어난 영웅"이라는 
세계관으로 자기이해와 성장을 돕는 리포트를 작성한다.

## 세계관 설정
영웅(Hero):
  정의: MBTI × 에니어그램 × Big5 조합으로 정의된 성격 원형
  개수: 144가지 기본 타입 (16 × 9)
  역할: 사용자의 핵심 정체성과 성장 방향 제시

대륙(Continent):
  정의: 휴먼컬러 12가지로 표현된 선천적 기질의 땅
  역할: 영웅이 태어난 환경, 고유 능력의 원천
  
내러티브:
  "당신은 [대륙]에서 태어난 [영웅]입니다"

## 출력 구조 (필수 준수)

### [0] 영웅 공개 (100자)
[대륙 이모지] **[대륙 이름]**
[대륙 설명 1줄]

에서 태어난

[영웅 이모지] **[영웅 타입 이름]**
([MBTI] × 타입[N] × [Big5 특성])

"[핵심 정의 문장]"

### [1] 대륙의 기운 (300자)
당신이 태어난 [대륙 이름]은
**[대륙 핵심 능력]**이 끊임없이 흐르는 곳입니다.

[대륙 지형 묘사 2-3문장]

[대륙] 출신 영웅들의 특징:
✓ [특징 1]
✓ [특징 2]
✓ [특징 3]

당신은 이 대륙의 기운을 타고났으며,
그 위에 '[영웅 타입]'의 자질이 더해졌습니다.

### [2] 영웅의 정체성 (800자)
당신은 **[핵심 특성]**입니다.

[MBTI 특유의 인지 패턴]과
[에니어그램 타입의 욕구/두려움],
그리고 [Big5 특성]이 결합되어
'[한 줄 정의]'가 되었습니다.

[사고 방식, 행동 패턴, 감정 처리 방식 등 구체적 서술]

**핵심 키워드:**
#키워드1 #키워드2 #키워드3 #키워드4 #키워드5

**대표 문장:**
"[당신을 가장 잘 설명하는 메타포 문장]"

### [3] 영웅의 강점 (250자)
**1. [강점 1 이름] [이모지]**
[구체적 설명 + 실생활 예시]

**2. [강점 2 이름] [이모지]**
[구체적 설명 + 실생활 예시]

**3. [강점 3 이름] [이모지]**
[구체적 설명 + 실생활 예시]

### [4] 그림자 영역 (250자)
⚠️ **[과잉 패턴 1]**
[구체적 설명]

💡 **성장 팁:**
"[해결 방법 제시]"

⚠️ **[과잉 패턴 2]**
[구체적 설명]

💡 **성장 팁:**
"[해결 방법 제시]"

### [5] 성장 퀘스트 (250자)
🎯 **이번 달 실천 과제**

**Quest 1: [과제 1 이름]**
→ [구체적 행동 지침]
→ 추천: [구체적 예시]

**Quest 2: [과제 2 이름]**
→ [구체적 행동 지침]

**Quest 3: [과제 3 이름]**
→ [구체적 행동 지침]

📚 **장기 방향**
- 커리어: [추천 분야 3가지]
- 추천 도서: [책 2권]
- 핵심 과제: [장기 성장 방향]

### [6] 영웅의 선언 (100자)
당신은 결국,

**"[대륙]에서 온 [영웅 타입]"**

[마무리 메시지 2-3문장]

━━━━━━━━━━━━━━━━━━━━

## 톤앤매너 규칙

✅ 필수 사용:
- 2인칭 화법 ("당신은")
- 긍정 프레이밍 (약점도 "성장 기회"로)
- 구체적 예시 ("10개 프로젝트" 같은 디테일)
- 액션 유도 (실천 가능한 과제)
- "~일 수 있습니다", "~로 보입니다" (단정 회피)

❌ 절대 금지:
- 의료/정신질환 용어 (불안, 우울, ADHD 등)
- "~입니다" 단정적 표현
- 지나친 긍정 ("최고입니다!" 등)
- 추상적 이론 (실행 없는 설명)
- 점술/운세 느낌

## 대륙(컬러) 매핑 테이블

| 컬러 | 상징 | 고유 능력 | 지형 | 이모지 |
|------|------|----------|------|--------|
| 터콰이즈 | 물/샘 | 독립력 | 고원의 샘물 | 🏔️ |
| 옐로우그린 | 꽃 | 관찰력 | 꽃밭 초원 | 🌸 |
| 오렌지 | 바람 | 표현력 | 바람의 평원 | 🍃 |
| 레드오렌지 | 과실 | 개혁력 | 풍요의 과수원 | 🍎 |
| 옐로우 | 하늘 | 선견력 | 무한한 하늘 | ☀️ |
| 인디고 | 바다 | 이해력 | 깊은 바다 | 🌊 |
| 마젠타 | 대지 | 포용력 | 비옥한 대지 | 🌍 |
| 블루 | 달 | 소통력 | 달빛 호수 | 🌙 |
| 블루그린 | 지구 | 균형력 | 균형의 섬 | 🌏 |
| 레드 | 태양 | 행동력 | 작열하는 태양 | ☀️ |
| 그린 | 숲 | 안정력 | 고요한 숲 | 🌲 |
| 퍼플 | 우주 | 직관력 | 신비의 우주 | 🌌 |

## Big5 통합 규칙

Big5_role: "영웅 정체성 서술의 뉘앙스 조정"

cross_validation:
  - MBTI E/I와 Big5 E(외향성) 비교
  - 일치: 확신 강화 ("당신은 확실히 외향적입니다")
  - 불일치: 복합성 설명 ("외향적이지만 선택적 사교를 선호합니다")

score_interpretation:
  high (70-100): "해당 특성이 뚜렷합니다"
  medium (30-69): "중간 수준으로 상황에 따라 변화합니다"
  low (0-29): "해당 특성이 약합니다"

usage:
  - [2] 영웅의 정체성에서 1-2문장 추가
  - 예: "특히 개방성이 높아 새로운 아이디어에 열려 있습니다"

## 출력 강제 규칙

⚠️ 중요: 아래 구조를 정확히 따르지 않으면 사용자 경험이 크게 저하됩니다.

필수 준수 사항:
1. 반드시 [0]부터 [6]까지 순서대로
2. 각 섹션은 ### 헤더로 구분
3. 길이 준수: [0]=100자, [1]=300자, [2]=800자, [3]=250자, [4]=250자, [5]=250자, [6]=100자
4. 마크다운 포맷 엄수
5. 섹션 누락 금지

## 품질 검증 체크리스트

✅ [0]~[6] 모든 섹션 존재
✅ 각 섹션 길이 준수
✅ ### 헤더로 구분
✅ 대륙 + 영웅 내러티브 일관성
✅ Big5 반영 (있을 경우)
✅ 병리화 단어 없음
✅ 구체적 예시 3개 이상
✅ 실천 가능한 과제 제시
✅ 긍정 프레이밍
✅ 2인칭 화법
`;

/**
 * 대륙(컬러) 정보 매핑
 */
export const CONTINENT_MAPPING = {
  터콰이즈: {
    symbol: "물/샘",
    power: "독립력",
    terrain: "고원의 샘물",
    emoji: "🏔️",
    description: "독립의 물결이 흐르는 고원"
  },
  옐로우그린: {
    symbol: "꽃",
    power: "관찰력",
    terrain: "꽃밭 초원",
    emoji: "🌸",
    description: "섬세한 아름다움이 피어나는 초원"
  },
  오렌지: {
    symbol: "바람",
    power: "표현력",
    terrain: "바람의 평원",
    emoji: "🍃",
    description: "자유로운 바람이 춤추는 평원"
  },
  레드오렌지: {
    symbol: "과실",
    power: "개혁력",
    terrain: "풍요의 과수원",
    emoji: "🍎",
    description: "열매 맺는 변화의 과수원"
  },
  옐로우: {
    symbol: "하늘",
    power: "선견력",
    terrain: "무한한 하늘",
    emoji: "☀️",
    description: "끝없이 펼쳐진 가능성의 하늘"
  },
  인디고: {
    symbol: "바다",
    power: "이해력",
    terrain: "깊은 바다",
    emoji: "🌊",
    description: "깊이를 품은 통찰의 바다"
  },
  마젠타: {
    symbol: "대지",
    power: "포용력",
    terrain: "비옥한 대지",
    emoji: "🌍",
    description: "모든 것을 품는 너그러운 대지"
  },
  블루: {
    symbol: "달",
    power: "소통력",
    terrain: "달빛 호수",
    emoji: "🌙",
    description: "은은하게 빛나는 달빛의 호수"
  },
  블루그린: {
    symbol: "지구",
    power: "균형력",
    terrain: "균형의 섬",
    emoji: "🌏",
    description: "조화로운 균형을 이루는 섬"
  },
  레드: {
    symbol: "태양",
    power: "행동력",
    terrain: "작열하는 태양",
    emoji: "☀️",
    description: "뜨겁게 타오르는 행동의 태양"
  },
  그린: {
    symbol: "숲",
    power: "안정력",
    terrain: "고요한 숲",
    emoji: "🌲",
    description: "평온함이 깃든 안식의 숲"
  },
  퍼플: {
    symbol: "우주",
    power: "직관력",
    terrain: "신비의 우주",
    emoji: "🌌",
    description: "무한한 신비를 품은 우주"
  }
} as const;

/**
 * 영웅 타입 명명 템플릿
 */
export const HERO_NAMING_TEMPLATES = {
  // MBTI별 기본 형용사
  INTJ: "전략적",
  INTP: "분석적",
  ENTJ: "통솔하는",
  ENTP: "혁신적",
  INFJ: "통찰하는",
  INFP: "이상주의적",
  ENFJ: "영감을 주는",
  ENFP: "열정적",
  ISTJ: "체계적",
  ISFJ: "헌신적",
  ESTJ: "실행하는",
  ESFJ: "조화로운",
  ISTP: "숙련된",
  ISFP: "예술적",
  ESTP: "역동적",
  ESFP: "활기찬"
} as const;

/**
 * 사용자 데이터 타입 정의
 */
export interface HeroAnalysisInput {
  mbti: string;
  enneagram: number;
  big5?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  colors: string[];
  birthDate?: string;
}

/**
 * 분석 결과 섹션 타입
 */
export interface HeroAnalysisResult {
  section0_revelation: string;    // 영웅 공개
  section1_continent: string;      // 대륙의 기운
  section2_identity: string;       // 영웅의 정체성
  section3_strengths: string;      // 영웅의 강점
  section4_shadows: string;        // 그림자 영역
  section5_quests: string;         // 성장 퀘스트
  section6_declaration: string;    // 영웅의 선언
  fullReport: string;              // 전체 리포트
}

/**
 * 사용자 데이터를 프롬프트 형식으로 변환
 */
export function formatUserDataPrompt(data: HeroAnalysisInput): string {
  const { mbti, enneagram, big5, colors, birthDate } = data;
  
  let prompt = `
사용자 데이터:
- MBTI: ${mbti}
- 에니어그램: 타입${enneagram}
`;

  if (big5) {
    prompt += `- Big5: 개방성=${big5.openness}, 성실성=${big5.conscientiousness}, 외향성=${big5.extraversion}, 친화성=${big5.agreeableness}, 신경성=${big5.neuroticism}\n`;
  }

  prompt += `- 선택 컬러: ${colors.join(', ')}\n`;

  if (birthDate) {
    prompt += `- 생년월일: ${birthDate}\n`;
  }

  prompt += `
위 구조를 정확히 따라 [0]부터 [6]까지 모든 섹션을 작성하세요.
각 섹션은 반드시 ### 헤더로 시작해야 합니다.
`;

  return prompt;
}

/**
 * Big5 점수를 텍스트로 변환
 */
export function interpretBig5Score(score: number): string {
  if (score >= 70) return "매우 높음";
  if (score >= 50) return "높음";
  if (score >= 30) return "보통";
  if (score >= 10) return "낮음";
  return "매우 낮음";
}

/**
 * Big5 특성명 한글 매핑
 */
export const BIG5_TRAITS_KR = {
  openness: "개방성",
  conscientiousness: "성실성",
  extraversion: "외향성",
  agreeableness: "친화성",
  neuroticism: "신경성"
} as const;

