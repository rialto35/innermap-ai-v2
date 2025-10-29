-- InnerMap AI v2 - 카탈로그 기반 DB 스키마 통합
-- 코드 기반 저장 방식으로 변경
-- 생성일: 2025-01-27

-- =====================================================
-- 1. 카탈로그 테이블 생성 (정적 데이터 동기화용)
-- =====================================================

-- 영웅 카탈로그 테이블
CREATE TABLE IF NOT EXISTS hero_catalog (
  code TEXT PRIMARY KEY,                    -- HERO_INTP_01
  canonical_name TEXT NOT NULL,             -- 논리의 설계자
  aliases TEXT[] DEFAULT '{}',              -- 별칭들
  mbti TEXT NOT NULL,                       -- INTP
  reti TEXT NOT NULL,                       -- 1
  reti_type TEXT NOT NULL,                  -- 완벽형
  name_en TEXT NOT NULL,                    -- Architect of Logic
  tagline TEXT NOT NULL,                    -- 완벽한 구조 속에서...
  description TEXT NOT NULL,                -- 상세 설명
  abilities JSONB NOT NULL,                 -- 능력치
  strengths TEXT[] DEFAULT '{}',            -- 강점들
  weaknesses TEXT[] DEFAULT '{}',           -- 약점들
  tribe_code TEXT,                          -- 연결된 부족 코드
  stone_code TEXT,                          -- 연결된 결정석 코드
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 부족 카탈로그 테이블
CREATE TABLE IF NOT EXISTS tribe_catalog (
  code TEXT PRIMARY KEY,                    -- TRIBE_LUMIN
  canonical_name TEXT NOT NULL,             -- 루민
  aliases TEXT[] DEFAULT '{}',             -- 별칭들
  name_en TEXT NOT NULL,                    -- Lumin
  symbol TEXT NOT NULL,                     -- 빛의 수정
  color TEXT NOT NULL,                      -- 은백색
  color_hex TEXT NOT NULL,                  -- #E8E8F0
  emoji TEXT NOT NULL,                      -- 🔮
  core_value TEXT NOT NULL,                 -- 조화·공감·치유
  archetype TEXT NOT NULL,                  -- 감정 직관형 / 평화주의자
  keywords TEXT[] NOT NULL,                 -- 키워드들
  description TEXT NOT NULL,                -- 상세 설명
  opposing_tribe TEXT,                      -- 대립 부족
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 결정석 카탈로그 테이블
CREATE TABLE IF NOT EXISTS stone_catalog (
  code TEXT PRIMARY KEY,                    -- STONE_EMERALD
  canonical_name TEXT NOT NULL,             -- 에메랄드
  aliases TEXT[] DEFAULT '{}',             -- 별칭들
  name_en TEXT NOT NULL,                    -- Emerald
  symbol TEXT NOT NULL,                     -- 상징
  color TEXT NOT NULL,                      -- 색상
  keywords TEXT[] DEFAULT '{}',            -- 키워드들
  summary TEXT,                             -- 요약
  big5_mapping JSONB NOT NULL,             -- Big5 매핑
  core_value TEXT NOT NULL,                 -- 핵심 가치
  growth_keyword TEXT NOT NULL,             -- 성장 키워드
  description TEXT NOT NULL,                -- 상세 설명
  effect TEXT NOT NULL,                     -- 효과
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. 통합 결과 테이블 생성
-- =====================================================

-- 통합 검사 결과 테이블 (코드 기반)
CREATE TABLE IF NOT EXISTS test_results_unified (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- 핵심 결과 (코드 기반 참조)
  hero_code TEXT NOT NULL REFERENCES hero_catalog(code),
  tribe_code TEXT NOT NULL REFERENCES tribe_catalog(code),
  stone_code TEXT NOT NULL REFERENCES stone_catalog(code),
  
  -- 분석 결과
  mbti TEXT NOT NULL,
  reti TEXT NOT NULL,
  big5 JSONB NOT NULL,                      -- {O: 0.8, C: 0.7, E: 0.6, A: 0.5, N: 0.4}
  inner9 JSONB NOT NULL,                    -- Inner9 9축 점수
  
  -- 메타데이터
  engine_version TEXT NOT NULL DEFAULT 'imcore-1.0.0',
  confidence NUMERIC DEFAULT 0.8,
  raw_answers JSONB,                        -- 원본 답변 (선택적)
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. 인덱스 생성
-- =====================================================

-- 카탈로그 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_hero_catalog_mbti_reti ON hero_catalog(mbti, reti);
CREATE INDEX IF NOT EXISTS idx_hero_catalog_aliases ON hero_catalog USING GIN(aliases);
CREATE INDEX IF NOT EXISTS idx_tribe_catalog_keywords ON tribe_catalog USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_stone_catalog_big5 ON stone_catalog USING GIN(big5_mapping);

-- 통합 결과 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_test_results_unified_user_id ON test_results_unified(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_unified_created_at ON test_results_unified(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_unified_mbti ON test_results_unified(mbti);
CREATE INDEX IF NOT EXISTS idx_test_results_unified_hero_code ON test_results_unified(hero_code);
CREATE INDEX IF NOT EXISTS idx_test_results_unified_tribe_code ON test_results_unified(tribe_code);
CREATE INDEX IF NOT EXISTS idx_test_results_unified_stone_code ON test_results_unified(stone_code);

-- =====================================================
-- 4. RLS 정책 설정
-- =====================================================

-- 카탈로그 테이블은 읽기 전용 (모든 사용자 접근 가능)
ALTER TABLE hero_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero_catalog_read_all" ON hero_catalog FOR SELECT USING (true);

ALTER TABLE tribe_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tribe_catalog_read_all" ON tribe_catalog FOR SELECT USING (true);

ALTER TABLE stone_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stone_catalog_read_all" ON stone_catalog FOR SELECT USING (true);

-- 통합 결과 테이블 RLS
ALTER TABLE test_results_unified ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 본인 데이터만
CREATE POLICY "test_results_unified_read_own" ON test_results_unified
  FOR SELECT USING (user_id = auth.uid());

-- 쓰기 정책: 본인 데이터만
CREATE POLICY "test_results_unified_insert_own" ON test_results_unified
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 수정 정책: 본인 데이터만
CREATE POLICY "test_results_unified_update_own" ON test_results_unified
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- 5. 뷰 생성 (기존 코드 호환성)
-- =====================================================

-- 통합 결과 뷰 (카탈로그 데이터 포함)
CREATE OR REPLACE VIEW test_results_with_catalog AS
SELECT 
  tru.id,
  tru.user_id,
  tru.mbti,
  tru.reti,
  tru.big5,
  tru.inner9,
  tru.engine_version,
  tru.confidence,
  tru.created_at,
  tru.updated_at,
  
  -- 영웅 정보
  tru.hero_code,
  hc.canonical_name as hero_name,
  hc.name_en as hero_name_en,
  hc.tagline as hero_tagline,
  hc.description as hero_description,
  hc.abilities as hero_abilities,
  
  -- 부족 정보
  tru.tribe_code,
  tc.canonical_name as tribe_name,
  tc.name_en as tribe_name_en,
  tc.symbol as tribe_symbol,
  tc.color as tribe_color,
  tc.core_value as tribe_core_value,
  
  -- 결정석 정보
  tru.stone_code,
  sc.canonical_name as stone_name,
  sc.name_en as stone_name_en,
  sc.symbol as stone_symbol,
  sc.color as stone_color,
  sc.core_value as stone_core_value,
  sc.effect as stone_effect
  
FROM test_results_unified tru
LEFT JOIN hero_catalog hc ON tru.hero_code = hc.code
LEFT JOIN tribe_catalog tc ON tru.tribe_code = tc.code
LEFT JOIN stone_catalog sc ON tru.stone_code = sc.code;

-- =====================================================
-- 6. 완료 로그
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '카탈로그 기반 DB 스키마 통합 완료:';
  RAISE NOTICE '- hero_catalog 테이블 생성';
  RAISE NOTICE '- tribe_catalog 테이블 생성';
  RAISE NOTICE '- stone_catalog 테이블 생성';
  RAISE NOTICE '- test_results_unified 테이블 생성';
  RAISE NOTICE '- 인덱스 및 RLS 정책 설정';
  RAISE NOTICE '- 호환성 뷰 생성';
END $$;

