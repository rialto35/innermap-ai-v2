#!/usr/bin/env node
// Simple smoke test for /api/report/[id] share token access
// Usage: node scripts/smoke-share.mjs --report <id> --token <token> [--base http://localhost:3000]

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}

const base = getArg('base', 'http://localhost:3000');
const reportId = getArg('report');
const token = getArg('token');

if (!reportId) {
  console.error('❌ --report <id> is required');
  process.exit(1);
}

async function hit(path, init) {
  const url = `${base}${path}`;
  const res = await fetch(url, init);
  let bodyText = '';
  try { bodyText = await res.text(); } catch {}
  return { status: res.status, ok: res.ok, url, body: bodyText };
}

(async () => {
  console.log('🚀 Smoke test start');
  console.log('📍 Base:', base);
  console.log('📝 Report:', reportId);
  if (token) console.log('🔑 Token:', token);

  // 1) No token (should be 401 when unauthenticated)
  const r1 = await hit(`/api/report/${reportId}`);
  console.log('\n[1] GET /api/report/:id (no token) =>', r1.status);

  // 2) Wrong token (should be 403)
  const badToken = (token || 'demo') + 'x';
  const r2 = await hit(`/api/report/${reportId}?t=${encodeURIComponent(badToken)}`);
  console.log('[2] GET /api/report/:id?t=bad =>', r2.status);

  // 3) Valid token (should be 200)
  if (token) {
    const r3 = await hit(`/api/report/${reportId}?t=${encodeURIComponent(token)}`);
    console.log('[3] GET /api/report/:id?t=valid =>', r3.status);
    if (r3.ok) {
      try {
        const json = JSON.parse(r3.body);
        const svg = json?.visuals_json?.big5RadarUrl;
        console.log('    big5RadarUrl:', svg || '(none)');
        if (svg && svg.startsWith('http')) {
          const r4 = await fetch(svg);
          console.log('    [4] GET big5.svg =>', r4.status);
        }
      } catch {}
    }
  } else {
    console.log('[3] Skipped valid token test (no --token provided)');
  }

  console.log('\n✅ Done');
})();


