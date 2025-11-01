/**
 * IM-Core v3.0 검증 스크립트
 * 
 * 목적:
 * - 60문항 완성도 검증
 * - 구조적 타당성 검증
 * - ENFJ + 8번 시뮬레이션 테스트
 */

import type { ItemMetaV3, Likert5, ValidationResult, EngineResultV3 } from "./types";
import { items60V3, TOTAL_ITEMS, REVERSE_ITEM_IDS, ITEMS_PER_DOMAIN } from "./items60-v3";
import { runIMCoreV3 } from "./index";

/**
 * 60문항 구조 검증
 */
export function validateItems60(items: ItemMetaV3[] = items60V3): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. 총 문항 수 확인
  if (items.length !== 60) {
    errors.push(`총 문항 수 오류: ${items.length} (60개 필요)`);
  }
  
  // 2. 역문항 비율 확인 (30~40%)
  const reverseCount = items.filter(i => i.reverse).length;
  const reverseRatio = reverseCount / items.length;
  if (reverseRatio < 0.3 || reverseRatio > 0.6) {
    warnings.push(`역문항 비율: ${Math.round(reverseRatio * 100)}% (권장: 30~60%)`);
  }
  
  // 3. 파셋별 문항 수 확인 (각 4개)
  const facetCounts: Record<string, number> = {};
  for (const item of items) {
    facetCounts[item.facet] = (facetCounts[item.facet] || 0) + 1;
  }
  
  for (const [facet, count] of Object.entries(facetCounts)) {
    if (count !== 4) {
      errors.push(`파셋 ${facet}: ${count}개 문항 (4개 필요)`);
    }
  }
  
  // 4. 영역별 문항 수 확인 (각 12개)
  const domainCounts: Record<string, number> = {};
  for (const item of items) {
    domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
  }
  
  for (const [domain, expectedCount] of Object.entries(ITEMS_PER_DOMAIN)) {
    const actualCount = domainCounts[domain] || 0;
    if (actualCount !== expectedCount) {
      errors.push(`영역 ${domain}: ${actualCount}개 문항 (${expectedCount}개 필요)`);
    }
  }
  
  // 5. 문항 ID 중복 확인
  const ids = items.map(i => i.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push("문항 ID 중복 발견");
  }
  
  // 6. 문항 ID 연속성 확인 (1~60)
  for (let i = 1; i <= 60; i++) {
    if (!ids.includes(i)) {
      errors.push(`문항 ID ${i} 누락`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalItems: items.length,
      reverseItems: reverseCount,
      reverseRatio,
      itemsPerFacet: facetCounts as any,
      itemsPerDomain: domainCounts as any,
    },
  };
}

/**
 * ENFJ + 8번 시뮬레이션
 * 
 * 기대 결과:
 * - MBTI: ENFJ
 * - Enneagram: 8번 (도전자)
 * - Big5: E 높음, N 높음, A 중간~높음, C 중간, O 높음
 * - Inner9: 리더십 높음, 사회관계 높음, 탐구심 높음
 */
