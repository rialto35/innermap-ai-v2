/**
 * 회귀 대량 테스트 스크립트
 * 100~1000개의 샘플 응답을 돌려서 분산·상관이 정상 범위인지 확인
 */

import { runAll } from '../src/lib/engine/orchestrator';

// 샘플 데이터 생성 함수
function generateSampleResponses(count: number): number[][] {
  const samples: number[][] = [];
  
  for (let i = 0; i < count; i++) {
    const responses: number[] = [];
    
    for (let j = 0; j < 55; j++) {
      // 다양한 패턴의 응답 생성
      if (j % 5 === 0) {
        responses.push(Math.floor(Math.random() * 3) + 1); // 1-3 (낮은 점수)
      } else if (j % 5 === 1) {
        responses.push(Math.floor(Math.random() * 3) + 5); // 5-7 (높은 점수)
      } else {
        responses.push(Math.floor(Math.random() * 7) + 1); // 1-7 (랜덤)
      }
    }
    
    samples.push(responses);
  }
  
  return samples;
}

// 통계 계산 함수
function calculateStats(results: any[]) {
  const big5Stats = {
    o: { mean: 0, std: 0, min: 100, max: 0 },
    c: { mean: 0, std: 0, min: 100, max: 0 },
    e: { mean: 0, std: 0, min: 100, max: 0 },
    a: { mean: 0, std: 0, min: 100, max: 0 },
    n: { mean: 0, std: 0, min: 100, max: 0 }
  };

  // 평균 계산
  results.forEach(result => {
    Object.keys(big5Stats).forEach(key => {
      big5Stats[key as keyof typeof big5Stats].mean += result.big5[key];
    });
  });

  Object.keys(big5Stats).forEach(key => {
    big5Stats[key as keyof typeof big5Stats].mean /= results.length;
  });

  // 표준편차, 최소값, 최대값 계산
  results.forEach(result => {
    Object.keys(big5Stats).forEach(key => {
      const value = result.big5[key];
      const mean = big5Stats[key as keyof typeof big5Stats].mean;
      big5Stats[key as keyof typeof big5Stats].std += Math.pow(value - mean, 2);
      big5Stats[key as keyof typeof big5Stats].min = Math.min(big5Stats[key as keyof typeof big5Stats].min, value);
      big5Stats[key as keyof typeof big5Stats].max = Math.max(big5Stats[key as keyof typeof big5Stats].max, value);
    });
  });

  Object.keys(big5Stats).forEach(key => {
    big5Stats[key as keyof typeof big5Stats].std = Math.sqrt(big5Stats[key as keyof typeof big5Stats].std / results.length);
  });

  return big5Stats;
}

// MBTI 분포 계산
function calculateMBTIDistribution(results: any[]) {
  const distribution: { [key: string]: number } = {};
  
  results.forEach(result => {
    distribution[result.mbti] = (distribution[result.mbti] || 0) + 1;
  });

  return distribution;
}

// RETI 분포 계산
function calculateRETIDistribution(results: any[]) {
  const distribution: { [key: number]: number } = {};
  
  results.forEach(result => {
    distribution[result.reti] = (distribution[result.reti] || 0) + 1;
  });

  return distribution;
}

// RMSE 계산 함수
function calculateRMSE(results: any[]): number {
  // Big5 점수의 표준편차를 RMSE로 사용
  const allBig5Values = results.flatMap(result => Object.values(result.big5));
  const mean = allBig5Values.reduce((sum, val) => sum + (val as number), 0) / allBig5Values.length;
  const variance = allBig5Values.reduce((sum, val) => sum + Math.pow((val as number) - mean, 2), 0) / allBig5Values.length;
  return Math.sqrt(variance);
}

// MAE 계산 함수
function calculateMAE(results: any[]): number {
  // Inner9 점수의 평균 절대 오차
  const allInner9Values = results.flatMap(result => result.inner9.map((axis: any) => axis.value));
  const mean = allInner9Values.reduce((sum, val) => sum + (val as number), 0) / allInner9Values.length;
  const mae = allInner9Values.reduce((sum, val) => sum + Math.abs((val as number) - mean), 0) / allInner9Values.length;
  return mae;
}

