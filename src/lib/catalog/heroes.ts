/**
 * InnerMap AI - 영웅 카탈로그
 * 144개 영웅 데이터를 코드 기반으로 정규화
 */

import { HeroCatalog } from './types';
import { HEROES_144 } from '../data/heroes144';

// 영웅 코드 생성 함수
function generateHeroCode(mbti: string, reti: string, number: number): string {
  return `HERO_${mbti}_${reti.padStart(2, '0')}`;
}

// 슬러그 생성 함수
function generateHeroSlug(mbti: string, reti: string): string {
  return `${mbti.toLowerCase()}-${reti}`;
}

// 영웅 카탈로그 생성
export const HERO_CATALOG: HeroCatalog[] = HEROES_144.map(hero => ({
  code: generateHeroCode(hero.mbti, hero.reti, hero.number),
  slug: generateHeroSlug(hero.mbti, hero.reti),
  canonicalName: hero.name,
  aliases: [
    hero.nameEn,
    hero.retiType,
    // 추가 별칭들 (필요시 확장)
    ...(hero.strengths || []),
  ],
  meta: {
    mbti: hero.mbti,
    reti: hero.reti,
    retiType: hero.retiType,
    nameEn: hero.nameEn,
    tagline: hero.tagline,
    description: hero.description,
    abilities: hero.abilities,
    strengths: hero.strengths,
    weaknesses: hero.weaknesses,
    // TODO: 부족/결정석 연결 (나중에 추가)
    tribeCode: undefined,
    stoneCode: undefined,
  },
}));

// 인덱스 생성
export const HERO_INDEX = {
  byCode: new Map(HERO_CATALOG.map(hero => [hero.code, hero])),
  bySlug: new Map(HERO_CATALOG.map(hero => [hero.slug, hero])),
  byAlias: new Map(
    HERO_CATALOG.flatMap(hero => 
      hero.aliases.map(alias => [alias.toLowerCase(), hero])
    )
  ),
  byCanonicalName: new Map(HERO_CATALOG.map(hero => [hero.canonicalName, hero])),
};

// 검색 함수들
export function getHeroByCode(code: string): HeroCatalog | null {
  return HERO_INDEX.byCode.get(code) || null;
}

export function getHeroBySlug(slug: string): HeroCatalog | null {
  return HERO_INDEX.bySlug.get(slug.toLowerCase()) || null;
}

export function getHeroByAlias(alias: string): HeroCatalog | null {
  return HERO_INDEX.byAlias.get(alias.toLowerCase()) || null;
}

export function getHeroByCanonicalName(name: string): HeroCatalog | null {
  return HERO_INDEX.byCanonicalName.get(name) || null;
}

// MBTI + RETI 조합으로 검색
export function getHeroByMBTIAndRETI(mbti: string, reti: string): HeroCatalog | null {
  const code = generateHeroCode(mbti, reti, 1); // number는 임시로 1 사용
  return getHeroByCode(code);
}

// 모든 검색 방법을 시도하는 통합 검색
export function findHero(query: string): HeroCatalog | null {
  // 1. 코드로 검색
  if (query.startsWith('HERO_')) {
    return getHeroByCode(query);
  }
  
  // 2. 슬러그로 검색
  if (query.includes('-')) {
    return getHeroBySlug(query);
  }
  
  // 3. 정식 이름으로 검색
  const byName = getHeroByCanonicalName(query);
  if (byName) return byName;
  
  // 4. 별칭으로 검색
  return getHeroByAlias(query);
}

// MBTI별 영웅 목록
export function getHeroesByMBTI(mbti: string): HeroCatalog[] {
  return HERO_CATALOG.filter(hero => hero.meta.mbti === mbti);
}

// RETI별 영웅 목록
export function getHeroesByRETI(reti: string): HeroCatalog[] {
  return HERO_CATALOG.filter(hero => hero.meta.reti === reti);
}

// 검증 함수
export function validateHeroCode(code: string): boolean {
  return HERO_INDEX.byCode.has(code);
}

export function validateHeroSlug(slug: string): boolean {
  return HERO_INDEX.bySlug.has(slug.toLowerCase());
}

// 통계 함수
export function getHeroStats() {
  return {
    total: HERO_CATALOG.length,
    byMBTI: HERO_CATALOG.reduce((acc, hero) => {
      acc[hero.meta.mbti] = (acc[hero.meta.mbti] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byRETI: HERO_CATALOG.reduce((acc, hero) => {
      acc[hero.meta.reti] = (acc[hero.meta.reti] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}