export function simulateENFJ8(): EngineResultV3 {
  console.log("\n=== ENFJ + 8번 시뮬레이션 시작 ===\n");
  
  // ENFJ + 8번 프로필에 맞는 응답 생성
  const responses: Record<number, Likert5> = {};
  
  for (const item of items60V3) {
    let score: Likert5 = 3; // 기본값 (중립)
    
    // E (외향성) - 높음
    if (item.facet === "sociability") {
      score = item.reverse ? 1 : 5;
    } else if (item.facet === "vitality") {
      score = item.reverse ? 2 : 5;
    } else if (item.facet === "assertiveness") {
      score = item.reverse ? 1 : 5; // ✅ 8번 특성
    }
    
    // N (직관) - 높음
    else if (item.facet === "curiosity") {
      score = item.reverse ? 1 : 5;
    } else if (item.facet === "innovation") {
      score = item.reverse ? 1 : 5;
    } else if (item.facet === "aesthetic") {
      score = item.reverse ? 2 : 4;
    }
    
    // F (감정) - 매우 높음 (ENFJ 핵심)
    else if (item.facet === "empathy") {
      score = item.reverse ? 1 : 5; // ✅ ENFJ 특성
    } else if (item.facet === "cooperation") {
      score = item.reverse ? 1 : 5; // 강화
    } else if (item.facet === "modesty") {
      score = item.reverse ? 5 : 1; // ✅ 8번 특성 (매우 낮음)
    }
    
    // J (판단) - 높음 (ENFJ 핵심)
    else if (item.facet === "order") {
      score = item.reverse ? 1 : 5; // 강화
    } else if (item.facet === "self_control") {
      score = item.reverse ? 1 : 5; // 강화
    } else if (item.facet === "grit") {
      score = item.reverse ? 1 : 5; // ✅ 8번 특성
    }
    
    // N (신경성) - 낮음 (안정적)
    else if (item.facet === "anxiety") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "impulsivity") {
      score = item.reverse ? 3 : 3;
    } else if (item.facet === "stress_vulnerability") {
      score = item.reverse ? 4 : 2;
    }
    
    responses[item.id] = score;
  }
  
  // 엔진 실행
  const result = runIMCoreV3(responses);
  
  // 결과 출력
  console.log("📊 Big5 결과:");
  console.log(`  - O (개방성): ${result.big5.O}`);
  console.log(`  - C (성실성): ${result.big5.C}`);
  console.log(`  - E (외향성): ${result.big5.E}`);
  console.log(`  - A (우호성): ${result.big5.A}`);
  console.log(`  - N (신경성): ${result.big5.N}`);
  
  console.log("\n🧠 MBTI 결과:");
  console.log(`  - 유형: ${result.mbti.type}`);
  console.log(`  - 확률: E=${Math.round(result.mbti.probabilities.E * 100)}%, N=${Math.round(result.mbti.probabilities.N * 100)}%, F=${Math.round(result.mbti.probabilities.F * 100)}%, J=${Math.round(result.mbti.probabilities.J * 100)}%`);
  console.log(`  - 확신도: ${Math.round(result.mbti.confidence * 100)}%`);
  console.log(`  - 경계: ${JSON.stringify(result.mbti.boundary)}`);
  if (result.mbti.alternativeType) {
    console.log(`  - 양자 표기: ${result.mbti.alternativeType}`);
  }
  
  console.log("\n🔢 Enneagram 결과:");
  console.log(`  - 주 유형: ${result.enneagram.primary}번`);
  console.log(`  - Top-3 후보:`);
  for (const candidate of result.enneagram.candidates) {
    console.log(`    ${candidate.type}번: ${Math.round(candidate.probability * 100)}% (${candidate.confidence})`);
  }
  
  console.log("\n🌟 Inner9 결과:");
  const inner9Entries = Object.entries(result.inner9)
    .filter(([key]) => key !== "ci")
    .sort(([, a], [, b]) => (b as number) - (a as number));
  
  for (const [key, value] of inner9Entries) {
    console.log(`  - ${key}: ${value}`);
  }
  
  console.log("\n⚠️ 경고:");
  for (const warning of result.metadata.warnings) {
    console.log(`  - ${warning}`);
  }
  
  console.log("\n✅ 검증:");
  const checks = {
    "MBTI = ENFJ": result.mbti.type === "ENFJ",
    "Enneagram = 8번": result.enneagram.primary === 8,
    "E (외향성) ≥ 70": result.big5.E >= 70,
    "N (직관) ≥ 60": result.big5.O >= 60,
    "리더십 높음": result.inner9.리더십 >= 60,
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? "✅" : "❌"} ${check}`);
  }
  
  const allPassed = Object.values(checks).every(v => v);
  console.log(`\n${allPassed ? "🎉 모든 검증 통과!" : "⚠️ 일부 검증 실패"}`);
  
  console.log("\n=== 시뮬레이션 종료 ===\n");
  
  return result;
}

/**
 * INTJ + 5번 시뮬레이션
 * 
 * 기대 결과:
 * - MBTI: INTJ
 * - Enneagram: 5번 (관찰자)
 * - Big5: I 높음, N 높음, T 높음, J 높음, N(신경성) 낮음
 */
export function simulateINTJ5(): EngineResultV3 {
  console.log("\n=== INTJ + 5번 시뮬레이션 시작 ===\n");
  
  const responses: Record<number, Likert5> = {};
  
  for (const item of items60V3) {
    let score: Likert5 = 3;
    
    // I (내향성) - 높음
    if (item.facet === "sociability") {
      score = item.reverse ? 5 : 1;
    } else if (item.facet === "vitality") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "assertiveness") {
      score = item.reverse ? 3 : 3;
    }
    
    // N (직관) - 높음
    else if (item.facet === "curiosity") {
      score = item.reverse ? 1 : 5; // ✅ 5번 특성
    } else if (item.facet === "innovation") {
      score = item.reverse ? 1 : 5; // ✅ 5번 특성
    } else if (item.facet === "aesthetic") {
      score = item.reverse ? 2 : 4;
    }
    
    // T (사고) - 매우 높음 (INTJ 핵심)
    else if (item.facet === "empathy") {
      score = item.reverse ? 5 : 1; // 강화
    } else if (item.facet === "cooperation") {
      score = item.reverse ? 4 : 2; // 강화
    } else if (item.facet === "modesty") {
      score = item.reverse ? 4 : 2; // 강화
    }
    
    // J (판단) - 매우 높음 (INTJ 핵심)
    else if (item.facet === "order") {
      score = item.reverse ? 1 : 5; // 강화
    } else if (item.facet === "self_control") {
      score = item.reverse ? 1 : 5;
    } else if (item.facet === "grit") {
      score = item.reverse ? 1 : 5; // 강화
    }
    
    // N (신경성) - 낮음
    else if (item.facet === "anxiety") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "impulsivity") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "stress_vulnerability") {
      score = item.reverse ? 4 : 2;
    }
    
    responses[item.id] = score;
  }
  
  const result = runIMCoreV3(responses);
  
  console.log("📊 Big5 결과:");
  console.log(`  - O (개방성): ${result.big5.O}`);
  console.log(`  - C (성실성): ${result.big5.C}`);
  console.log(`  - E (외향성): ${result.big5.E}`);
  console.log(`  - A (우호성): ${result.big5.A}`);
  console.log(`  - N (신경성): ${result.big5.N}`);
  
  console.log("\n🧠 MBTI 결과:");
  console.log(`  - 유형: ${result.mbti.type}`);
  console.log(`  - 확률: I=${Math.round(result.mbti.probabilities.I * 100)}%, N=${Math.round(result.mbti.probabilities.N * 100)}%, T=${Math.round(result.mbti.probabilities.T * 100)}%, J=${Math.round(result.mbti.probabilities.J * 100)}%`);
  
  console.log("\n🔢 Enneagram 결과:");
  console.log(`  - 주 유형: ${result.enneagram.primary}번`);
  console.log(`  - Top-3 후보:`);
  for (const candidate of result.enneagram.candidates) {
    console.log(`    ${candidate.type}번: ${Math.round(candidate.probability * 100)}% (${candidate.confidence})`);
  }
  
  const checks = {
    "MBTI = INTJ": result.mbti.type === "INTJ",
    "Enneagram = 5번": result.enneagram.primary === 5,
    "I (내향성) ≥ 60": result.big5.E <= 40,
    "N (직관) ≥ 60": result.big5.O >= 60,
  };
  
  console.log("\n✅ 검증:");
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? "✅" : "❌"} ${check}`);
  }
  
  console.log("\n=== 시뮬레이션 종료 ===\n");
  
  return result;
}

/**
 * INFP + 4번 시뮬레이션
 */
export function simulateINFP4(): EngineResultV3 {
  console.log("\n=== INFP + 4번 시뮬레이션 시작 ===\n");
  
  const responses: Record<number, Likert5> = {};
  
  for (const item of items60V3) {
    let score: Likert5 = 3;
    
    // I (내향성)
    if (item.facet === "sociability") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "vitality") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "assertiveness") {
      score = item.reverse ? 4 : 2;
    }
    
    // N (직관)
    else if (item.facet === "curiosity") {
      score = item.reverse ? 2 : 4;
    } else if (item.facet === "innovation") {
      score = item.reverse ? 2 : 4;
    } else if (item.facet === "aesthetic") {
      score = item.reverse ? 1 : 5; // ✅ 4번 특성
    }
    
    // F (감정) - 매우 높음 (INFP 핵심)
    else if (item.facet === "empathy") {
      score = item.reverse ? 1 : 5; // ✅ 4번 특성
    } else if (item.facet === "cooperation") {
      score = item.reverse ? 1 : 5; // 강화
    } else if (item.facet === "modesty") {
      score = item.reverse ? 1 : 5; // 강화
    }
    
    // P (인식) - 매우 높음 (INFP 핵심)
    else if (item.facet === "order") {
      score = item.reverse ? 5 : 1; // 강화
    } else if (item.facet === "self_control") {
      score = item.reverse ? 5 : 1; // 강화
    } else if (item.facet === "grit") {
      score = item.reverse ? 4 : 2; // 약화
    }
    
    // N (신경성) - 높음 (4번 특성)
    else if (item.facet === "anxiety") {
      score = item.reverse ? 2 : 4; // ✅ 4번 특성
    } else if (item.facet === "impulsivity") {
      score = item.reverse ? 2 : 4;
    } else if (item.facet === "stress_vulnerability") {
      score = item.reverse ? 2 : 4;
    }
    
    responses[item.id] = score;
  }
  
  const result = runIMCoreV3(responses);
  
  console.log("📊 Big5 결과:");
  console.log(`  - O (개방성): ${result.big5.O}`);
  console.log(`  - C (성실성): ${result.big5.C}`);
  console.log(`  - E (외향성): ${result.big5.E}`);
  console.log(`  - A (우호성): ${result.big5.A}`);
  console.log(`  - N (신경성): ${result.big5.N}`);
  
  console.log("\n🧠 MBTI 결과:");
  console.log(`  - 유형: ${result.mbti.type}`);
  console.log(`  - 확률: I=${Math.round(result.mbti.probabilities.I * 100)}%, N=${Math.round(result.mbti.probabilities.N * 100)}%, F=${Math.round(result.mbti.probabilities.F * 100)}%, P=${Math.round(result.mbti.probabilities.P * 100)}%`);
  
  console.log("\n🔢 Enneagram 결과:");
  console.log(`  - 주 유형: ${result.enneagram.primary}번`);
  console.log(`  - Top-3 후보:`);
  for (const candidate of result.enneagram.candidates) {
    console.log(`    ${candidate.type}번: ${Math.round(candidate.probability * 100)}% (${candidate.confidence})`);
  }
  
  const checks = {
    "MBTI = INFP": result.mbti.type === "INFP",
    "Enneagram = 4번": result.enneagram.primary === 4,
  };
  
  console.log("\n✅ 검증:");
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? "✅" : "❌"} ${check}`);
  }
  
  console.log("\n=== 시뮬레이션 종료 ===\n");
  
  return result;
}

/**
 * ESTJ + 1번 시뮬레이션
 */
export function simulateESTJ1(): EngineResultV3 {
  console.log("\n=== ESTJ + 1번 시뮬레이션 시작 ===\n");
  
  const responses: Record<number, Likert5> = {};
  
  for (const item of items60V3) {
    let score: Likert5 = 3;
    
    // E (외향성)
    if (item.facet === "sociability") {
      score = item.reverse ? 2 : 4;
    } else if (item.facet === "vitality") {
      score = item.reverse ? 2 : 4;
    } else if (item.facet === "assertiveness") {
      score = item.reverse ? 1 : 5;
    }
    
    // S (감각)
    else if (item.facet === "curiosity") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "innovation") {
      score = item.reverse ? 4 : 2; // ✅ 1번 특성
    } else if (item.facet === "aesthetic") {
      score = item.reverse ? 4 : 2;
    }
    
    // T (사고) - 매우 높음 (ESTJ 핵심)
    else if (item.facet === "empathy") {
      score = item.reverse ? 5 : 1; // 강화
    } else if (item.facet === "cooperation") {
      score = item.reverse ? 4 : 2; // 강화
    } else if (item.facet === "modesty") {
      score = item.reverse ? 5 : 1; // ✅ 1번 특성 (매우 낮음)
    }
    
    // J (판단)
    else if (item.facet === "order") {
      score = item.reverse ? 1 : 5; // ✅ 1번 특성
    } else if (item.facet === "self_control") {
      score = item.reverse ? 1 : 5; // ✅ 1번 특성
    } else if (item.facet === "grit") {
      score = item.reverse ? 2 : 4;
    }
    
    // N (신경성) - 낮음
    else if (item.facet === "anxiety") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "impulsivity") {
      score = item.reverse ? 4 : 2;
    } else if (item.facet === "stress_vulnerability") {
      score = item.reverse ? 4 : 2;
    }
    
    responses[item.id] = score;
  }
  
  const result = runIMCoreV3(responses);
  
  console.log("📊 Big5 결과:");
  console.log(`  - O (개방성): ${result.big5.O}`);
  console.log(`  - C (성실성): ${result.big5.C}`);
  console.log(`  - E (외향성): ${result.big5.E}`);
  console.log(`  - A (우호성): ${result.big5.A}`);
  console.log(`  - N (신경성): ${result.big5.N}`);
  
  console.log("\n🧠 MBTI 결과:");
  console.log(`  - 유형: ${result.mbti.type}`);
  console.log(`  - 확률: E=${Math.round(result.mbti.probabilities.E * 100)}%, S=${Math.round(result.mbti.probabilities.S * 100)}%, T=${Math.round(result.mbti.probabilities.T * 100)}%, J=${Math.round(result.mbti.probabilities.J * 100)}%`);
  
  console.log("\n🔢 Enneagram 결과:");
  console.log(`  - 주 유형: ${result.enneagram.primary}번`);
  console.log(`  - Top-3 후보:`);
  for (const candidate of result.enneagram.candidates) {
    console.log(`    ${candidate.type}번: ${Math.round(candidate.probability * 100)}% (${candidate.confidence})`);
  }
  
  const checks = {
    "MBTI = ESTJ": result.mbti.type === "ESTJ",
    "Enneagram = 1번": result.enneagram.primary === 1,
  };
  
  console.log("\n✅ 검증:");
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? "✅" : "❌"} ${check}`);
  }
  
  console.log("\n=== 시뮬레이션 종료 ===\n");
  
  return result;
}

