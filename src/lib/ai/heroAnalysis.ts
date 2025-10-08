/**
 * Hero Analysis - AI 기반 영웅 세계관 분석
 */

import OpenAI from 'openai';
import {
  SYSTEM_PROMPT,
  formatUserDataPrompt,
  type HeroAnalysisInput,
  type HeroAnalysisResult,
} from '@/lib/prompts/systemPrompt';

/**
 * OpenAI를 사용한 영웅 분석 수행
 */
export async function analyzeHero(
  userData: HeroAnalysisInput
): Promise<HeroAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  }

  const openai = new OpenAI({ apiKey });

  try {
    const userPrompt = formatUserDataPrompt(userData);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const fullReport = completion.choices[0].message.content || '';

    // 섹션별로 파싱
    const sections = parseAnalysisReport(fullReport);

    return {
      ...sections,
      fullReport,
    };
  } catch (error) {
    console.error('Hero Analysis 에러:', error);
    throw error;
  }
}

/**
 * 분석 리포트를 섹션별로 파싱
 */
function parseAnalysisReport(report: string): Omit<HeroAnalysisResult, 'fullReport'> {
  const sections = {
    section0_revelation: '',
    section1_continent: '',
    section2_identity: '',
    section3_strengths: '',
    section4_shadows: '',
    section5_quests: '',
    section6_declaration: '',
  };

  // 정규식으로 각 섹션 추출
  const section0Match = report.match(/###\s*\[0\][^\n]*\n([\s\S]*?)(?=###\s*\[1\]|$)/);
  const section1Match = report.match(/###\s*\[1\][^\n]*\n([\s\S]*?)(?=###\s*\[2\]|$)/);
  const section2Match = report.match(/###\s*\[2\][^\n]*\n([\s\S]*?)(?=###\s*\[3\]|$)/);
  const section3Match = report.match(/###\s*\[3\][^\n]*\n([\s\S]*?)(?=###\s*\[4\]|$)/);
  const section4Match = report.match(/###\s*\[4\][^\n]*\n([\s\S]*?)(?=###\s*\[5\]|$)/);
  const section5Match = report.match(/###\s*\[5\][^\n]*\n([\s\S]*?)(?=###\s*\[6\]|$)/);
  const section6Match = report.match(/###\s*\[6\][^\n]*\n([\s\S]*?)(?=━|$)/);

  if (section0Match) sections.section0_revelation = section0Match[1].trim();
  if (section1Match) sections.section1_continent = section1Match[1].trim();
  if (section2Match) sections.section2_identity = section2Match[1].trim();
  if (section3Match) sections.section3_strengths = section3Match[1].trim();
  if (section4Match) sections.section4_shadows = section4Match[1].trim();
  if (section5Match) sections.section5_quests = section5Match[1].trim();
  if (section6Match) sections.section6_declaration = section6Match[1].trim();

  return sections;
}

/**
 * 데모/폴백 분석 결과 생성
 */
export function generateFallbackAnalysis(
  userData: HeroAnalysisInput
): HeroAnalysisResult {
  const { mbti, enneagram, colors } = userData;
  const primaryColor = colors[0] || '터콰이즈';

  const fullReport = `
### [0] 당신의 영웅

🏔️ **${primaryColor} 대륙**
독립의 물결이 흐르는 고원

에서 태어난

⚔️ **${mbti} 영웅**
(${mbti} × 타입${enneagram})

"당신은 고유한 길을 걷는 탐험가입니다"

━━━━━━━━━━━━━━━━━━━━

### [1] 대륙의 기운 - ${primaryColor}

당신이 태어난 ${primaryColor} 대륙은
**독립과 창의성**이 끊임없이 흐르는 곳입니다.

이곳의 샘물은 누구의 손도 닿지 않은 채
스스로 솟아오르며,
그 물을 마신 영웅들은
자신만의 길을 개척하는 힘을 얻습니다.

${primaryColor} 대륙 출신 영웅들의 특징:
✓ 독립적이고 창의적인 사고
✓ 자기만의 페이스를 중요하게 여김
✓ 새로운 것을 탐구하는 호기심

당신은 이 대륙의 기운을 타고났으며,
그 위에 '${mbti} 영웅'의 자질이 더해졌습니다.

━━━━━━━━━━━━━━━━━━━━

### [2] 영웅의 정체성

당신은 **독특한 관점을 가진 혁신가**입니다.

${mbti} 특유의 인지 패턴과
에니어그램 타입${enneagram}의 핵심 동기가 결합되어
'자신만의 방식으로 세상을 바꾸는 사람'이 되었습니다.

당신은 기존의 틀에 얽매이지 않고
새로운 가능성을 탐구하며,
자신만의 독특한 방식으로 문제를 해결합니다.

**핵심 키워드:**
#독립성 #창의성 #혁신 #통찰력 #성장

**대표 문장:**
"당신은 남들이 가지 않은 길에서 
새로운 가능성을 발견하는 사람입니다."

━━━━━━━━━━━━━━━━━━━━

### [3] 영웅의 강점

**1. 독창적 사고 💡**
남들과 다른 관점에서 문제를 바라봅니다.
일반적인 해결책에 만족하지 않고 더 나은 방법을 찾습니다.

**2. 적응력 🌊**
변화하는 상황에 유연하게 대처하며,
예상치 못한 도전을 기회로 전환합니다.

**3. 진정성 ✨**
자신의 가치관에 충실하며,
타인의 시선보다 내적 기준을 중시합니다.

━━━━━━━━━━━━━━━━━━━━

### [4] 그림자 영역

⚠️ **과도한 독립성**

모든 것을 혼자 해결하려는 경향이 있어
협력의 기회를 놓칠 수 있습니다.

💡 **성장 팁:**
"도움을 요청하는 것도 강점입니다.
 함께할 때 더 큰 성과를 낼 수 있습니다."

⚠️ **완벽주의 경향**

스스로에게 높은 기준을 설정해
때로는 실행을 미루게 됩니다.

💡 **성장 팁:**
"완벽한 시작보다 불완전한 진행이
 더 큰 성장을 가져옵니다."

━━━━━━━━━━━━━━━━━━━━

### [5] 성장 퀘스트

🎯 **이번 달 실천 과제**

**Quest 1: 협업 경험 쌓기**
→ 팀 프로젝트에 적극 참여하기
→ 추천: 온라인 스터디 그룹 가입

**Quest 2: 작은 실행 습관**
→ 완벽하지 않아도 일단 시작하기
→ 예: 일일 글쓰기 10분

**Quest 3: 피드백 수용 연습**
→ 타인의 의견에 열린 마음 갖기
→ 주 1회 의견 교환 시간 갖기

📚 **장기 방향**
- 커리어: 창의적 문제 해결이 필요한 분야
- 추천 도서: <Atomic Habits>, <Think Again>
- 핵심 과제: 독립성과 협력의 균형

━━━━━━━━━━━━━━━━━━━━

### [6] 영웅의 선언

당신은 결국,

**"${primaryColor} 대륙에서 온 ${mbti} 영웅"**

자신만의 길을 걷으면서도
타인과 함께 성장하는 법을 배워가는
진정한 탐험가입니다.

당신의 여정은 이제 시작입니다.

━━━━━━━━━━━━━━━━━━━━
  `.trim();

  const sections = parseAnalysisReport(fullReport);

  return {
    ...sections,
    fullReport,
  };
}

/**
 * 분석 결과 검증
 */
export function validateAnalysisResult(result: HeroAnalysisResult): {
  isValid: boolean;
  missingSection: string[];
} {
  const requiredSections = [
    'section0_revelation',
    'section1_continent',
    'section2_identity',
    'section3_strengths',
    'section4_shadows',
    'section5_quests',
    'section6_declaration',
  ];

  const missingSections = requiredSections.filter(
    (section) => !result[section as keyof HeroAnalysisResult]
  );

  return {
    isValid: missingSections.length === 0,
    missingSection: missingSections,
  };
}

