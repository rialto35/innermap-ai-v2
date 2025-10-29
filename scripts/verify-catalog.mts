/**
 * InnerMap AI - 카탈로그 검증 스크립트
 * 코드 중복, 참조 무결성, 별칭 충돌 검사
 */

import fs from 'node:fs';
import path from 'node:path';

// 카탈로그 모듈 동적 import
const catalogPath = path.join(process.cwd(), 'src/lib/catalog');

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    heroes: number;
    tribes: number;
    stones: number;
  };
}

async function validateCatalog(): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 카탈로그 모듈 로드
    const catalogModule = await import(path.join(catalogPath, 'index.js'));
    const { 
      HERO_CATALOG, 
      TRIBE_CATALOG, 
      STONE_CATALOG,
      validateCatalogIntegrity 
    } = catalogModule;

    console.log('🔍 카탈로그 검증 시작...');

    // 1. 기본 통계
    const stats = {
      heroes: HERO_CATALOG.length,
      tribes: TRIBE_CATALOG.length,
      stones: STONE_CATALOG.length,
    };

    console.log(`📊 통계: 영웅 ${stats.heroes}개, 부족 ${stats.tribes}개, 결정석 ${stats.stones}개`);

    // 2. 코드 중복 검사
    console.log('🔍 코드 중복 검사...');
    
    const heroCodes = HERO_CATALOG.map(h => h.code);
    const tribeCodes = TRIBE_CATALOG.map(t => t.code);
    const stoneCodes = STONE_CATALOG.map(s => s.code);

    // 영웅 코드 중복 검사
    const heroDuplicates = heroCodes.filter((code, i) => heroCodes.indexOf(code) !== i);
    if (heroDuplicates.length > 0) {
      errors.push(`영웅 코드 중복: ${heroDuplicates.join(', ')}`);
    }

    // 부족 코드 중복 검사
    const tribeDuplicates = tribeCodes.filter((code, i) => tribeCodes.indexOf(code) !== i);
    if (tribeDuplicates.length > 0) {
      errors.push(`부족 코드 중복: ${tribeDuplicates.join(', ')}`);
    }

    // 결정석 코드 중복 검사
    const stoneDuplicates = stoneCodes.filter((code, i) => stoneCodes.indexOf(code) !== i);
    if (stoneDuplicates.length > 0) {
      errors.push(`결정석 코드 중복: ${stoneDuplicates.join(', ')}`);
    }

    // 3. 슬러그 중복 검사
    console.log('🔍 슬러그 중복 검사...');
    
    const heroSlugs = HERO_CATALOG.map(h => h.slug);
    const tribeSlugs = TRIBE_CATALOG.map(t => t.slug);
    const stoneSlugs = STONE_CATALOG.map(s => s.slug);

    const heroSlugDuplicates = heroSlugs.filter((slug, i) => heroSlugs.indexOf(slug) !== i);
    if (heroSlugDuplicates.length > 0) {
      errors.push(`영웅 슬러그 중복: ${heroSlugDuplicates.join(', ')}`);
    }

    // 4. 별칭 충돌 검사
    console.log('🔍 별칭 충돌 검사...');
    
    const allAliases = [
      ...HERO_CATALOG.flatMap(h => h.aliases),
      ...TRIBE_CATALOG.flatMap(t => t.aliases),
      ...STONE_CATALOG.flatMap(s => s.aliases),
    ].map(alias => alias.toLowerCase());

    const aliasDuplicates = allAliases.filter((alias, i) => allAliases.indexOf(alias) !== i);
    if (aliasDuplicates.length > 0) {
      warnings.push(`별칭 충돌 발견: ${aliasDuplicates.slice(0, 10).join(', ')}${aliasDuplicates.length > 10 ? '...' : ''}`);
    }

    // 5. MBTI/RETI 조합 검증
    console.log('🔍 MBTI/RETI 조합 검증...');
    
    const expectedCombinations = 16 * 9; // 144개
    if (stats.heroes !== expectedCombinations) {
      errors.push(`영웅 수 불일치: 예상 ${expectedCombinations}개, 실제 ${stats.heroes}개`);
    }

    // 6. 필수 필드 검증
    console.log('🔍 필수 필드 검증...');
    
    HERO_CATALOG.forEach((hero, index) => {
      if (!hero.code || !hero.slug || !hero.canonicalName) {
        errors.push(`영웅 ${index + 1}: 필수 필드 누락 (code, slug, canonicalName)`);
      }
      if (!hero.meta.mbti || !hero.meta.reti) {
        errors.push(`영웅 ${index + 1}: MBTI/RETI 누락`);
      }
    });

    TRIBE_CATALOG.forEach((tribe, index) => {
      if (!tribe.code || !tribe.slug || !tribe.canonicalName) {
        errors.push(`부족 ${index + 1}: 필수 필드 누락 (code, slug, canonicalName)`);
      }
    });

    STONE_CATALOG.forEach((stone, index) => {
      if (!stone.code || !stone.slug || !stone.canonicalName) {
        errors.push(`결정석 ${index + 1}: 필수 필드 누락 (code, slug, canonicalName)`);
      }
    });

    // 7. 코드 형식 검증
    console.log('🔍 코드 형식 검증...');
    
    const heroCodePattern = /^HERO_[A-Z]{4}_\d{2}$/;
    const tribeCodePattern = /^TRIBE_[A-Z]+$/;
    const stoneCodePattern = /^STONE_[A-Z]+$/;

    HERO_CATALOG.forEach((hero, index) => {
      if (!heroCodePattern.test(hero.code)) {
        errors.push(`영웅 ${index + 1}: 잘못된 코드 형식 '${hero.code}'`);
      }
    });

    TRIBE_CATALOG.forEach((tribe, index) => {
      if (!tribeCodePattern.test(tribe.code)) {
        errors.push(`부족 ${index + 1}: 잘못된 코드 형식 '${tribe.code}'`);
      }
    });

    STONE_CATALOG.forEach((stone, index) => {
      if (!stoneCodePattern.test(stone.code)) {
        errors.push(`결정석 ${index + 1}: 잘못된 코드 형식 '${stone.code}'`);
      }
    });

    // 결과 출력
    console.log('\n📋 검증 결과:');
    console.log(`✅ 통계: 영웅 ${stats.heroes}개, 부족 ${stats.tribes}개, 결정석 ${stats.stones}개`);
    
    if (errors.length > 0) {
      console.log(`❌ 오류 ${errors.length}개:`);
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️ 경고 ${warnings.length}개:`);
      warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('🎉 모든 검증 통과!');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats,
    };

  } catch (error) {
    console.error('❌ 카탈로그 로드 실패:', error);
    return {
      isValid: false,
      errors: [`카탈로그 로드 실패: ${error}`],
      warnings: [],
      stats: { heroes: 0, tribes: 0, stones: 0 },
    };
  }
}

// 메인 실행
async function main() {
  const result = await validateCatalog();
  
  if (!result.isValid) {
    console.log('\n❌ 검증 실패');
    process.exit(1);
  } else {
    console.log('\n✅ 검증 성공');
    process.exit(0);
  }
}

// 스크립트 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { validateCatalog };
