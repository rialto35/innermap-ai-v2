/**
 * API endpoint for generating deep analysis reports
 * Streams Claude AI response in real-time
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDeepReportStream, generatePracticalCards } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { heroData } = await req.json();

    if (!heroData) {
      return new Response('Missing heroData', { status: 400 });
    }

    console.log('🚀 [API /deep-report] Starting report generation for user:', session.user.email);

    // Create streaming response with parallel generation
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = '';
          let practicalCards: any[] = [];
          
          // Start practical cards generation in parallel
          const cardsPromise = generatePracticalCards(heroData);
          console.log('🎴 [API /deep-report] Started parallel card generation');
          
          // Stream report generation
          for await (const chunk of generateDeepReportStream(heroData)) {
            fullText += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }

          // Report streaming complete, wait for cards
          console.log('📝 [API /deep-report] Report streaming complete, waiting for cards...');
          practicalCards = await cardsPromise;
          console.log('✅ [API /deep-report] Cards ready');

          // Send completion signal with full text and cards
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, fullText, practicalCards })}\n\n`));
          controller.close();
          
          console.log('✅ [API /deep-report] Report generation completed');
        } catch (error) {
          console.error('❌ [API /deep-report] Error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('❌ [API /deep-report] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

