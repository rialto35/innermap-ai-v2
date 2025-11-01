/**
 * InnerMap AI - 통합 카탈로그 타입 정의
 * 단일 출처(SSOT) + 정규화된 식별자 시스템
 */

export interface CatalogItem {
  code: string;           // 불변 키 (HERO_INTP_01, TRIBE_LUMIN, STONE_EMERALD)
  slug: string;           // URL용 슬러그 (intp-01, lumin, emerald)
  canonicalName: string;  // 표준 이름 (논리의 설계자, 루민, 에메랄드)
  aliases: string[];      // 별칭들 (설계자, 논리학자 등)
  meta: Record<string, any>; // 추가 메타데이터
}

export interface HeroCatalog extends CatalogItem {
  meta: {
    mbti: string;         // INTP
    reti: string;         // 1
    retiType: string;     // 완벽형
    nameEn: string;       // Architect of Logic
    tagline: string;      // 완벽한 구조 속에서...
    description: string;  // 상세 설명
    abilities: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    strengths?: string[];
    weaknesses?: string[];
    tribeCode?: string;   // 연결된 부족 코드
    stoneCode?: string;   // 연결된 결정석 코드
  };
}

export interface TribeCatalog extends CatalogItem {
  meta: {
    nameEn: string;       // Lumin
    symbol: string;       // 빛의 수정
    color: string;        // 은백색
    colorHex: string;     // #E8E8F0
    emoji: string;        // 🔮
    coreValue: string;    // 조화·공감·치유
    archetype: string;    // 감정 직관형 / 평화주의자
    keywords: string[];   // [조화, 공감, 치유...]
    description: string;  // 상세 설명
    opposingTribe?: string; // 대립 부족
  };
}

export interface StoneCatalog extends CatalogItem {
  meta: {
    nameEn: string;       // Emerald
    symbol: string;       // 상징
    color: string;        // 색상
    keywords?: string[];  // 키워드들
    summary?: string;     // 요약
    big5Mapping: {
      openness?: 'high' | 'low' | 'avg';
      conscientiousness?: 'high' | 'low' | 'avg';
      extraversion?: 'high' | 'low' | 'avg';
      agreeableness?: 'high' | 'low' | 'avg';
      neuroticism?: 'high' | 'low' | 'avg';
    };
    coreValue: string;    // 핵심 가치
    growthKeyword: string; // 성장 키워드
    description: string;  // 상세 설명
    effect: string;       // 효과
  };
}

// 검색 결과 타입
export type CatalogSearchResult<T extends CatalogItem> = {
  item: T;
  matchType: 'exact' | 'alias' | 'slug' | 'fuzzy';
  score: number;
};

// 카탈로그 인덱스 타입
export interface CatalogIndex<T extends CatalogItem> {
  byCode: Map<string, T>;
  bySlug: Map<string, T>;
  byAlias: Map<string, T>;
  byCanonicalName: Map<string, T>;
}


