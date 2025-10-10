/**
 * InnerMap AI - 생년월일 기반 12부족 매핑 시스템
 * 사주 12지지 → 12부족 자동 매칭
 */

import innermapTribes from '@/data/innermapTribes.json';

// 12지지 배열 (순서 중요!)
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 12지지 → 부족 ID 매핑
const BRANCH_TO_TRIBE_ID: Record<string, string> = {
  '子': 'tenbra',   // 텐브라
  '丑': 'verma',    // 베르마
  '寅': 'silva',    // 실바
  '卯': 'sera',     // 세라
  '辰': 'eira',     // 에이라
  '巳': 'aurin',    // 아우린
  '午': 'nova',     // 노바
  '未': 'soran',    // 소란
  '申': 'dras',     // 드라스
  '酉': 'varno',    // 바르노
  '戌': 'lumin',    // 루민
  '亥': 'neva'      // 네바
};

export interface TribeResult {
  tribe: any;           // 부족 전체 데이터
  branch: string;       // 지지 (예: '子')
  branchKor: string;    // 지지 한글 (예: '자')
  branchIndex: number;  // 0-11
  gapjaIndex: number;   // 0-59 (60갑자)
}

/**
 * 생년월일에서 부족 추출
 * @param dateString "YYYY-MM-DD" 형식
 * @returns TribeResult
 */
export function getTribeFromBirthDate(dateString: string): TribeResult {
  // 1. 날짜 파싱
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  // 2. 기준일 (1984-01-01 = 甲子일 = 60갑자 0번)
  const baseDate = new Date(1984, 0, 1);
  
  // 3. 경과 일수 계산
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 4. 60갑자 인덱스 (음수 처리)
  const gapjaIndex = ((diffDays % 60) + 60) % 60;
  
  // 5. 12지지 인덱스
  const branchIndex = gapjaIndex % 12;
  
  // 6. 지지 추출
  const branch = BRANCHES[branchIndex];
  
  // 7. 부족 ID 가져오기
  const tribeId = BRANCH_TO_TRIBE_ID[branch];
  
  // 8. 부족 데이터 찾기
  const tribe = innermapTribes.find(t => t.id === tribeId);
  
  if (!tribe) {
    throw new Error(`부족을 찾을 수 없습니다: ${tribeId}`);
  }
  
  return {
    tribe,
    branch,
    branchKor: tribe.branchKor,
    branchIndex,
    gapjaIndex
  };
}

/**
 * 간단 버전: 부족 ID만 반환
 */
export function getTribeId(dateString: string): string {
  return getTribeFromBirthDate(dateString).tribe.id;
}

/**
 * 부족 이름만 반환
 */
export function getTribeName(dateString: string): string {
  return getTribeFromBirthDate(dateString).tribe.nameKor;
}

/**
 * 부족 색상만 반환
 */
export function getTribeColor(dateString: string): string {
  return getTribeFromBirthDate(dateString).tribe.symbol.color.hex;
}
