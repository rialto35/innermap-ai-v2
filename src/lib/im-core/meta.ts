export const imCoreMeta = {
  name: "im-core",
  version: "2.0",
  weights: { mbti: 0.35, reti: 0.30, big5: 0.35 },
};

export const inner9Meta = {
  name: "inner9",
  version: "1.1",
  scaling: "z",
  clip: [0, 100],
};

export const forecastMeta = {
  name: "forecast",
  version: "0.1",
  history: "3+",
  smoothing: "EMA(α=0.3)",
};

// 빌드 시간 (환경변수 또는 빌드 시점)
export const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "2025-10-20 13:20 KST";

// 가중치 문자열 생성
export const getWeightString = (weights: { mbti: number; reti: number; big5: number }) => {
  return `w(MBTI/RETI/Big5)=${weights.mbti}/${weights.reti}/${weights.big5}`;
};

// 엔진 메타데이터 조합 (설명 제거)
export const getEngineMetas = {
  inner9: () => [
    { 
      name: imCoreMeta.name, 
      version: imCoreMeta.version
    },
    { 
      name: inner9Meta.name, 
      version: inner9Meta.version
    }
  ],
  
  report: () => [
    { 
      name: imCoreMeta.name, 
      version: imCoreMeta.version
    }
  ],
  
  deep: () => [
    { 
      name: inner9Meta.name, 
      version: inner9Meta.version
    }
  ],
  
  forecast: () => [
    { 
      name: forecastMeta.name, 
      version: forecastMeta.version
    }
  ]
};
