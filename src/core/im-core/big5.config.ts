/**
 * Big5 문항 매핑/역문항/가중치 설정 (Phase 0)
 * - 필요 시 이 파일만 수정하여 실험
 */

type DimConfig = {
  items: number[];     // 1-based indices (1..55)
  reverse: number[];   // 역문항 인덱스
  weights: number[];   // 각 문항 가중치 (items 길이와 동일)
};

type Big5Map = {
  version: string;
  O: DimConfig;
  C: DimConfig;
  E: DimConfig;
  A: DimConfig;
  N: DimConfig;
};

const baseItems = {
  O: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51],
  C: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52],
  E: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53],
  A: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54],
  N: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
};

const ones = (len: number) => Array.from({ length: len }, () => 1);

// 기본값: 역문항 비적용, 가중치 1.0 (안전)
const DEFAULT_MAP: Big5Map = {
  version: 'big5-map@v0.1',
  O: { items: baseItems.O, reverse: [], weights: ones(baseItems.O.length) },
  C: { items: baseItems.C, reverse: [], weights: ones(baseItems.C.length) },
  E: { items: baseItems.E, reverse: [], weights: ones(baseItems.E.length) },
  A: { items: baseItems.A, reverse: [], weights: ones(baseItems.A.length) },
  N: { items: baseItems.N, reverse: [], weights: ones(baseItems.N.length) },
};

export function getBig5Mapping(): Big5Map {
  // IM_ENGINE_V2_ENABLED 가드 하에, 환경변수 기반 오버라이드 허용
  const v2 = process.env.IM_ENGINE_V2_ENABLED === 'true';
  const allow = process.env.IM_BIG5_CONFIG_ENABLED === 'true';
  if (v2 && allow) {
    try {
      const revJson = process.env.IM_BIG5_REV_INDEXES; // 예: {"O":[11],"C":[],"E":[33],"A":[14,39],"N":[5,35]}
      const wtJson = process.env.IM_BIG5_WEIGHTS; // 예: {"O":[1,1,...], ...}
      const rev = revJson ? JSON.parse(revJson) : {};
      const wt = wtJson ? JSON.parse(wtJson) : {};
      const toDim = (key: keyof typeof baseItems): DimConfig => ({
        items: baseItems[key],
        reverse: Array.isArray(rev[key]) ? rev[key] : [],
        weights: Array.isArray(wt[key]) && wt[key].length === baseItems[key].length
          ? wt[key]
          : ones(baseItems[key].length),
      });
      return {
        version: 'big5-map@env',
        O: toDim('O'),
        C: toDim('C'),
        E: toDim('E'),
        A: toDim('A'),
        N: toDim('N'),
      };
    } catch (e) {
      console.warn('[Big5Map] Failed to parse env overrides, falling back to default:', e);
    }
  }
  return DEFAULT_MAP;
}


