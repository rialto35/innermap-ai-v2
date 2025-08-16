import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // API 키 없을 때 더미 데이터 반환 (데모용)
    if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: true,
        analysis: {
          openai: {
            summary: "당신은 창의적이고 분석적인 성향을 가진 분입니다.",
            strengths: ["논리적 사고", "창의성", "독립성"],
            challenges: ["소통 개선", "감정 표현"],
            advice: "당신만의 독특한 관점을 더욱 발휘해보세요!"
          },
          claude: {
            personality_type: "균형 잡힌 사고형 성격",
            growth_path: "대인관계 스킬 향상",
            daily_tips: ["명상하기", "독서하기", "운동하기"],
            relationships: "진솔한 소통을 통해 더 깊은 관계를 맺어보세요"
          },
          combined: {
            title: "종합 성격 분석 (데모 버전)",
            summary: "당신은 창의적이고 분석적인 성향을 가진 분으로, 독립적인 사고와 논리적 접근을 선호합니다.",
            strengths: ["논리적 사고", "창의성", "독립성", "분석력", "집중력"],
            growth_areas: ["소통 개선", "감정 표현", "대인관계 스킬 향상"],
            daily_practices: ["명상하기", "독서하기", "운동하기"],
            final_advice: "당신만의 독특한 관점을 더욱 발휘하고, 진솔한 소통을 통해 더 깊은 관계를 맺어보세요!"
          }
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // 실제 AI 분석 (API 키 있을 때)
    const openaiResult = await callOpenAI(data);
    const claudeResult = await callClaude({
      ...data,
      openaiResult
    });
    
    return NextResponse.json({
      success: true,
      analysis: {
        openai: openaiResult,
        claude: claudeResult,
        combined: generateCombinedAnalysis(openaiResult, claudeResult)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI 분석 API 에러:', error);
    
    // 에러 발생 시에도 더미 데이터 반환
    return NextResponse.json({
      success: true,
      analysis: {
        combined: {
          title: "성격 분석 (오프라인 모드)",
          summary: "현재 AI 서비스 연결이 어려워 기본 분석을 제공합니다.",
          strengths: ["유연성", "적응력", "학습능력"],
          growth_areas: ["새로운 도전", "꾸준한 실천"],
          daily_practices: ["자기성찰", "목표설정", "감사표현"],
          final_advice: "지금 이 순간의 당신도 충분히 소중합니다!"
        }
      },
      timestamp: new Date().toISOString()
    });
  }
}

async function callOpenAI(data) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: '당신은 전문 심리분석가입니다. 간결하고 실용적인 분석을 제공하세요.'
        },
        {
          role: 'user',
          content: `다음 데이터를 분석해주세요:

MBTI: ${data.mbti || '미완성'}
에니어그램: ${data.enneagram || '미완성'}
선택 컬러: ${data.colors?.map(c => `${c.name}(${c.ability})`).join(', ') || '미완성'}

JSON 형식으로 답변:
{
  "summary": "핵심 성격 특성 2문장",
  "strengths": ["강점1", "강점2", "강점3"],
  "challenges": ["개선점1", "개선점2"],
  "advice": "실생활 조언 1문장"
}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API 에러: ${response.status}`);
  }

  const result = await response.json();
  try {
    return JSON.parse(result.choices[0].message.content);
  } catch {
    return { summary: result.choices[0].message.content };
  }
}

async function callClaude(data) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `이전 분석을 보완해주세요:

기존 분석: ${JSON.stringify(data.openaiResult)}
MBTI: ${data.mbti}
에니어그램: ${data.enneagram}
컬러: ${data.colors?.map(c => c.name).join(', ')}

JSON으로 답변:
{
  "personality_type": "성격 유형 한 문장",
  "growth_path": "성장 방향 제안",
  "daily_tips": ["실천법1", "실천법2"],
  "relationships": "인간관계 조언"
}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API 에러: ${response.status}`);
  }

  const result = await response.json();
  try {
    return JSON.parse(result.content[0].text);
  } catch {
    return { personality_type: result.content[0].text };
  }
}

function generateCombinedAnalysis(openai, claude) {
  return {
    title: "종합 성격 분석",
    summary: openai.summary || claude.personality_type || "분석 완료",
    strengths: openai.strengths || [],
    growth_areas: [...(openai.challenges || []), claude.growth_path].filter(Boolean),
    daily_practices: claude.daily_tips || [],
    final_advice: claude.relationships || openai.advice || "당신만의 독특함을 발휘하세요!"
  };
}