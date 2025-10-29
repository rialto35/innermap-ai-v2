/**
 * InnerMap AI - 통합 카탈로그 시스템
 * 단일 출처(SSOT) + 정규화된 식별자 시스템
 */

// 모든 카탈로그 타입과 함수들을 통합 export
export * from './types';
export * from './heroes';
export * from './tribes';
export * from './stones';

// 통합 검색 함수들
import { HeroCatalog, TribeCatalog, StoneCatalog } from './types';
import { findHero } from './heroes';
import { findTribe } from './tribes';
import { findStone } from './stones';

// 범용 검색 함수
export function searchCatalog(query: string): {
  heroes: HeroCatalog[];
  tribes: TribeCatalog[];
  stones: StoneCatalog[];
} {
  const hero = findHero(query);
  const tribe = findTribe(query);
  const stone = findStone(query);

  return {
    heroes: hero ? [hero] : [],
    tribes: tribe ? [tribe] : [],
    stones: stone ? [stone] : [],
  };
}

// 코드 검증 함수들
export function validateCode(code: string): {
  isValid: boolean;
  type: 'hero' | 'tribe' | 'stone' | 'unknown';
  item?: HeroCatalog | TribeCatalog | StoneCatalog;
} {
  // 영웅 코드 검증
  if (code.startsWith('HERO_')) {
    const hero = findHero(code);
    return {
      isValid: !!hero,
      type: hero ? 'hero' : 'unknown',
      item: hero || undefined,
    };
  }

  // 부족 코드 검증
  if (code.startsWith('TRIBE_')) {
    const tribe = findTribe(code);
    return {
      isValid: !!tribe,
      type: tribe ? 'tribe' : 'unknown',
      item: tribe || undefined,
    };
  }

  // 결정석 코드 검증
  if (code.startsWith('STONE_')) {
    const stone = findStone(code);
    return {
      isValid: !!stone,
      type: stone ? 'stone' : 'unknown',
      item: stone || undefined,
    };
  }

  return {
    isValid: false,
    type: 'unknown',
  };
}

// 전체 카탈로그 통계
export function getCatalogStats() {
  return {
    heroes: {
      total: 144,
      byMBTI: 16,
      byRETI: 9,
    },
    tribes: {
      total: 12,
      byElement: 6, // 임시
    },
    stones: {
      total: 12,
      byBig5Trait: 5,
    },
  };
}

// 카탈로그 무결성 검증
export function validateCatalogIntegrity(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // TODO: 실제 무결성 검증 로직 구현
  // - 코드 중복 검사
  // - 별칭 충돌 검사
  // - 참조 무결성 검사

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 기본값 제공 함수들
export async function getDefaultHero(): Promise<HeroCatalog> {
  // 첫 번째 영웅을 기본값으로 사용
  const { HERO_CATALOG } = await import('./heroes');
  return HERO_CATALOG[0];
}

export async function getDefaultTribe(): Promise<TribeCatalog> {
  // 첫 번째 부족을 기본값으로 사용
  const { TRIBE_CATALOG } = await import('./tribes');
  return TRIBE_CATALOG[0];
}

export async function getDefaultStone(): Promise<StoneCatalog> {
  // 첫 번째 결정석을 기본값으로 사용
  const { STONE_CATALOG } = await import('./stones');
  return STONE_CATALOG[0];
}
