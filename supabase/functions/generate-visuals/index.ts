// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: generate-visuals
// Generates Big5 radar / auxiliary bars / growth vector PNGs
// and updates reports.visuals_json with signed URLs.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildBig5RadarSVG } from './buildBig5RadarSVG.ts';

// Deno 호환 SVG → PNG 변환 (resvg-wasm 사용)
// @resvg/resvg-js는 Node.js 네이티브 바이너리라서 Deno에서 작동 안 함
import initWasm, { Resvg as ResvgWasm } from 'https://esm.sh/@resvg/resvg-wasm@2.6.2';

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase envs' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json().catch(() => ({}));
    const reportId = body.reportId as string | undefined;
    if (!reportId) {
      return new Response(JSON.stringify({ error: 'reportId required' }), { status: 400 });
    }

    // Load report + result data (with Big5 scores)
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select(`
        id, 
        result_id,
        visuals_json,
        test_results (
          big5_openness,
          big5_conscientiousness,
          big5_extraversion,
          big5_agreeableness,
          big5_neuroticism
        )
      `)
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      return new Response(JSON.stringify({ error: reportError?.message || 'Report not found' }), { status: 404 });
    }

    const testResult = (report as any).test_results;
    if (!testResult) {
      return new Response(JSON.stringify({ error: 'No test_results linked to report' }), { status: 404 });
    }

    const visuals = report.visuals_json || {};
    const bucket = 'reports';

    const uploadPng = async (key: string, pngBuffer: Uint8Array): Promise<string> => {
      const path = `${reportId}/charts/${key}`;
      await supabase.storage.from(bucket).upload(path, pngBuffer, { contentType: 'image/png', upsert: true });
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    };

    const updates: Record<string, any> = {};

    // Generate Big5 Radar Chart
    if (!visuals.big5RadarUrl) {
      const big5Scores = {
        openness: testResult.big5_openness || 50,
        conscientiousness: testResult.big5_conscientiousness || 50,
        extraversion: testResult.big5_extraversion || 50,
        agreeableness: testResult.big5_agreeableness || 50,
        neuroticism: testResult.big5_neuroticism || 50
      };

      const svg = buildBig5RadarSVG(big5Scores);
      
      // WASM 초기화 및 변환
      await initWasm();
      const resvg = new ResvgWasm(svg);
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      updates.big5RadarUrl = await uploadPng('big5.png', pngBuffer);
    }

    // Placeholder for auxiliary bars (future implementation)
    if (!visuals.auxBarsUrl) {
      // For now, skip or generate simple placeholder
      // updates.auxBarsUrl = await uploadPng('aux.png', simplePlaceholder());
    }

    // Placeholder for growth vector (future implementation)
    if (!visuals.growthVectorUrl) {
      // For now, skip
      // updates.growthVectorUrl = await uploadPng('growth.png', simplePlaceholder());
    }

    // Add generated_at timestamp
    if (Object.keys(updates).length > 0) {
      updates.generated_at = new Date().toISOString();
      const merged = { ...(visuals || {}), ...updates };
      await supabase.from('reports').update({ visuals_json: merged }).eq('id', reportId);
    }

    return new Response(
      JSON.stringify({ ok: true, reportId, updates }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[generate-visuals] Error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
});
