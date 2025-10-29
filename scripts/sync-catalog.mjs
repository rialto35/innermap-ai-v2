/**
 * InnerMap AI - 카탈로그 데이터 동기화 스크립트
 * 정적 데이터를 DB 카탈로그 테이블에 동기화
 */

import { createClient } from '@supabase/supabase-js';
import { HEROES_144 } from '../src/lib/data/heroes144.js';
import { TRIBES_12, STONES_12 } from '../src/lib/data/tribesAndStones.js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 영웅 코드 생성 함수
function generateHeroCode(mbti, reti, number) {
  return `HERO_${mbti}_${reti.padStart(2, '0')}`;
}

// 부족 코드 생성 함수
function generateTribeCode(name) {
  return `TRIBE_${name.toUpperCase()}`;
}

// 결정석 코드 생성 함수
function generateStoneCode(name) {
  return `STONE_${name.toUpperCase()}`;
}

// 영웅 데이터 동기화
async function syncHeroes() {
  console.log('🔄 영웅 데이터 동기화 중...');
  
  const heroData = HEROES_144.map(hero => ({
    code: generateHeroCode(hero.mbti, hero.reti, hero.number),
    canonical_name: hero.name,
    aliases: [
      hero.nameEn,
      hero.retiType,
      ...(hero.strengths || []),
    ],
    mbti: hero.mbti,
    reti: hero.reti,
    reti_type: hero.retiType,
    name_en: hero.nameEn,
    tagline: hero.tagline,
    description: hero.description,
    abilities: hero.abilities,
    strengths: hero.strengths || [],
    weaknesses: hero.weaknesses || [],
    tribe_code: null, // TODO: 나중에 연결
    stone_code: null, // TODO: 나중에 연결
  }));

  const { error } = await supabase
    .from('hero_catalog')
    .upsert(heroData, { onConflict: 'code' });

  if (error) {
    console.error('❌ 영웅 데이터 동기화 실패:', error);
    throw error;
  }

  console.log(`✅ 영웅 ${heroData.length}개 동기화 완료`);
}

// 부족 데이터 동기화
async function syncTribes() {
  console.log('🔄 부족 데이터 동기화 중...');
  
  const tribeData = TRIBES_12.map(tribe => ({
    code: generateTribeCode(tribe.name),
    canonical_name: tribe.nameKo,
    aliases: [
      tribe.name,
      tribe.nameEn,
      tribe.symbol,
      ...tribe.keywords,
    ],
    name_en: tribe.nameEn,
    symbol: tribe.symbol,
    color: tribe.color,
    color_hex: tribe.colorHex,
    emoji: tribe.emoji,
    core_value: tribe.coreValue,
    archetype: tribe.archetype,
    keywords: tribe.keywords,
    description: tribe.description,
    opposing_tribe: tribe.opposingTribe,
  }));

  const { error } = await supabase
    .from('tribe_catalog')
    .upsert(tribeData, { onConflict: 'code' });

  if (error) {
    console.error('❌ 부족 데이터 동기화 실패:', error);
    throw error;
  }

  console.log(`✅ 부족 ${tribeData.length}개 동기화 완료`);
}

// 결정석 데이터 동기화
async function syncStones() {
  console.log('🔄 결정석 데이터 동기화 중...');
  
  const stoneData = STONES_12.map(stone => ({
    code: generateStoneCode(stone.name),
    canonical_name: stone.nameKo,
    aliases: [
      stone.name,
      stone.nameEn,
      stone.symbol,
      ...(stone.keywords || []),
    ],
    name_en: stone.nameEn,
    symbol: stone.symbol,
    color: stone.color || '#000000',
    keywords: stone.keywords || [],
    summary: stone.summary,
    big5_mapping: stone.big5Mapping,
    core_value: stone.coreValue,
    growth_keyword: stone.growthKeyword,
    description: stone.description,
    effect: stone.effect,
  }));

  const { error } = await supabase
    .from('stone_catalog')
    .upsert(stoneData, { onConflict: 'code' });

  if (error) {
    console.error('❌ 결정석 데이터 동기화 실패:', error);
    throw error;
  }

  console.log(`✅ 결정석 ${stoneData.length}개 동기화 완료`);
}

// 메인 동기화 함수
async function syncCatalog() {
  try {
    console.log('🚀 카탈로그 데이터 동기화 시작...');
    
    await syncHeroes();
    await syncTribes();
    await syncStones();
    
    console.log('\n🎉 모든 카탈로그 데이터 동기화 완료!');
    
    // 통계 출력
    const { data: heroCount } = await supabase
      .from('hero_catalog')
      .select('code', { count: 'exact', head: true });
    
    const { data: tribeCount } = await supabase
      .from('tribe_catalog')
      .select('code', { count: 'exact', head: true });
    
    const { data: stoneCount } = await supabase
      .from('stone_catalog')
      .select('code', { count: 'exact', head: true });
    
    console.log(`📊 동기화된 데이터:`);
    console.log(`  - 영웅: ${heroCount?.length || 0}개`);
    console.log(`  - 부족: ${tribeCount?.length || 0}개`);
    console.log(`  - 결정석: ${stoneCount?.length || 0}개`);
    
  } catch (error) {
    console.error('❌ 동기화 실패:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  syncCatalog();
}

export { syncCatalog };
