/**
 * API route for LLM-enhanced narrative generation
 * Server-side only to handle OpenAI API calls securely
 */

import { NextRequest, NextResponse } from 'next/server';
import { llmPolish } from '@/lib/analysis/inner9LLM';
import { summarize } from '@/lib/analysis/inner9Narrative';
import { getInner9Config } from '@/config/inner9';

export async function POST(req: NextRequest) {
  try {
    const { scores } = await req.json();
    
    if (!scores || typeof scores !== 'object') {
      return NextResponse.json({ error: 'Invalid scores data' }, { status: 400 });
    }

    // Generate rule-based summary
    const base = summarize(scores);
    
    // Check if LLM enhancement is enabled
    const config = getInner9Config();
    let aiEnhancement = '';
    
    if (config.useLLMEnhancement) {
      try {
        aiEnhancement = await llmPolish(base, scores);
      } catch (error) {
        console.error('LLM enhancement failed:', error);
        // Continue without LLM enhancement
      }
    }

    return NextResponse.json({
      summary: base,
      aiEnhancement,
      hasLLM: !!aiEnhancement
    });

  } catch (error) {
    console.error('Narrative enhancement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
