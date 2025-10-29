/**
 * InnerMap AI - 기존 데이터 마이그레이션 스크립트
 * 문자열 기반 저장 → 코드 기반 저장으로 변환
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 이름 → 코드 매핑 함수들
function getHeroCodeFromName(name: string): string | null {
  // 간단한 매핑 (실제로는 더 정교한 로직 필요)
  const mappings: Record<string, string> = {
    '논리의 설계자': 'HERO_INTP_01',
    '지식의 조력자': 'HERO_INTP_02',
    '체계의 개척자': 'HERO_INTP_03',
    '아이디어의 연금술사': 'HERO_INTP_04',
    // TODO: 모든 영웅 매핑 추가
  };
  
  return mappings[name] || null;
}

function getTribeCodeFromName(name: string): string | null {
  const mappings: Record<string, string> = {
    '루민': 'TRIBE_LUMIN',
    '바르노': 'TRIBE_VARNO',
    '아우린': 'TRIBE_AURIN',
    '노드크루스': 'TRIBE_NODECRUS',
    '베르디안': 'TRIBE_VERDIAN',
    '이그니스': 'TRIBE_IGNIS',
    '루나': 'TRIBE_LUNA',
    '실바': 'TRIBE_SILVA',
    '솔라': 'TRIBE_SOLA',
    '플로라': 'TRIBE_FLORA',
    '테라': 'TRIBE_TERRA',
    '글라시스': 'TRIBE_GLACIS',
    '페로': 'TRIBE_FERO',
    '아우라': 'TRIBE_AURA',
    '움브라': 'TRIBE_UMBRA',
    '크리스탈': 'TRIBE_CRYSTAL',
    '볼트': 'TRIBE_VOLT',
    '프리즘': 'TRIBE_PRISM',
    '노마드': 'TRIBE_NOMAD',
    '드라스': 'TRIBE_DRAS',
    '네바': 'TRIBE_NEVA',
    '노바': 'TRIBE_NOVA',
    '텐브라': 'TRIBE_TENBRA',
    '세라': 'TRIBE_SERA',
  };
  
  return mappings[name] || null;
}

function getStoneCodeFromName(name: string): string | null {
  const mappings: Record<string, string> = {
    '아르케': 'STONE_ARCHE',
    '이그니스': 'STONE_IGNIS',
    '네이아': 'STONE_NEIA',
    '베르디': 'STONE_VERDI',
    '노크투스': 'STONE_NOCTUS',
    '아우레아': 'STONE_AUREA',
    '메카르': 'STONE_MECHAR',
    '엘라라': 'STONE_ELARA',
    '미르': 'STONE_MYR',
    '자르크': 'STONE_ZARC',
    '크리스탈': 'STONE_CRYSTAL',
    '오팔': 'STONE_OPAL',
  };
  
  return mappings[name] || null;
}

// test_assessment_results 데이터 마이그레이션
async function migrateAssessmentResults() {
  console.log('🔄 test_assessment_results 데이터 마이그레이션 중...');
  
  // 기존 데이터 조회
  const { data: results, error: fetchError } = await supabase
    .from('test_assessment_results')
    .select('*')
    .not('world', 'is', null);

  if (fetchError) {
    console.error('❌ 데이터 조회 실패:', fetchError);
    throw fetchError;
  }

  if (!results || results.length === 0) {
    console.log('ℹ️ 마이그레이션할 데이터가 없습니다.');
    return;
  }

  console.log(`📊 ${results.length}개 레코드 마이그레이션 시작...`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const result of results) {
    try {
      const world = result.world;
      if (!world || typeof world !== 'object') {
        skipped++;
        continue;
      }

      // 코드 추출
      const heroCode = getHeroCodeFromName(world.hero);
      const tribeCode = getTribeCodeFromName(world.tribe);
      const stoneCode = getStoneCodeFromName(world.stone);

      if (!heroCode || !tribeCode || !stoneCode) {
        console.warn(`⚠️ 코드 매핑 실패: ${JSON.stringify(world)}`);
        skipped++;
        continue;
      }

      // 통합 테이블에 데이터 삽입
      const { error: insertError } = await supabase
        .from('test_results_unified')
        .insert({
          user_id: result.user_id, // TODO: assessment에서 user_id 가져오기
          hero_code: heroCode,
          tribe_code: tribeCode,
          stone_code: stoneCode,
          mbti: result.mbti || 'INFP',
          reti: '5', // 기본값
          big5: result.big5 || { O: 0.5, C: 0.5, E: 0.5, A: 0.5, N: 0.5 },
          inner9: result.inner9 || {},
          engine_version: 'legacy-migration',
          confidence: result.confidence || 0.8,
        });

      if (insertError) {
        console.error(`❌ 삽입 실패:`, insertError);
        errors++;
      } else {
        migrated++;
      }

    } catch (error) {
      console.error(`❌ 마이그레이션 오류:`, error);
      errors++;
    }
  }

  console.log(`✅ 마이그레이션 완료:`);
  console.log(`  - 성공: ${migrated}개`);
  console.log(`  - 건너뜀: ${skipped}개`);
  console.log(`  - 오류: ${errors}개`);
}

// test_results 데이터 마이그레이션
async function migrateTestResults() {
  console.log('🔄 test_results 데이터 마이그레이션 중...');
  
  // 기존 데이터 조회
  const { data: results, error: fetchError } = await supabase
    .from('test_results')
    .select('*');

  if (fetchError) {
    console.error('❌ 데이터 조회 실패:', fetchError);
    throw fetchError;
  }

  if (!results || results.length === 0) {
    console.log('ℹ️ 마이그레이션할 데이터가 없습니다.');
    return;
  }

  console.log(`📊 ${results.length}개 레코드 마이그레이션 시작...`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const result of results) {
    try {
      // 코드 추출
      const heroCode = getHeroCodeFromName(result.hero_name);
      const tribeCode = getTribeCodeFromName(result.tribe_name);
      const stoneCode = getStoneCodeFromName(result.stone_name);

      if (!heroCode || !tribeCode || !stoneCode) {
        console.warn(`⚠️ 코드 매핑 실패: ${result.hero_name}, ${result.tribe_name}, ${result.stone_name}`);
        skipped++;
        continue;
      }

      // 통합 테이블에 데이터 삽입
      const { error: insertError } = await supabase
        .from('test_results_unified')
        .insert({
          user_id: result.user_id,
          hero_code: heroCode,
          tribe_code: tribeCode,
          stone_code: stoneCode,
          mbti: result.mbti_type || 'INFP',
          reti: result.reti_top1?.replace('r', '') || '5',
          big5: {
            O: (result.big5_openness || 50) / 100,
            C: (result.big5_conscientiousness || 50) / 100,
            E: (result.big5_extraversion || 50) / 100,
            A: (result.big5_agreeableness || 50) / 100,
            N: (result.big5_neuroticism || 50) / 100,
          },
          inner9: {}, // 기본값
          engine_version: 'legacy-migration',
          confidence: 0.8,
        });

      if (insertError) {
        console.error(`❌ 삽입 실패:`, insertError);
        errors++;
      } else {
        migrated++;
      }

    } catch (error) {
      console.error(`❌ 마이그레이션 오류:`, error);
      errors++;
    }
  }

  console.log(`✅ 마이그레이션 완료:`);
  console.log(`  - 성공: ${migrated}개`);
  console.log(`  - 건너뜀: ${skipped}개`);
  console.log(`  - 오류: ${errors}개`);
}

// 메인 마이그레이션 함수
async function migrateData() {
  try {
    console.log('🚀 기존 데이터 마이그레이션 시작...');
    
    await migrateAssessmentResults();
    await migrateTestResults();
    
    console.log('\n🎉 모든 데이터 마이그레이션 완료!');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData };

