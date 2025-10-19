/**
 * LLM-powered narrative enhancement for Inner9
 * Provides natural language coaching feedback
 */

import OpenAI from "openai";

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
});

export async function llmPolish(
  summary: ReturnType<typeof import('./inner9Narrative').summarize>,
  scores: Record<string, number>
): Promise<string> {
  try {
    const prompt = `
너는 전문 코치야. 아래 요약과 점수를 바탕으로 3문장 이내 한국어 코칭 피드백을 작성해.
숫자는 그대로 사용하고 과장 금지. 친근하지만 전문적으로.

요약: ${JSON.stringify(summary)}
점수: ${JSON.stringify(scores)}

핵심 포인트:
- 강점을 인정하고 활용 방안 제시
- 성장 영역에 대한 구체적 조언
- 균형 잡힌 관점에서 격려
`;

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 200,
    });

    return response.choices[0].message?.content?.trim() ?? "";
  } catch (error) {
    console.error('LLM enhancement failed:', error);
    return "";
  }
}

/**
 * Check if LLM enhancement is available
 */
export function isLLMAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
