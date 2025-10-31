#!/usr/bin/env node
/**
 * 섀도런 델타 분석 스크립트
 * 수집된 로그에서 base vs v2 차이 분석 및 가중치 튜닝 제안
 */

import fs from 'fs/promises';
import path from 'path';

async function analyzeDeltas() {
  console.log('📊 섀도런 델타 분석 시작...\n');
  
  const logPath = path.join(process.cwd(), 'logs', 'shadow-runs.json');
  
  try {
    const data = await fs.readFile(logPath, 'utf-8');
    const runs = JSON.parse(data);
    
    console.log(`📁 로드: ${runs.length}개 샘플\n`);
    
    // 델타 통계
    const stats = {
      totalSamples: runs.length,
      avgDelta: {},
      maxDelta: {},
      minDelta: {},
      recommendations: []
    };
    
    // Inner9 차원별 델타 집계
    const dimensions = ['creation', 'will', 'sensitivity', 'harmony', 'expression', 
                       'insight', 'resilience', 'balance', 'growth'];
    
    dimensions.forEach(dim => {
      const deltas = runs
        .map(r => r.inner9?.[dim])
        .filter(v => typeof v === 'number');
      
      if (deltas.length > 0) {
        const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const max = Math.max(...deltas);
        const min = Math.min(...deltas);
        
        stats.avgDelta[dim] = Math.round(avg * 100) / 100;
        stats.maxDelta[dim] = max;
        stats.minDelta[dim] = min;
      }
    });
    
    // 가중치 튜닝 제안
    console.log('📈 차원별 평균값:\n');
    Object.entries(stats.avgDelta).forEach(([dim, avg]) => {
      console.log(`  ${dim.padEnd(12)}: ${avg.toFixed(2)}`);
      
      // 극단값 체크
      if (avg > 80) {
        stats.recommendations.push(`${dim}: 과도하게 높음 (${avg}) - Big5 가중치 감소 고려`);
      } else if (avg < 20) {
        stats.recommendations.push(`${dim}: 과도하게 낮음 (${avg}) - Big5 가중치 증가 고려`);
      }
    });
    
    console.log('\n🎯 가중치 튜닝 제안:\n');
    if (stats.recommendations.length === 0) {
      console.log('  ✅ 모든 차원이 적정 범위(20-80) 내에 있습니다.');
    } else {
      stats.recommendations.forEach(rec => console.log(`  ⚠️  ${rec}`));
    }
    
    // 현재 가중치 설정 (주석으로 표시)
    console.log('\n📋 현재 가중치 설정:');
    console.log('  wB (Big5): 0.7 (implicit via base mapping)');
    console.log('  wM (MBTI): 0.2 (alpha=5, bounded)');
    console.log('  wR (RETI): 0.1 (beta=4, bounded)');
    
    // 결과 저장
    const reportPath = path.join(process.cwd(), 'logs', 'shadow-analysis.json');
    await fs.writeFile(reportPath, JSON.stringify(stats, null, 2));
    
    console.log(`\n✅ 분석 완료`);
    console.log(`📁 저장 위치: ${reportPath}`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ 섀도런 로그 파일을 찾을 수 없습니다.');
      console.error('   먼저 collect-shadow-runs.mjs를 실행하세요.');
    } else {
      console.error('❌ 오류:', error.message);
    }
    process.exit(1);
  }
}

analyzeDeltas().catch(console.error);

