/**
 * InnerMap AI - 카탈로그 데이터 동기화 스크립트 (간단 버전)
 * 정적 데이터를 DB 카탈로그 테이블에 동기화
 */

import { createClient } from '@supabase/supabase-js';

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

// 샘플 영웅 데이터 (테스트용)
const SAMPLE_HEROES = [
  {
    id: 'intp-1',
    number: 1,
    mbti: 'INTP',
    reti: '1',
    retiType: '완벽형',
    name: '논리의 설계자',
    nameEn: 'Architect of Logic',
    tagline: '완벽한 구조 속에서 진리를 추구하는 사색가',
    description: '지식과 구조를 동시에 사랑하는 설계자.',
    abilities: {
      openness: 92,
      conscientiousness: 78,
      extraversion: 35,
      agreeableness: 52,
      neuroticism: 30
    },
    strengths: ['논리적', '분석적'],
    weaknesses: ['감정적']
  },
  {
    id: 'enfp-1',
    number: 145,
    mbti: 'ENFP',
    reti: '1',
    retiType: '완벽형',
    name: '열정의 개척자',
    nameEn: 'Pioneer of Passion',
    tagline: '새로운 가능성을 열어가는 열정가',
    description: '창의적이고 열정적인 개척자.',
    abilities: {
      openness: 95,
      conscientiousness: 60,
      extraversion: 90,
      agreeableness: 85,
      neuroticism: 40
    },
    strengths: ['창의적', '열정적'],
    weaknesses: ['산만함']
  }
];

// 샘플 부족 데이터 (테스트용)
const SAMPLE_TRIBES = [
  {
    id: 1,
    name: 'Lumin',
    nameKo: '루민',
    nameEn: 'Lumin',
    symbol: '빛의 수정',
    color: '은백색',
    colorHex: '#E8E8F0',
    emoji: '🔮',
    coreValue: '조화·공감·치유',
    archetype: '감정 직관형 / 평화주의자',
    keywords: ['조화', '공감', '치유', '균형', '내면의 조율자'],
    description: '타인의 감정을 빛으로 읽는 자들.',
    opposingTribe: 'Neva'
  },
  {
    id: 2,
    name: 'Varno',
    nameKo: '바르노',
    nameEn: 'Varno',
    symbol: '강철의 인장',
    color: '남색',
    colorHex: '#1E3A8A',
    emoji: '⚡',
    coreValue: '규율·신뢰·완벽성',
    archetype: '판단형 / 관리자형',
    keywords: ['규율', '신뢰', '완벽성', '질서', '원칙'],
    description: '바르노는 세상을 질서로 다스린다.',
    opposingTribe: 'Aurin'
  }
];

// 샘플 결정석 데이터 (테스트용)
const SAMPLE_STONES = [
  {
    id: 1,
    name: 'Arche',
    nameKo: '아르케',
    nameEn: 'Arche',
    symbol: '기원의 빛',
    color: '#8B5CF6',
    keywords: ['자기이해', '정체성', '자각'],
    summary: '자기 자신을 이해하는 기초 결정석',
    big5Mapping: {
      openness: 'high',
      neuroticism: 'low'
    },
    coreValue: '자기이해·자각·정체성',
    growthKeyword: '나는 누구인가를 안다',
    description: '아르케는 모든 여정의 시작이다.',
    effect: '자기인식 +30%, 내적 안정 +25%'
  },
  {
    id: 2,
    name: 'Ignis',
    nameKo: '이그니스',
    nameEn: 'Ignis',
    symbol: '불꽃의 심장',
    big5Mapping: {
      extraversion: 'high',
      conscientiousness: 'high'
    },
    coreValue: '열정·추진력·실행',
    growthKeyword: '움직임이 나를 만든다',
    description: '이그니스는 타오르는 욕망의 에너지다.',
    effect: '추진력 +35%, 실행력 +30%'
  }
];

// 영웅 데이터 동기화
async function syncHeroes() {
  console.log('🔄 영웅 데이터 동기화 중...');
  
  const heroData = SAMPLE_HEROES.map(hero => ({
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
    tribe_code: null,
    stone_code: null,
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
  
  const tribeData = SAMPLE_TRIBES.map(tribe => ({
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
  
  const stoneData = SAMPLE_STONES.map(stone => ({
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
    console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
    console.log('Service Key:', supabaseServiceKey ? 'SET' : 'NOT SET');
    
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
