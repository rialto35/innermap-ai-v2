/**
 * InnerMap AI - 결정석 카탈로그
 * 12개 결정석 데이터를 코드 기반으로 정규화
 */

import { StoneCatalog } from './types';
import { STONES_12 } from '../data/tribesAndStones';

// 결정석 코드 생성 함수
function generateStoneCode(name: string): string {
  return `STONE_${name.toUpperCase()}`;
}

// 슬러그 생성 함수
function generateStoneSlug(name: string): string {
  return name.toLowerCase();
}

// 결정석 카탈로그 생성
export const STONE_CATALOG: StoneCatalog[] = STONES_12.map(stone => ({
  code: generateStoneCode(stone.name),
  slug: generateStoneSlug(stone.name),
  canonicalName: stone.nameKo,
  aliases: [
    stone.name,
    stone.nameEn,
    stone.symbol,
    ...(stone.keywords || []),
  ],
  meta: {
    nameEn: stone.nameEn,
    symbol: stone.symbol,
    color: stone.color || '#000000',
    keywords: stone.keywords,
    summary: stone.summary,
    big5Mapping: stone.big5Mapping,
    coreValue: stone.coreValue,
    growthKeyword: stone.growthKeyword,
    description: stone.description,
    effect: stone.effect,
  },
}));

// 인덱스 생성
export const STONE_INDEX = {
  byCode: new Map(STONE_CATALOG.map(stone => [stone.code, stone])),
  bySlug: new Map(STONE_CATALOG.map(stone => [stone.slug, stone])),
  byAlias: new Map(
    STONE_CATALOG.flatMap(stone => 
      stone.aliases.map(alias => [alias.toLowerCase(), stone])
    )
  ),
  byCanonicalName: new Map(STONE_CATALOG.map(stone => [stone.canonicalName, stone])),
};

// 검색 함수들
export function getStoneByCode(code: string): StoneCatalog | null {
  return STONE_INDEX.byCode.get(code) || null;
}

export function getStoneBySlug(slug: string): StoneCatalog | null {
  return STONE_INDEX.bySlug.get(slug.toLowerCase()) || null;
}

export function getStoneByAlias(alias: string): StoneCatalog | null {
  return STONE_INDEX.byAlias.get(alias.toLowerCase()) || null;
}

export function getStoneByCanonicalName(name: string): StoneCatalog | null {
  return STONE_INDEX.byCanonicalName.get(name) || null;
}

// 모든 검색 방법을 시도하는 통합 검색
export function findStone(query: string): StoneCatalog | null {
  // 1. 코드로 검색
  if (query.startsWith('STONE_')) {
    return getStoneByCode(query);
  }
  
  // 2. 슬러그로 검색
  const bySlug = getStoneBySlug(query);
  if (bySlug) return bySlug;
  
  // 3. 정식 이름으로 검색
  const byName = getStoneByCanonicalName(query);
  if (byName) return byName;
  
  // 4. 별칭으로 검색
  return getStoneByAlias(query);
}

// Big5 특성별 결정석 검색
export function getStonesByBig5Trait(trait: keyof StoneCatalog['meta']['big5Mapping'], level: 'high' | 'low' | 'avg'): StoneCatalog[] {
  return STONE_CATALOG.filter(stone => stone.meta.big5Mapping[trait] === level);
}

// 성장 키워드별 결정석 검색
export function getStonesByGrowthKeyword(keyword: string): StoneCatalog[] {
  return STONE_CATALOG.filter(stone => 
    stone.meta.growthKeyword.toLowerCase().includes(keyword.toLowerCase())
  );
}

// 검증 함수
export function validateStoneCode(code: string): boolean {
  return STONE_INDEX.byCode.has(code);
}

export function validateStoneSlug(slug: string): boolean {
  return STONE_INDEX.bySlug.has(slug.toLowerCase());
}

// 통계 함수
export function getStoneStats() {
  return {
    total: STONE_CATALOG.length,
    byBig5Trait: {
      openness: {
        high: getStonesByBig5Trait('openness', 'high').length,
        low: getStonesByBig5Trait('openness', 'low').length,
        avg: getStonesByBig5Trait('openness', 'avg').length,
      },
      conscientiousness: {
        high: getStonesByBig5Trait('conscientiousness', 'high').length,
        low: getStonesByBig5Trait('conscientiousness', 'low').length,
        avg: getStonesByBig5Trait('conscientiousness', 'avg').length,
      },
      extraversion: {
        high: getStonesByBig5Trait('extraversion', 'high').length,
        low: getStonesByBig5Trait('extraversion', 'low').length,
        avg: getStonesByBig5Trait('extraversion', 'avg').length,
      },
      agreeableness: {
        high: getStonesByBig5Trait('agreeableness', 'high').length,
        low: getStonesByBig5Trait('agreeableness', 'low').length,
        avg: getStonesByBig5Trait('agreeableness', 'avg').length,
      },
      neuroticism: {
        high: getStonesByBig5Trait('neuroticism', 'high').length,
        low: getStonesByBig5Trait('neuroticism', 'low').length,
        avg: getStonesByBig5Trait('neuroticism', 'avg').length,
      },
    },
  };
}


