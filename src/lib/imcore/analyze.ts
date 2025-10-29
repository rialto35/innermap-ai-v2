/**
 * IM-CORE 엔진 어댑터 (서버 전용)
 * 55문항 답변 → 전체 분석 결과
 */

"use server";

import { runAll } from "@/core/im-core/orchestrator";
import type { Big5 } from "@/types/assessment";

export type AnalyzeInput = {
  answers: number[]; // 길이 55, 1~7 Likert
  profile: { 
    gender?: string; 
    birthdate?: string; 
    email?: string;
  };
  engineVersion: string;
};

export type AnalyzeOutput = {
  summary: {
    mbti: string;
    big5: Big5;
    keywords: string[];
    confidence?: number;
  };
  premium: {
    inner9: { 
      axes: number[]; 
      labels: string[];
    };
    world: { 
      continent: string; 
      tribe: string; 
      stone: string;
      reti: number; // 추가: 세계관에 계산된 RETI 포함
    };
    growthVector?: { 
      from: number[]; 
      to: number[];
    };
  };
};

/**
 * IM-CORE 엔진 실행
 * @param input 답변 + 프로필 + 엔진 버전
 * @returns 요약 + 심층 분석 결과
 */
export async function runIMCore(input: AnalyzeInput): Promise<AnalyzeOutput> {
  const { answers, profile, engineVersion } = input;

  // 입력 검증
  if (!Array.isArray(answers) || answers.length !== 55) {
    throw new Error(`Invalid answers length: ${answers?.length}. Expected 55.`);
  }

  // IM-CORE 엔진 실행
  const result = runAll(answers, {
    weights: { big5: 1, mbti: 0.5, reti: 0.5 }
  });

  // Big5 변환 (o,c,e,a,n → O,C,E,A,N)
  const big5: Big5 = {
    O: Math.round(result.big5.o),
    C: Math.round(result.big5.c),
    E: Math.round(result.big5.e),
    A: Math.round(result.big5.a),
    N: Math.round(result.big5.n),
  };

  // Inner9 변환
  const inner9Axes = result.inner9.map(axis => Math.round(axis.value));
  const inner9Labels = result.inner9.map(axis => axis.label);

  // 키워드 생성 (Big5 기반)
  const keywords = generateKeywords(big5, result.mbti);

  // 세계관 매핑 (MBTI + RETI 기반)
  const worldBase = mapWorld(result.mbti, result.reti);
  const world = { ...worldBase, reti: result.reti };

  // 신뢰도 계산 (Big5 분산 기반)
  const confidence = calculateConfidence(big5);

  return {
    summary: {
      mbti: result.mbti,
      big5,
      keywords,
      confidence,
    },
    premium: {
      inner9: {
        axes: inner9Axes,
        labels: inner9Labels,
      },
      world,
      growthVector: {
        from: inner9Axes.map(() => 50), // 기준선
        to: inner9Axes, // 현재 값
      },
    },
  };
}

/**
 * Big5 + MBTI 기반 키워드 생성
 */
function generateKeywords(big5: Big5, mbti: string): string[] {
  const keywords: string[] = [];

  // Openness
  if (big5.O > 70) keywords.push("창의적", "호기심");
  else if (big5.O < 30) keywords.push("실용적", "현실적");

  // Conscientiousness
  if (big5.C > 70) keywords.push("체계적", "계획적");
  else if (big5.C < 30) keywords.push("유연한", "자유로운");

  // Extraversion
  if (big5.E > 70) keywords.push("사교적", "활동적");
  else if (big5.E < 30) keywords.push("내성적", "신중한");

  // Agreeableness
  if (big5.A > 70) keywords.push("협력적", "공감적");
  else if (big5.A < 30) keywords.push("독립적", "논리적");

  // Neuroticism
  if (big5.N > 70) keywords.push("민감한", "신중한");
  else if (big5.N < 30) keywords.push("안정적", "침착한");

  // MBTI 기반 추가
  if (mbti.startsWith("E")) keywords.push("외향적");
  if (mbti.startsWith("I")) keywords.push("내향적");
  if (mbti.includes("N")) keywords.push("직관적");
  if (mbti.includes("S")) keywords.push("감각적");
  if (mbti.includes("T")) keywords.push("사고형");
  if (mbti.includes("F")) keywords.push("감정형");

  // 중복 제거 후 상위 5개
  return Array.from(new Set(keywords)).slice(0, 5);
}

/**
 * MBTI + RETI 기반 세계관 매핑
 */
function mapWorld(mbti: string, reti: number): {
  continent: string;
  tribe: string;
  stone: string;
} {
  // 대륙 매핑 (MBTI 첫 글자 기반)
  const continentMap: Record<string, string> = {
    E: "동방의 대륙",
    I: "서방의 대륙",
  };
  const continent = continentMap[mbti[0]] || "중앙 대륙";

  // 부족 매핑 (MBTI 전체 기반)
  const tribeMap: Record<string, string> = {
    INTJ: "노드크루스",
    INTP: "베르디안",
    ENTJ: "이그니스",
    ENTP: "아쿠아",
    INFJ: "루나",
    INFP: "실바",
    ENFJ: "솔라",
    ENFP: "플로라",
    ISTJ: "테라",
    ISFJ: "글라시스",
    ESTJ: "페로",
    ESFJ: "아우라",
    ISTP: "움브라",
    ISFP: "크리스탈",
    ESTP: "볼트",
    ESFP: "프리즘",
  };
  const tribe = tribeMap[mbti] || "노마드";

  // 결정석 매핑 (RETI 기반)
  const stoneMap: Record<number, string> = {
    1: "베르디",
    2: "루비",
    3: "사파이어",
    4: "에메랄드",
    5: "토파즈",
    6: "아메시스트",
    7: "오닉스",
    8: "다이아몬드",
    9: "오팔",
  };
  const stone = stoneMap[reti] || "크리스탈";

  return { continent, tribe, stone };
}

/**
 * Big5 분산 기반 신뢰도 계산
 */
function calculateConfidence(big5: Big5): number {
  const values = Object.values(big5);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  // 분산이 클수록 신뢰도 높음 (극단적 응답 = 명확한 성향)
  const confidence = Math.min(1, variance / 1000);
  
  return Math.round(confidence * 100) / 100;
}