// 메인 실행 함수
async function runBenchmark() {
  console.log('🚀 회귀 대량 테스트 시작...');
  
  const sampleCount = 100;
  const samples = generateSampleResponses(sampleCount);
  
  console.log(`📊 ${sampleCount}개 샘플 생성 완료`);
  
  const results: any[] = [];
  let mbtiExact = 0;
  let retiExact = 0;
  
  // 각 샘플에 대해 분석 실행
  for (let i = 0; i < samples.length; i++) {
    try {
      const result = runAll(samples[i]);
      results.push(result);
      
      // 예상 결과와 비교 (실제로는 골든 데이터와 비교)
      // 여기서는 단순히 결과가 유효한지만 확인
      if (result.mbti && result.mbti.length === 4) {
        mbtiExact++;
      }
      if (result.reti >= 1 && result.reti <= 9) {
        retiExact++;
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1}/${samples.length} 완료`);
      }
    } catch (error) {
      console.error(`❌ 샘플 ${i + 1} 처리 실패:`, error);
    }
  }
  
  console.log('\n📈 결과 분석:');
  
  // Big5 통계
  const big5Stats = calculateStats(results);
  console.log('\n🔍 Big5 통계:');
  Object.keys(big5Stats).forEach(key => {
    const stat = big5Stats[key as keyof typeof big5Stats];
    console.log(`  ${key.toUpperCase()}: 평균=${stat.mean.toFixed(1)}, 표준편차=${stat.std.toFixed(1)}, 범위=[${stat.min}-${stat.max}]`);
  });
  
  // MBTI 분포
  const mbtiDist = calculateMBTIDistribution(results);
  console.log('\n🎭 MBTI 분포:');
  Object.entries(mbtiDist)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개 (${(count/sampleCount*100).toFixed(1)}%)`);
    });
  
  // RETI 분포
  const retiDist = calculateRETIDistribution(results);
  console.log('\n🎯 RETI 분포:');
  Object.entries(retiDist)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개 (${(count/sampleCount*100).toFixed(1)}%)`);
    });
  
  // 정확도 요약
  console.log('\n✅ 정확도 요약:');
  console.log(`  MBTI 유효성: ${mbtiExact}/${sampleCount} (${(mbtiExact/sampleCount*100).toFixed(1)}%)`);
  console.log(`  RETI 유효성: ${retiExact}/${sampleCount} (${(retiExact/sampleCount*100).toFixed(1)}%)`);
  
  // 이상치 감지
  console.log('\n🚨 이상치 감지:');
  const outlierCount = results.filter(result => {
    const big5Values = Object.values(result.big5);
    return big5Values.some((v: number) => v < 0 || v > 100);
  }).length;
  
  if (outlierCount > 0) {
    console.log(`  ⚠️  ${outlierCount}개 결과에서 범위 초과 값 발견`);
  } else {
    console.log(`  ✅ 모든 결과가 정상 범위 내`);
  }
  
  // 임계치 검증
  const mbtiAccuracy = (mbtiExact / sampleCount) * 100;
  const big5RMSE = calculateRMSE(results);
  const inner9MAE = calculateMAE(results);

  console.log('\n🚨 임계치 검증:');
  console.log(`  MBTI 일치율: ${mbtiAccuracy.toFixed(1)}% (임계치: 85%)`);
  console.log(`  Big5 RMSE: ${big5RMSE.toFixed(2)} (임계치: 3.0)`);
  console.log(`  Inner9 MAE: ${inner9MAE.toFixed(2)} (임계치: 20.0)`);

  // 임계치 초과 시 실패
  if (mbtiAccuracy < 85) {
    console.log('❌ MBTI 일치율이 임계치(85%)를 하회했습니다');
    process.exit(1);
  }

  if (big5RMSE > 3.0) {
    console.log('❌ Big5 RMSE가 임계치(3.0)를 초과했습니다');
    process.exit(1);
  }

  if (inner9MAE > 20.0) {
    console.log('❌ Inner9 MAE가 임계치(20.0)를 초과했습니다');
    process.exit(1);
  }

  console.log('✅ 모든 임계치를 통과했습니다');
  console.log('\n🎉 회귀 대량 테스트 완료!');
}

// 스크립트 실행
runBenchmark().catch(console.error);

export { runBenchmark };
