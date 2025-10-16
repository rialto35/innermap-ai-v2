/**
 * POST /api/report
 * 
 * 심층 리포트 생성 요청
 * - 결과 ID를 받아 리포트 생성 시작
 * - LLM 호출 및 DB 저장
 * 
 * @version v1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { generateReportPrompt, createReportMetadata } from '@innermap/engine';
import type { ReportInput, ReportOutput } from '@innermap/engine';

export async function POST(request: NextRequest) {
  try {
    // 1. Auth guard
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const { resultId } = body;

    if (!resultId) {
      return NextResponse.json({
        error: { code: 'INVALID_REQUEST', message: 'resultId is required' }
      }, { status: 400 });
    }

    console.log('[POST /api/report] Generating report for result:', resultId);

    // 3. Fetch test result
    const { data: testResult, error: fetchError } = await supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('id', resultId)
      .single();

    if (fetchError || !testResult) {
      console.error('[POST /api/report] Test result not found:', fetchError);
      return NextResponse.json({
        error: { code: 'NOT_FOUND', message: 'Test result not found' }
      }, { status: 404 });
    }

    // 4. Check if report already exists
    const { data: existingReport } = await supabaseAdmin
      .from('ai_reports')
      .select('id, status, content')
      .eq('test_result_id', resultId)
      .eq('report_type', 'hero-analysis')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingReport && existingReport.status === 'ready') {
      console.log('[POST /api/report] Report already exists:', existingReport.id);
      return NextResponse.json({
        reportId: existingReport.id,
        status: 'ready',
        message: '기존 리포트가 있습니다.'
      });
    }

    // 5. Prepare report input
    const reportInput: ReportInput = {
      big5: {
        openness: testResult.big5_openness || 50,
        conscientiousness: testResult.big5_conscientiousness || 50,
        extraversion: testResult.big5_extraversion || 50,
        agreeableness: testResult.big5_agreeableness || 50,
        neuroticism: testResult.big5_neuroticism || 50
      },
      mbti: {
        type: testResult.mbti_type,
        confidence: testResult.mbti_confidence || { EI: 0.5, SN: 0.5, TF: 0.5, JP: 0.5 }
      },
      reti: {
        primaryType: testResult.reti_top1?.replace('r', '') || '7',
        secondaryType: testResult.reti_top2?.replace('r', ''),
        confidence: 0.7,
        rawScores: testResult.reti_scores || {}
      },
      hero: {
        id: testResult.hero_id,
        name: testResult.hero_name,
        traits: ['탐험가', '개척자'] // TODO: 실제 traits 로드
      },
      userName: testResult.name
    };

    // 6. Generate prompt
    const prompt = generateReportPrompt(reportInput);

    // 7. Call LLM (OpenAI or Anthropic)
    const llmResponse = await callLLM(prompt);

    if (!llmResponse.success) {
      console.error('[POST /api/report] LLM call failed:', llmResponse.error);
      return NextResponse.json({
        error: { code: 'LLM_ERROR', message: llmResponse.error }
      }, { status: 500 });
    }

    // 8. Save report to database
    const { data: newReport, error: insertError } = await supabaseAdmin
      .from('ai_reports')
      .insert({
        user_id: testResult.user_id,
        test_result_id: resultId,
        report_type: 'hero-analysis',
        content: llmResponse.content,
        model_version: llmResponse.model,
        visual_data: { sections: llmResponse.sections }
      })
      .select()
      .single();

    if (insertError || !newReport) {
      console.error('[POST /api/report] Failed to save report:', insertError);
      return NextResponse.json({
        error: { code: 'DB_ERROR', message: 'Failed to save report' }
      }, { status: 500 });
    }

    console.log('[POST /api/report] Report created successfully:', newReport.id);

    return NextResponse.json({
      reportId: newReport.id,
      status: 'ready',
      message: '리포트가 생성되었습니다.'
    });

  } catch (error) {
    console.error('[POST /api/report] Error:', error);
    return NextResponse.json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

/**
 * LLM 호출 (OpenAI or Anthropic)
 */
async function callLLM(prompt: { system: string; user: string }): Promise<{
  success: boolean;
  content?: string;
  sections?: any[];
  model?: string;
  tokens?: number;
  error?: string;
}> {
  try {
    // OpenAI 우선 시도
    if (process.env.OPENAI_API_KEY) {
      console.log('[callLLM] Using OpenAI');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error?.message || 'OpenAI API error' };
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        success: true,
        content,
        sections: parsed.sections,
        model: 'gpt-4-turbo-preview',
        tokens: data.usage.total_tokens
      };
    }

    // Anthropic 대체
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('[callLLM] Using Anthropic');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
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
        return { success: false, error: error.error?.message || 'Anthropic API error' };
      }

      const data = await response.json();
      const content = data.content[0].text;
      const parsed = JSON.parse(content);

      return {
        success: true,
        content,
        sections: parsed.sections,
        model: 'claude-3-sonnet',
        tokens: data.usage.input_tokens + data.usage.output_tokens
      };
    }

    return { success: false, error: 'No LLM API key configured' };

  } catch (error) {
    console.error('[callLLM] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'LLM call failed'
    };
  }
}

export async function GET() {
  return NextResponse.json({
    error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST to generate report' }
  }, { status: 405 });
}
