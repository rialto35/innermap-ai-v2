import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, formatUserDataPrompt, CONTINENT_MAPPING } from '@/lib/prompts/systemPrompt';

export async function POST(request) {
  let data = null; // 스코프 이슈 해결
  
  try {
    data = await request.json();
    
    // 입력 데이터 검증
    const { mbti, enneagram, big5, colors, birthDate } = data;
    
    console.log('📊 분석 요청 데이터:', { mbti, enneagram, hasBig5: !!big5, colors: colors?.length });
    
    // API 키 체크
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasClaude = !!process.env.ANTHROPIC_API_KEY;
    
    console.log('🔑 API 키 상태:', { OpenAI: hasOpenAI, Claude: hasClaude });
    
    // API 키 없을 때 Fallback 분석
    if (!hasOpenAI && !hasClaude) {
      console.log('⚠️ API 키 없음 - Fallback 분석 반환');
      return NextResponse.json({
        success: true,
        analysis: generateFallbackAnalysis(data),
        metadata: {
          usedFallback: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // OpenAI 1차 분석 (영웅 세계관)
    console.log('🤖 OpenAI 영웅 분석 시작...');
    const openaiResult = await callOpenAI(data);
    
    // Claude 2차 검증 및 보완 (실패해도 OpenAI 결과로 진행)
    let claudeResult = null;
    try {
      console.log('🔮 Claude 검증 및 보완...');
      claudeResult = await callClaude({
        ...data,
        openaiResult
      });
    } catch (claudeError) {
      console.warn('⚠️ Claude 분석 실패, OpenAI 결과만 사용:', claudeError.message);
      claudeResult = {
        validation: { note: "Claude 검증 건너뜀" },
        improvements: { suggestions: ["OpenAI 분석만 사용됨"] },
        enhanced_advice: "지속적인 성장과 자기이해를 추구하세요."
      };
    }
    
    // 최종 분석 결과 생성
    const finalAnalysis = generateFinalAnalysis(openaiResult, claudeResult);
    
    console.log('✅ 분석 완료!');
    
    return NextResponse.json({
      success: true,
      analysis: {
        openai: openaiResult,
        claude: claudeResult,
        combined: finalAnalysis.combined,
        sections: finalAnalysis.sections
      },
      metadata: {
        usedFallback: false,
        claudeSkipped: !claudeResult?.validation?.narrative_consistency,
        timestamp: new Date().toISOString(),
        inputData: { mbti, enneagram, hasBig5: !!big5, colorsCount: colors?.length }
      }
    });
    
  } catch (error) {
    console.error('❌ AI 분석 API 에러:', error);
    
    // 에러 타입별 처리
    if (error.message?.includes('API key')) {
      return NextResponse.json({
        success: false,
        error: 'API 키 오류',
        details: error.message
      }, { status: 500 });
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json({
        success: false,
        error: 'API 요청 한도 초과',
        details: '잠시 후 다시 시도해주세요.'
      }, { status: 429 });
    }
    
    // 일반 에러는 Fallback으로 (data가 null일 수도 있음)
    if (!data) {
      return NextResponse.json({
        success: false,
        error: '요청 데이터 파싱 실패',
        details: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      analysis: generateFallbackAnalysis(data),
      metadata: {
        usedFallback: true,
        fallbackReason: 'error',
        errorMessage: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * OpenAI GPT-4o 영웅 분석 (1차)
 */
async function callOpenAI(data) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // v2 프롬프트 사용
    const userPrompt = formatUserDataPrompt({
      mbti: data.mbti,
      enneagram: Number(data.enneagram),
      big5: data.big5 ? {
        openness: data.big5.O || 50,
        conscientiousness: data.big5.C || 50,
        extraversion: data.big5.E || 50,
        agreeableness: data.big5.A || 50,
        neuroticism: data.big5.N || 50
      } : undefined,
      colors: Array.isArray(data.colors) 
        ? data.colors.map(c => c.name || c).filter(Boolean)
        : [],
      birthDate: data.birthDate
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 3000,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const content = completion.choices[0].message.content;
    console.log('📝 OpenAI 응답 길이:', content?.length);
    
    // [0]~[6] 섹션 파싱
    const sections = parseHeroSections(content);
    
    return {
      fullReport: content,
      sections: sections,
      model: 'gpt-4o',
      tokensUsed: completion.usage?.total_tokens || 0
    };
    
  } catch (error) {
    console.error('OpenAI API 호출 에러:', error);
    throw new Error(`OpenAI API 에러: ${error.message}`);
  }
}

/**
 * Claude Haiku 검증 및 보완 (2차)
 */
async function callClaude(data) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `다음은 OpenAI가 생성한 영웅 분석 리포트입니다:

${data.openaiResult.fullReport}

원본 데이터:
- MBTI: ${data.mbti}
- 에니어그램: 타입${data.enneagram}
${data.big5 ? `- Big5: O=${data.big5.O}, C=${data.big5.C}, E=${data.big5.E}, A=${data.big5.A}, N=${data.big5.N}` : ''}
- 색상: ${data.colors?.map(c => c.name || c).join(', ')}

다음 관점에서 검증하고 보완해주세요:

1. **내러티브 일관성**: 대륙과 영웅의 관계가 자연스러운가?
2. **성격 정확성**: MBTI/에니어그램 특성이 정확히 반영되었는가?
3. **Big5 통합**: Big5 점수가 있다면 적절히 반영되었는가?
4. **실용성**: 성장 퀘스트가 구체적이고 실행 가능한가?

JSON 형식으로 답변:
{
  "validation": {
    "narrative_consistency": "평가 (1-10점)",
    "personality_accuracy": "평가 (1-10점)",
    "big5_integration": "평가 (1-10점 또는 N/A)",
    "practicality": "평가 (1-10점)"
  },
  "improvements": {
    "strengths": ["잘된 점 1", "잘된 점 2"],
    "weaknesses": ["개선점 1", "개선점 2"],
    "suggestions": ["제안 1", "제안 2"]
  },
  "enhanced_advice": "보완된 최종 조언 (1-2문장)"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0].text;
    console.log('🔍 Claude 검증 완료');
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn('Claude JSON 파싱 실패, 텍스트 반환');
      return { 
        validation: { note: "파싱 실패" },
        improvements: { suggestions: [content] },
        enhanced_advice: "지속적인 성장과 자기이해를 추구하세요."
      };
    }
    
  } catch (error) {
    console.error('Claude API 호출 에러:', error);
    throw new Error(`Claude API 에러: ${error.message}`);
  }
}

/**
 * 영웅 리포트 섹션 파싱 ([0]~[6])
 */
function parseHeroSections(report) {
  const sections = {
    section0_revelation: '',
    section1_continent: '',
    section2_identity: '',
    section3_strengths: '',
    section4_shadows: '',
    section5_quests: '',
    section6_declaration: ''
  };

  if (!report) return sections;

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
 * 최종 분석 결과 생성
 */
function generateFinalAnalysis(openai, claude) {
  try {
    const sections = openai.sections || {};
    
    return {
      combined: {
        title: "영웅 분석 리포트 v2",
        summary: sections.section0_revelation || "영웅 분석이 완료되었습니다.",
        fullReport: openai.fullReport || "",
        validation: claude.validation || {},
        improvements: claude.improvements || {},
        enhancedAdvice: claude.enhanced_advice || ""
      },
      sections: sections
    };
  } catch (error) {
    console.error('최종 분석 생성 에러:', error);
    return {
      combined: {
        title: "기본 분석",
        summary: "분석이 완료되었습니다.",
        fullReport: openai.fullReport || ""
      },
      sections: openai.sections || {}
    };
  }
}

/**
 * Fallback 분석 (API 키 없을 때)
 */
function generateFallbackAnalysis(data) {
  const primaryColor = data.colors?.[0]?.name || data.colors?.[0] || '터콰이즈';
  const continent = CONTINENT_MAPPING[primaryColor] || CONTINENT_MAPPING['터콰이즈'];
  
  const fallbackReport = `
### [0] 당신의 영웅

${continent.emoji} **${primaryColor} 대륙**
${continent.description}

에서 태어난

⚔️ **${data.mbti} 영웅**
(${data.mbti} × 타입${data.enneagram})

"당신은 고유한 길을 걷는 탐험가입니다"

━━━━━━━━━━━━━━━━━━━━

### [1] 대륙의 기운 - ${primaryColor}

당신이 태어난 ${primaryColor} 대륙은
**${continent.power}**이 끊임없이 흐르는 곳입니다.

이곳에서 태어난 영웅들은
자신만의 독특한 방식으로 세상을 바라보며,
${continent.terrain}의 기운을 타고났습니다.

당신은 이 대륙의 기운을 타고났으며,
그 위에 '${data.mbti} 영웅'의 자질이 더해졌습니다.

━━━━━━━━━━━━━━━━━━━━

### [2] 영웅의 정체성

당신은 **독특한 관점을 가진 혁신가**입니다.

${data.mbti} 특유의 인지 패턴과
에니어그램 타입${data.enneagram}의 핵심 동기가 결합되어
'자신만의 방식으로 세상을 바꾸는 사람'이 되었습니다.

${data.big5 ? `특히 Big5 분석 결과를 보면, 당신만의 독특한 성격 패턴이 드러납니다.` : ''}

**핵심 키워드:**
#독립성 #창의성 #혁신 #통찰력 #성장

━━━━━━━━━━━━━━━━━━━━

### [3] 영웅의 강점

**1. 독창적 사고 💡**
남들과 다른 관점에서 문제를 바라봅니다.

**2. 적응력 🌊**
변화하는 상황에 유연하게 대처합니다.

**3. 진정성 ✨**
자신의 가치관에 충실합니다.

━━━━━━━━━━━━━━━━━━━━

### [4] 그림자 영역

⚠️ **과도한 독립성**
모든 것을 혼자 해결하려는 경향이 있습니다.

💡 **성장 팁:**
"도움을 요청하는 것도 강점입니다."

━━━━━━━━━━━━━━━━━━━━

### [5] 성장 퀘스트

🎯 **이번 달 실천 과제**

**Quest 1: 협업 경험**
→ 팀 프로젝트 참여하기

**Quest 2: 작은 실행**
→ 완벽하지 않아도 시작하기

**Quest 3: 피드백 수용**
→ 타인의 의견에 열린 마음 갖기

━━━━━━━━━━━━━━━━━━━━

### [6] 영웅의 선언

당신은 결국,

**"${primaryColor} 대륙에서 온 ${data.mbti} 영웅"**

자신만의 길을 걷는 진정한 탐험가입니다.

━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return {
    combined: {
      title: "영웅 분석 리포트 (Fallback)",
      summary: `${continent.emoji} ${primaryColor} 대륙에서 태어난 ${data.mbti} 영웅`,
      fullReport: fallbackReport
    },
    sections: parseHeroSections(fallbackReport)
  };
}
