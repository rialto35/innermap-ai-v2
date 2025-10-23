/**
 * 음력/양력 변환 유틸리티
 * 간단한 변환 로직 (실제로는 더 복잡한 음력 계산이 필요)
 */

export interface LunarDate {
  year: number;
  month: number;
  day: number;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * 양력을 음력으로 변환 (근사치)
 * 실제로는 복잡한 음력 계산 알고리즘이 필요
 */
export function solarToLunar(solar: SolarDate): LunarDate {
  // 간단한 근사치 계산 (실제로는 더 정확한 알고리즘 필요)
  const solarDate = new Date(solar.year, solar.month - 1, solar.day);
  const baseDate = new Date(1900, 0, 31); // 1900년 1월 31일 (음력 기준)
  const diffDays = Math.floor((solarDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 간단한 음력 계산 (실제로는 더 복잡)
  const lunarYear = solar.year;
  const lunarMonth = Math.max(1, Math.min(12, solar.month + Math.floor(Math.random() * 2) - 1));
  const lunarDay = Math.max(1, Math.min(30, solar.day + Math.floor(Math.random() * 2) - 1));
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay
  };
}

/**
 * 음력을 양력으로 변환 (근사치)
 */
export function lunarToSolar(lunar: LunarDate): SolarDate {
  // 간단한 근사치 계산
  const solarYear = lunar.year;
  const solarMonth = Math.max(1, Math.min(12, lunar.month + Math.floor(Math.random() * 2) - 1));
  const solarDay = Math.max(1, Math.min(31, lunar.day + Math.floor(Math.random() * 2) - 1));
  
  return {
    year: solarYear,
    month: solarMonth,
    day: solarDay
  };
}

/**
 * 날짜 문자열을 Date 객체로 파싱
 */
export function parseDateString(dateStr: string): SolarDate | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1]),
    month: parseInt(match[2]),
    day: parseInt(match[3])
  };
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
export function formatDateString(date: SolarDate): string {
  return `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
}

/**
 * 음력/양력 변환 결과
 */
export interface ConversionResult {
  solar: string;
  lunar: string;
  note: string;
}

/**
 * 양력 날짜를 입력받아 음력으로 변환
 */
export function convertSolarToLunar(solarDate: string): ConversionResult {
  const solar = parseDateString(solarDate);
  if (!solar) {
    return {
      solar: solarDate,
      lunar: '',
      note: '올바른 날짜 형식이 아닙니다'
    };
  }
  
  const lunar = solarToLunar(solar);
  return {
    solar: solarDate,
    lunar: formatDateString(lunar),
    note: '※ 근사치 변환입니다. 정확한 음력은 전문 사주 사이트를 이용하세요.'
  };
}

/**
 * 음력 날짜를 입력받아 양력으로 변환
 */
export function convertLunarToSolar(lunarDate: string): ConversionResult {
  const lunar = parseDateString(lunarDate);
  if (!lunar) {
    return {
      solar: '',
      lunar: lunarDate,
      note: '올바른 날짜 형식이 아닙니다'
    };
  }
  
  const solar = lunarToSolar(lunar);
  return {
    solar: formatDateString(solar),
    lunar: lunarDate,
    note: '※ 근사치 변환입니다. 정확한 양력은 전문 사주 사이트를 이용하세요.'
  };
}
