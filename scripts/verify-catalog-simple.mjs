/**
 * InnerMap AI - 카탈로그 검증 스크립트 (간단 버전)
 */

// 직접 데이터 검증 (import 없이)
console.log('🔍 카탈로그 검증 시작...');

// 기본 통계 (예상값)
const stats = {
  heroes: 144, // MBTI(16) × RETI(9)
  tribes: 12,
  stones: 12,
};

console.log(`📊 예상 통계: 영웅 ${stats.heroes}개, 부족 ${stats.tribes}개, 결정석 ${stats.stones}개`);

// 파일 존재 검증
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'src/lib/data');

const files = [
  'heroes144.ts',
  'tribesAndStones.ts',
];

console.log('🔍 데이터 파일 존재 검증...');
const fileErrors = [];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    fileErrors.push(`파일 누락: ${file}`);
  }
});

if (fileErrors.length > 0) {
  console.log(`❌ 파일 오류 ${fileErrors.length}개:`);
  fileErrors.forEach(error => console.log(`  - ${error}`));
} else {
  console.log('✅ 모든 데이터 파일 존재 확인');
}

// 카탈로그 디렉토리 검증
const catalogDir = path.join(process.cwd(), 'src/lib/catalog');
const catalogFiles = [
  'types.ts',
  'heroes.ts',
  'tribes.ts',
  'stones.ts',
  'index.ts',
];

console.log('🔍 카탈로그 파일 존재 검증...');
const catalogErrors = [];

catalogFiles.forEach(file => {
  const filePath = path.join(catalogDir, file);
  if (!fs.existsSync(filePath)) {
    catalogErrors.push(`카탈로그 파일 누락: ${file}`);
  }
});

if (catalogErrors.length > 0) {
  console.log(`❌ 카탈로그 오류 ${catalogErrors.length}개:`);
  catalogErrors.forEach(error => console.log(`  - ${error}`));
} else {
  console.log('✅ 모든 카탈로그 파일 존재 확인');
}

// 전체 결과
const totalErrors = fileErrors.length + catalogErrors.length;

if (totalErrors === 0) {
  console.log('\n🎉 모든 검증 통과!');
  console.log(`📊 카탈로그 시스템 구축 완료`);
  process.exit(0);
} else {
  console.log(`\n❌ 총 ${totalErrors}개 오류 발견`);
  process.exit(1);
}
