/**
 * API endpoint for generating AI-powered Inner9 detailed story
 * Server-side only to protect OpenAI API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateInner9DetailedStory } from '@/lib/psychometrics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inner9Scores, personalityType, topDimension, lowDimension, avg, mbti } = body;

    // Validate required fields
    if (!inner9Scores || !personalityType || !topDimension || !lowDimension || typeof avg !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🤖 [API /inner9/story] Generating AI story...');

    // Generate AI story on server side
    const story = await generateInner9DetailedStory(
      inner9Scores,
      personalityType,
      topDimension,
      lowDimension,
      avg,
      mbti
    );

    console.log('✅ [API /inner9/story] Story generated:', story.length, 'chars');

    return NextResponse.json({ ok: true, story });
  } catch (error) {
    console.error('❌ [API /inner9/story] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

