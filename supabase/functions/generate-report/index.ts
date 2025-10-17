/**
 * Supabase Edge Function: generate-report
 * 
 * 리포트 생성 백그라운드 워커
 * - queued 상태의 리포트를 가져와서 LLM 호출
 * - Markdown 내러티브 생성 및 DB 저장
 * - 상태 업데이트 (queued → processing → ready | failed)
 * 
 * 실행 방식:
 * 1. API에서 수동 트리거 (fetch)
 * 2. Cron으로 주기적 폴링 (권장: 10초마다)
 * 
 * @version v1.1.0
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Types
interface Report {
  id: string;
  user_id: string;
  result_id: string;
  status: string;
  created_at: string;
}

interface Result {
  id: string;
  user_id: string;
  engine_version: string;
  big5_scores: any;
  mbti_scores: any;
  reti_scores: any;
  tribe_id: string;
  stone_id: string;
  hero_id: string;
}

interface LLMResponse {
  success: boolean;
  content?: string;
  model?: string;
  tokens?: number;
  error?: string;
}

/**
 * Main handler
 */
Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    console.log('[generate-report] Edge function invoked');

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get next queued report (with row lock)
    const { data: reports, error: fetchError } = await supabase
      .from('reports')
      .select('id, user_id, result_id, status, created_at')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) {
      console.error('[generate-report] Error fetching queued reports:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reports', details: fetchError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!reports || reports.length === 0) {
      console.log('[generate-report] No queued reports found');
      return new Response(
        JSON.stringify({ message: 'No reports in queue' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const report = reports[0];
    console.log(`[generate-report] Processing report ${report.id}`);

    // Update status to 'processing'
    await supabase
      .from('reports')
      .update({
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', report.id);

    try {
      // Fetch result data from test_results table
      const { data: result, error: resultError } = await supabase
        .from('test_results')
        .select('*')
        .eq('id', report.result_id)
        .single();

      if (resultError || !result) {
        throw new Error(`Result not found: ${resultError?.message}`);
      }

      // Build report input
      const reportInput = buildReportInput(result);

      // Generate prompt
      const prompt = buildNarrativePrompt(reportInput);

      // Call LLM
      const llmResponse = await callLLM(prompt);

      if (!llmResponse.success || !llmResponse.content) {
        throw new Error(llmResponse.error || 'LLM call failed');
      }

      // Build visual metadata
      const visualMetadata = buildVisualMetadata(result);

      // Update report with generated content
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: 'ready',
          summary_md: llmResponse.content,
          visuals_json: visualMetadata,
          finished_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (updateError) {
        throw new Error(`Failed to update report: ${updateError.message}`);
      }

      console.log(`[generate-report] Report ${report.id} completed successfully`);

      return new Response(
        JSON.stringify({
          reportId: report.id,
          status: 'ready',
          model: llmResponse.model,
          tokens: llmResponse.tokens
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (processingError) {
      console.error(`[generate-report] Processing failed for report ${report.id}:`, processingError);

      // Update status to 'failed'
      await supabase
        .from('reports')
        .update({
          status: 'failed',
          error_msg: processingError instanceof Error ? processingError.message : String(processingError),
          finished_at: new Date().toISOString()
        })
        .eq('id', report.id);

      return new Response(
        JSON.stringify({
          reportId: report.id,
          status: 'failed',
          error: processingError instanceof Error ? processingError.message : 'Unknown error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('[generate-report] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Build report input from test_results data
 */
function buildReportInput(result: any) {
  return {
    // Big5 from individual columns
    big5: {
      openness: result.big5_openness || 50,
      conscientiousness: result.big5_conscientiousness || 50,
      extraversion: result.big5_extraversion || 50,
      agreeableness: result.big5_agreeableness || 50,
      neuroticism: result.big5_neuroticism || 50
    },
    // MBTI from mbti_type and mbti_confidence
    mbti: {
      type: result.mbti_type || 'ENFP',
      confidence: result.mbti_confidence || { EI: 0.5, SN: 0.5, TF: 0.5, JP: 0.5 }
    },
    // RETI from reti_top1/top2 and reti_scores
    reti: {
      primaryType: result.reti_top1?.replace('r', '') || '7',
      secondaryType: result.reti_top2?.replace('r', ''),
      confidence: 0.7,
      rawScores: result.reti_scores || {}
    },
    // Hero from hero_id and hero_name
    hero: {
      id: result.hero_id || 'default',
      name: result.hero_name || '탐험가',
      traits: ['모험심', '호기심']
    },
    // Auxiliary scores (optional)
    auxiliary: result.auxiliary_scores || undefined,
    // User name from result
    userName: result.name
  };
}

/**
 * Build narrative prompt
 */
function buildNarrativePrompt(input: any): { system: string; user: string } {
  const system = `당신은 성격심리학·조직심리·발달심리에 전문성을 가진 컨설턴트입니다.
결과 데이터를 바탕으로 사용자의 현재 성향과 강점, 성장경로를
근거 기반으로 부드럽고 분석적인 톤으로 작성하세요.

문서는 Markdown 섹션으로 구성합니다:
1) 핵심 요약 (100-150단어)
2) 강점과 잠재력 (150-200단어)
3) 현재 주의점 (100-150단어)
4) 환경/관계에서의 팁 (150-200단어)
5) 성장 경로 제안 (실행 가능한 3단계, 200-250단어)

주의사항:
- 과도한 일반화 금지
- 점수는 "높음/보통/낮음"으로 자연어 해석 병기
- 구체적 행동 예시 3개 이상 포함
- 전체 길이: 600~900 단어
- 한국어로 작성
- Markdown 형식 사용 (헤딩, 리스트, 볼드 등)

반드시 다음 형식으로 작성하세요:

# 핵심 요약
[내용]

## 강점과 잠재력
[내용]

## 현재 주의점
[내용]

## 환경과 관계에서의 팁
[내용]

## 성장 경로 제안
### 1단계: [제목]
[내용]

### 2단계: [제목]
[내용]

### 3단계: [제목]
[내용]`;

  const user = `## 심리 프로필

**Big5 성격 특성:**
- 개방성: ${input.big5.openness}/100
- 성실성: ${input.big5.conscientiousness}/100
- 외향성: ${input.big5.extraversion}/100
- 친화성: ${input.big5.agreeableness}/100
- 신경성: ${input.big5.neuroticism}/100

**MBTI 유형:**
- 유형: ${input.mbti.type}

**RETI (에니어그램):**
- 주 유형: Type ${input.reti.primaryType}

**영웅 아이덴티티:**
- 이름: ${input.hero.name}

위 결과를 종합하여 통찰력 있는 심층 리포트를 Markdown 형식으로 작성해주세요.`;

  return { system, user };
}

/**
 * Build visual metadata from test_results
 */
function buildVisualMetadata(result: any) {
  return {
    big5Radar: {
      openness: result.big5_openness || 50,
      conscientiousness: result.big5_conscientiousness || 50,
      extraversion: result.big5_extraversion || 50,
      agreeableness: result.big5_agreeableness || 50,
      neuroticism: result.big5_neuroticism || 50
    },
    auxProfile: result.auxiliary_scores || undefined
  };
}

/**
 * Call LLM (OpenAI or Anthropic)
 */
async function callLLM(prompt: { system: string; user: string }): Promise<LLMResponse> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

  // Try OpenAI first
  if (openaiKey) {
    console.log('[callLLM] Using OpenAI');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        model: 'gpt-4-turbo-preview',
        tokens: data.usage.total_tokens
      };
    } catch (error) {
      console.error('[callLLM] OpenAI error:', error);
      // Fall through to Anthropic if available
    }
  }

  // Try Anthropic
  if (anthropicKey) {
    console.log('[callLLM] Using Anthropic');
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          system: prompt.system,
          messages: [
            { role: 'user', content: prompt.user }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
      }

      const data = await response.json();
      return {
        success: true,
        content: data.content[0].text,
        model: 'claude-3-sonnet',
        tokens: data.usage.input_tokens + data.usage.output_tokens
      };
    } catch (error) {
      console.error('[callLLM] Anthropic error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Anthropic API failed'
      };
    }
  }

  return {
    success: false,
    error: 'No LLM API key configured'
  };
}

/**
 * CORS headers
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

