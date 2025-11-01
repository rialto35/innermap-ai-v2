/**
 * InnerMap AI - 부족 카탈로그
 * 12개 부족 데이터를 코드 기반으로 정규화
 */

import { TribeCatalog } from './types';
import { TRIBES_12 } from '../data/tribesAndStones';

// 부족 코드 생성 함수
function generateTribeCode(name: string): string {
  return `TRIBE_${name.toUpperCase()}`;
}

// 슬러그 생성 함수
function generateTribeSlug(name: string): string {
  return name.toLowerCase();
}

// 부족 카탈로그 생성
export const TRIBE_CATALOG: TribeCatalog[] = TRIBES_12.map(tribe => ({
  code: generateTribeCode(tribe.name),
  slug: generateTribeSlug(tribe.name),
  canonicalName: tribe.nameKo,
  aliases: [
    tribe.name,
    tribe.nameEn,
    tribe.symbol,
    ...tribe.keywords,
  ],
  meta: {
    nameEn: tribe.nameEn,
    symbol: tribe.symbol,
    color: tribe.color,
    colorHex: tribe.colorHex,
    emoji: tribe.emoji,
    coreValue: tribe.coreValue,
    archetype: tribe.archetype,
    keywords: tribe.keywords,
    description: tribe.description,
    opposingTribe: tribe.opposingTribe,
  },
}));

// 인덱스 생성
export const TRIBE_INDEX = {
  byCode: new Map(TRIBE_CATALOG.map(tribe => [tribe.code, tribe])),
  bySlug: new Map(TRIBE_CATALOG.map(tribe => [tribe.slug, tribe])),
  byAlias: new Map(
    TRIBE_CATALOG.flatMap(tribe => 
      tribe.aliases.map(alias => [alias.toLowerCase(), tribe])
    )
  ),
  byCanonicalName: new Map(TRIBE_CATALOG.map(tribe => [tribe.canonicalName, tribe])),
};

// 검색 함수들
export function getTribeByCode(code: string): TribeCatalog | null {
  return TRIBE_INDEX.byCode.get(code) || null;
}

export function getTribeBySlug(slug: string): TribeCatalog | null {
  return TRIBE_INDEX.bySlug.get(slug.toLowerCase()) || null;
}

export function getTribeByAlias(alias: string): TribeCatalog | null {
  return TRIBE_INDEX.byAlias.get(alias.toLowerCase()) || null;
}

export function getTribeByCanonicalName(name: string): TribeCatalog | null {
  return TRIBE_INDEX.byCanonicalName.get(name) || null;
}

// 모든 검색 방법을 시도하는 통합 검색
export function findTribe(query: string): TribeCatalog | null {
  // 1. 코드로 검색
  if (query.startsWith('TRIBE_')) {
    return getTribeByCode(query);
  }
  
  // 2. 슬러그로 검색
  const bySlug = getTribeBySlug(query);
  if (bySlug) return bySlug;
  
  // 3. 정식 이름으로 검색
  const byName = getTribeByCanonicalName(query);
  if (byName) return byName;
  
  // 4. 별칭으로 검색
  return getTribeByAlias(query);
}

// 원소별 부족 목록
export function getTribesByElement(element: string): TribeCatalog[] {
  // TODO: 원소 매핑 로직 구현
  return TRIBE_CATALOG.filter(tribe => 
    tribe.meta.keywords.some(keyword => 
      keyword.toLowerCase().includes(element.toLowerCase())
    )
  );
}

// 검증 함수
export function validateTribeCode(code: string): boolean {
  return TRIBE_INDEX.byCode.has(code);
}

export function validateTribeSlug(slug: string): boolean {
  return TRIBE_INDEX.bySlug.has(slug.toLowerCase());
}

// 통계 함수
export function getTribeStats() {
  return {
    total: TRIBE_CATALOG.length,
    byElement: TRIBE_CATALOG.reduce((acc, tribe) => {
      // 원소 추출 로직 (임시)
      const element = tribe.meta.keywords.find(k => 
        ['불', '물', '바람', '땅', '빛', '어둠'].includes(k)
      ) || 'unknown';
      acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}



