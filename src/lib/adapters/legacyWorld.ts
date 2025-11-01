/**
 * InnerMap AI - 호환성 레이어 (어댑터)
 * 기존 문자열 기반 데이터를 카탈로그 코드로 변환
 */

import { HEROES_144 } from '../data/heroes144';
import { TRIBES_12, STONES_12 } from '../data/tribesAndStones';

// 영웅 이름 → 코드 매핑
const HERO_NAME_TO_CODE = new Map<string, string>();
HEROES_144.forEach(hero => {
  HERO_NAME_TO_CODE.set(hero.name, `HERO_${hero.mbti}_${hero.reti.padStart(2, '0')}`);
  HERO_NAME_TO_CODE.set(hero.nameEn, `HERO_${hero.mbti}_${hero.reti.padStart(2, '0')}`);
});

// 부족 이름 → 코드 매핑
const TRIBE_NAME_TO_CODE = new Map<string, string>();
TRIBES_12.forEach(tribe => {
  TRIBE_NAME_TO_CODE.set(tribe.nameKo, `TRIBE_${tribe.name.toUpperCase()}`);
  TRIBE_NAME_TO_CODE.set(tribe.name, `TRIBE_${tribe.name.toUpperCase()}`);
  TRIBE_NAME_TO_CODE.set(tribe.nameEn, `TRIBE_${tribe.name.toUpperCase()}`);
});

// 결정석 이름 → 코드 매핑
const STONE_NAME_TO_CODE = new Map<string, string>();
STONES_12.forEach(stone => {
  STONE_NAME_TO_CODE.set(stone.nameKo, `STONE_${stone.name.toUpperCase()}`);
  STONE_NAME_TO_CODE.set(stone.name, `STONE_${stone.name.toUpperCase()}`);
  STONE_NAME_TO_CODE.set(stone.nameEn, `STONE_${stone.name.toUpperCase()}`);
});

// 영웅 이름을 코드로 변환
export function getHeroCodeFromName(name: string): string | null {
  if (!name) return null;
  
  // 직접 매핑 시도
  const directCode = HERO_NAME_TO_CODE.get(name);
  if (directCode) return directCode;
  
  // 부분 매칭 시도
  for (const [heroName, code] of HERO_NAME_TO_CODE) {
    if (heroName.includes(name) || name.includes(heroName)) {
      console.warn(`⚠️ 부분 매칭으로 영웅 코드 변환: "${name}" → "${code}"`);
      return code;
    }
  }
  
  console.warn(`⚠️ 영웅 이름을 코드로 변환 실패: "${name}"`);
  return null;
}

// 부족 이름을 코드로 변환
export function getTribeCodeFromName(name: string): string | null {
  if (!name) return null;
  
  // 직접 매핑 시도
  const directCode = TRIBE_NAME_TO_CODE.get(name);
  if (directCode) return directCode;
  
  // 부분 매칭 시도
  for (const [tribeName, code] of TRIBE_NAME_TO_CODE) {
    if (tribeName.includes(name) || name.includes(tribeName)) {
      console.warn(`⚠️ 부분 매칭으로 부족 코드 변환: "${name}" → "${code}"`);
      return code;
    }
  }
  
  console.warn(`⚠️ 부족 이름을 코드로 변환 실패: "${name}"`);
  return null;
}

// 결정석 이름을 코드로 변환
export function getStoneCodeFromName(name: string): string | null {
  if (!name) return null;
  
  // 직접 매핑 시도
  const directCode = STONE_NAME_TO_CODE.get(name);
  if (directCode) return directCode;
  
  // 부분 매칭 시도
  for (const [stoneName, code] of STONE_NAME_TO_CODE) {
    if (stoneName.includes(name) || name.includes(stoneName)) {
      console.warn(`⚠️ 부분 매칭으로 결정석 코드 변환: "${name}" → "${code}"`);
      return code;
    }
  }
  
  console.warn(`⚠️ 결정석 이름을 코드로 변환 실패: "${name}"`);
  return null;
}

// 기존 world 객체를 코드 기반으로 변환
export function adaptLegacyWorld(world: any): {
  heroCode: string | null;
  tribeCode: string | null;
  stoneCode: string | null;
  errors: string[];
} {
  const errors: string[] = [];
  
  const heroCode = getHeroCodeFromName(world?.hero);
  const tribeCode = getTribeCodeFromName(world?.tribe);
  const stoneCode = getStoneCodeFromName(world?.stone);
  
  if (!heroCode) errors.push(`영웅 코드 변환 실패: ${world?.hero}`);
  if (!tribeCode) errors.push(`부족 코드 변환 실패: ${world?.tribe}`);
  if (!stoneCode) errors.push(`결정석 코드 변환 실패: ${world?.stone}`);
  
  return {
    heroCode,
    tribeCode,
    stoneCode,
    errors
  };
}

// 기존 test_results 데이터를 통합 형식으로 변환
export function adaptLegacyTestResult(result: any): {
  heroCode: string | null;
  tribeCode: string | null;
  stoneCode: string | null;
  errors: string[];
} {
  const errors: string[] = [];
  
  const heroCode = getHeroCodeFromName(result?.hero_name);
  const tribeCode = getTribeCodeFromName(result?.tribe_name);
  const stoneCode = getStoneCodeFromName(result?.stone_name);
  
  if (!heroCode) errors.push(`영웅 코드 변환 실패: ${result?.hero_name}`);
  if (!tribeCode) errors.push(`부족 코드 변환 실패: ${result?.tribe_name}`);
  if (!stoneCode) errors.push(`결정석 코드 변환 실패: ${result?.stone_name}`);
  
  return {
    heroCode,
    tribeCode,
    stoneCode,
    errors
  };
}

// 기본값 제공
export function getDefaultCodes(): {
  heroCode: string;
  tribeCode: string;
  stoneCode: string;
} {
  return {
    heroCode: 'HERO_INFP_05', // 기본 영웅
    tribeCode: 'TRIBE_LUMIN', // 기본 부족
    stoneCode: 'STONE_AUREA', // 기본 결정석
  };
}

// 검증 함수
export function validateCodes(codes: {
  heroCode?: string;
  tribeCode?: string;
  stoneCode?: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (codes.heroCode && !codes.heroCode.startsWith('HERO_')) {
    errors.push(`잘못된 영웅 코드 형식: ${codes.heroCode}`);
  }
  
  if (codes.tribeCode && !codes.tribeCode.startsWith('TRIBE_')) {
    errors.push(`잘못된 부족 코드 형식: ${codes.tribeCode}`);
  }
  
  if (codes.stoneCode && !codes.stoneCode.startsWith('STONE_')) {
    errors.push(`잘못된 결정석 코드 형식: ${codes.stoneCode}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}



