/**
 * InnerMap AI - 카탈로그 데이터 동기화 스크립트 (테스트 버전)
 */

import { createClient } from '@supabase/supabase-js';

console.log('🚀 카탈로그 동기화 시작...');

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
console.log('Service Key:', supabaseServiceKey ? 'SET' : 'NOT SET');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 테스트 데이터
const testHero = {
  code: 'HERO_INTP_01',
  canonical_name: '논리의 설계자',
  aliases: ['Architect of Logic', '완벽형'],
  mbti: 'INTP',
  reti: '1',
  reti_type: '완벽형',
  name_en: 'Architect of Logic',
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
  weaknesses: ['감정적'],
  tribe_code: null,
  stone_code: null,
};

async function testSync() {
  try {
    console.log('🔄 테스트 영웅 데이터 삽입 중...');
    
    const { data, error } = await supabase
      .from('hero_catalog')
      .upsert([testHero], { onConflict: 'code' });

    if (error) {
      console.error('❌ 데이터 삽입 실패:', error);
      throw error;
    }

    console.log('✅ 테스트 데이터 삽입 성공!');
    
    // 조회 테스트
    const { data: heroes, error: selectError } = await supabase
      .from('hero_catalog')
      .select('code, canonical_name')
      .limit(5);

    if (selectError) {
      console.error('❌ 데이터 조회 실패:', selectError);
      throw selectError;
    }

    console.log('📊 조회된 영웅 데이터:');
    heroes?.forEach(hero => {
      console.log(`  - ${hero.code}: ${hero.canonical_name}`);
    });

    console.log('\n🎉 카탈로그 동기화 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 동기화 실패:', error);
    process.exit(1);
  }
}

testSync();



