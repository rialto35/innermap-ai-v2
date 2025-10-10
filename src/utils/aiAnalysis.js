// AI 통합 분석 시스템
export async function analyzePersonality(data) {
    // const { mbti, enneagram, colors, mindCard } = data;
    
    try {
      // OpenAI 1차 분석
      const openaiAnalysis = await callOpenAI(data);
      
      // Claude 2차 검증 및 보완
      const claudeAnalysis = await callClaude({
        ...data,
        openaiResult: openaiAnalysis
      });
      
      return {
        success: true,
        analysis: claudeAnalysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI 분석 에러:', error);
      return {
        success: false,
        error: error.message
      };
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
        max_tokens: 1500,
        messages: [
          {
            role: 'system',
            content: `당신은 전문 심리분석가입니다. MBTI, 에니어그램, 컬러심리 데이터를 종합하여 통찰력 있는 성격 분석을 제공합니다.`
          },
          {
            role: 'user',
            content: `다음 데이터를 분석해주세요:
            
  MBTI: ${data.mbti}
  에니어그램: 유형 ${data.enneagram}
  선택한 컬러: ${data.colors?.map(c => c.name).join(', ')}
  마음상태: ${data.mindCard || '미제공'}
  
  다음 형식으로 분석해주세요:
  {
    "personality_summary": "핵심 성격 요약 (2-3문장)",
    "strengths": ["강점1", "강점2", "강점3"],
    "growth_areas": ["성장포인트1", "성장포인트2"],
    "relationships": "인간관계 특성 설명",
    "career_guidance": "커리어 방향 제안",
    "life_advice": "인생 조언 한 문장"
  }`
          }
        ]
      })
    });
  
    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
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
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `OpenAI 분석 결과를 검토하고 보완해주세요:
  
  기존 분석: ${JSON.stringify(data.openaiResult, null, 2)}
  
  원본 데이터:
  - MBTI: ${data.mbti}
  - 에니어그램: ${data.enneagram}
  - 컬러심리: ${data.colors?.map(c => `${c.name}(${c.ability})`).join(', ')}
  
  다음 JSON 형식으로 최종 분석을 제공해주세요:
  {
    "overall_personality": "종합적 성격 분석 (한국적 맥락 포함)",
    "core_motivation": "핵심 동기와 가치관",
    "behavioral_patterns": "행동 패턴과 습관",
    "emotional_tendencies": "감정적 특성",
    "communication_style": "소통 방식",
    "stress_management": "스트레스 대처법",
    "growth_pathway": "성장과 발전 방향",
    "daily_practices": ["일상 실천법1", "일상 실천법2", "일상 실천법3"],
    "compatibility": "어울리는 사람 유형",
    "warning_signs": "주의해야 할 점들"
  }`
          }
        ]
      })
    });
  
    const result = await response.json();
    return JSON.parse(result.content[0].text);
  }
  
  // 브라우저에서 사용할 클라이언트 함수
  export async function analyzePersonalityClient(data) {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('클라이언트 분석 에러:', error);
      return { success: false, error: error.message };
    }
  }