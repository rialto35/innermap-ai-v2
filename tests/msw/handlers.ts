import { http, HttpResponse } from 'msw';

export const handlers = [
  // Supabase 쿼리 예시
  http.get('https://*.supabase.co/rest/v1/inner9/*', () => {
    return HttpResponse.json({ 
      ok: true, 
      data: { 
        o: 9, 
        c: 11, 
        e: 44, 
        a: 11, 
        n: 56 
      }
    });
  }),
  
  // LLM 호출 고정 응답
  http.post('https://api.openai.com/v1/chat/completions', async () => {
    return HttpResponse.json({
      id: 'test',
      choices: [{ 
        message: { 
          content: 'Mocked analysis text - This is a test response for Inner9 analysis.' 
        } 
      }]
    });
  }),

  // Anthropic Claude API 모킹
  http.post('https://api.anthropic.com/v1/messages', async () => {
    return HttpResponse.json({
      id: 'test-claude',
      content: [{
        type: 'text',
        text: 'Mocked Claude analysis for Inner9 personality assessment.'
      }]
    });
  }),

  // Supabase 인증 모킹
  http.post('https://*.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      }
    });
  }),

  // Supabase 사용자 데이터 모킹
  http.get('https://*.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json([{
      id: 'test-user-id',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z'
    }]);
  }),

  // Inner9 결과 데이터 모킹
  http.get('https://*.supabase.co/rest/v1/inner9_results', () => {
    return HttpResponse.json([{
      id: 'test-result-id',
      user_id: 'test-user-id',
      axes: {
        creativity: 75,
        balance: 60,
        intuition: 80,
        analysis: 70,
        harmony: 65,
        drive: 85,
        reflection: 55,
        empathy: 90,
        discipline: 45
      },
      created_at: '2024-01-01T00:00:00Z'
    }]);
  })
];