/**
 * 전체 검증 실행
 */
export function runAllValidations(): Array<{ scenario: string; result: any; mbti_match: boolean; ennea_match: boolean }> {
  console.log("\n=== IM-Core v3.0 전체 검증 시작 ===\n");
  
  // 1. 문항 구조 검증
  console.log("1️⃣ 문항 구조 검증...");
  const validation = validateItems60();
  
  if (validation.valid) {
    console.log("✅ 문항 구조 검증 통과");
  } else {
    console.log("❌ 문항 구조 검증 실패:");
    for (const error of validation.errors) {
      console.log(`  - ${error}`);
    }
  }
  
  if (validation.warnings.length > 0) {
    console.log("⚠️ 경고:");
    for (const warning of validation.warnings) {
      console.log(`  - ${warning}`);
    }
  }
  
  console.log("\n📊 통계:");
  console.log(`  - 총 문항: ${validation.stats.totalItems}`);
  console.log(`  - 역문항: ${validation.stats.reverseItems} (${Math.round(validation.stats.reverseRatio * 100)}%)`);
  
  // 2. 다중 시나리오 테스트
  console.log("\n2️⃣ 다중 시나리오 테스트 (4개)...\n");
  
  const results = [];
  
  const scenarios = [
    { fn: simulateENFJ8, expected: { mbti: "ENFJ", ennea: 8 } },
    { fn: simulateINTJ5, expected: { mbti: "INTJ", ennea: 5 } },
    { fn: simulateINFP4, expected: { mbti: "INFP", ennea: 4 } },
    { fn: simulateESTJ1, expected: { mbti: "ESTJ", ennea: 1 } },
  ];
  
  for (const { fn, expected } of scenarios) {
    const result = fn();
    const mbti_match = result.mbti.type === expected.mbti;
    const ennea_match = result.enneagram.primary === expected.ennea;
    results.push({
      scenario: `${expected.mbti}+${expected.ennea}`,
      result,
      mbti_match,
      ennea_match,
    });
  }
  
  console.log("\n=== 전체 검증 종료 ===\n");
  
  return results;
}

// CLI 실행 지원 (ES 모듈)
// 직접 실행 시: npx tsx src/core/im-core-v3/validator.ts
const isMainModule = process.argv[1]?.includes('validator');
if (isMainModule) {
  runAllValidations();
}

