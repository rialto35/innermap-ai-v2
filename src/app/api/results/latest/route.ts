import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { matchHero } from "@/lib/data/heroes144";
import { getTribeFromBirthDate } from "@/lib/innermapLogic";
import { recommendStone } from "@/lib/data/tribesAndStones";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  const provider = session?.provider || 'google';
  const providerId = session?.providerId;
  
  // /api/imcore/me와 동일한 이메일 형식 생성 (provider 구분)
  const email = (() => {
    const raw = session?.user?.email
    if (provider && provider !== 'google') {
      if (raw) return `${provider}:${raw}`
      if (providerId) return `${provider}:${providerId}`
    }
    return raw || (provider && providerId ? `${provider}:${providerId}` : undefined)
  })()

  if (!email) {
    return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401 });
  }

  console.log('🔍 [/api/results/latest] Looking up user:', { email, provider, providerId });

  // provider + providerId로 우선 조회 (더 정확함)
  let userRow = null;
  if (provider && providerId) {
    const { data: byProvider } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('provider', provider)
      .eq('provider_id', providerId)
      .maybeSingle();
    
    if (byProvider) {
      userRow = byProvider;
      console.log('✅ [/api/results/latest] Found user by provider:', userRow.id);
    }
  }

  // provider로 못 찾으면 email로 조회 (fallback)
  if (!userRow) {
    const { data: byEmail } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (byEmail) {
      userRow = byEmail;
      console.log('✅ [/api/results/latest] Found user by email:', userRow.id);
    }
  }

  if (!userRow?.id) {
    console.log('❌ [/api/results/latest] No user found');
    return new Response(JSON.stringify({ data: null }), { status: 200 });
  }

  // 1. 최신 assessment 조회
  const { data: assessment, error: assessmentError } = await supabaseAdmin
    .from('test_assessments')
    .select('id, created_at, raw_answers')
    .eq('user_id', userRow.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (assessmentError) {
    console.error('[RESULTS/LATEST][ASSESSMENT ERROR]', assessmentError);
    return new Response(JSON.stringify({ error: "DB_ERROR" }), { status: 500 });
  }

  if (!assessment) {
    return new Response(JSON.stringify({ data: null }), { status: 200 });
  }

  // 2. assessment_id로 result 조회 (FK 없이 명시적 조회)
  const { data: result, error: resultError } = await supabaseAdmin
    .from('test_assessment_results')
    .select('assessment_id, mbti, big5, inner9, keywords, world, confidence')
    .eq('assessment_id', assessment.id)
    .maybeSingle();

  if (resultError) {
    console.error('[RESULTS/LATEST][RESULT ERROR]', resultError);
    return new Response(JSON.stringify({ error: "DB_ERROR" }), { status: 500 });
  }

  const data = assessment;

  if (!result || !data) {
    return new Response(JSON.stringify({ data: null }), { status: 200 });
  }

  const birthdate = data.raw_answers?.profile?.birthdate || result.world?.birthdate || null;
  const tribeMatch = birthdate ? getTribeFromBirthDate(birthdate) : null;
  const hero = matchHero(result.mbti, result.world?.reti ?? result.world?.retiTop ?? result.world?.reti_type ?? '1');
  const stoneInput = {
    openness: result.big5?.O ?? result.big5?.openness ?? 50,
    conscientiousness: result.big5?.C ?? result.big5?.conscientiousness ?? 50,
    extraversion: result.big5?.E ?? result.big5?.extraversion ?? 50,
    agreeableness: result.big5?.A ?? result.big5?.agreeableness ?? 50,
    neuroticism: result.big5?.N ?? result.big5?.neuroticism ?? 50,
  } as const;
  const stone = recommendStone(stoneInput);

  // Inner9 데이터 변환: { axes: [...], labels: [...] } → { creation: 20, will: 16, ... }
  let inner9Normalized = result.inner9;
  if (result.inner9 && Array.isArray(result.inner9.axes) && Array.isArray(result.inner9.labels)) {
    // 배열 형태를 객체 형태로 변환 (inner9.ts가 이제 올바른 키를 생성하므로 단순 lowercase 매핑)
    inner9Normalized = {};
    result.inner9.labels.forEach((label: string, index: number) => {
      const key = label.toLowerCase();
      inner9Normalized[key] = result.inner9.axes[index];
    });
  }

  // Normalize possible 0..1 scale to 0..100 for consistent UI rendering
  if (inner9Normalized && typeof inner9Normalized === 'object') {
    Object.keys(inner9Normalized as any).forEach((k) => {
      const v = Number((inner9Normalized as any)[k]);
      if (Number.isFinite(v)) {
        const scaled = v <= 1 ? v * 100 : v;
        (inner9Normalized as any)[k] = Math.max(0, Math.min(100, Math.round(scaled)));
      }
    });
  }

  const enriched = {
    ...result,
    inner9: inner9Normalized, // 변환된 Inner9 데이터 사용
    assessment_id: data.id,
    created_at: data.created_at,
    hero: hero
      ? {
          id: hero.id,
          name: hero.name,
          nameEn: hero.nameEn,
          tagline: hero.tagline,
          description: hero.description,
          abilities: hero.abilities,
        }
      : null,
    tribe: tribeMatch
      ? {
          id: tribeMatch.tribe.id,
          name: tribeMatch.tribe.nameKo,
          nameEn: tribeMatch.tribe.nameEn,
          symbol: tribeMatch.tribe.symbol,
          color: tribeMatch.tribe.colorHex,
          essence: tribeMatch.tribe.essence ?? null,
        }
      : null,
    stone: stone
      ? {
          id: stone.id,
          name: stone.nameKo,
          nameEn: stone.nameEn,
          icon: stone.icon ?? '💎',
          color: stone.color ?? '#8B5CF6',
          keywords: stone.keywords ?? [],
          summary: stone.summary ?? stone.description,
          coreValue: stone.coreValue,
          effect: stone.effect,
        }
      : null,
  };

  return new Response(JSON.stringify({ data: enriched }), { status: 200 });
}
