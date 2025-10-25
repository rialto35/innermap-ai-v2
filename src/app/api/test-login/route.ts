import { NextResponse } from 'next/server';

export async function GET() {
  // 자동 제출되는 간단한 HTML: /api/auth/callback/credentials 로 POST
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>E2E Test Login</title>
    </head>
    <body>
      <form id="f" method="post" action="/api/auth/callback/credentials">
        <input type="hidden" name="csrfToken" value="">
        <input type="hidden" name="email" value="e2e@innermap.ai">
        <input type="hidden" name="password" value="pass">
        <input type="hidden" name="callbackUrl" value="/dashboard">
      </form>
      <script>
        // CSRF 토큰을 먼저 가져온 후 폼 제출
        fetch('/api/auth/csrf')
          .then(res => res.json())
          .then(data => {
            document.querySelector('input[name="csrfToken"]').value = data.csrfToken;
            document.getElementById('f').submit();
          })
          .catch(() => {
            // CSRF 실패 시에도 폼 제출 시도
            document.getElementById('f').submit();
          });
      </script>
    </body>
    </html>
  `;
  
  return new NextResponse(html, { 
    headers: { 
      'content-type': 'text/html',
      'cache-control': 'no-cache'
    } 
  });
}
