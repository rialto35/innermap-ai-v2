/**
 * 계약(Contract) 테스트
 * 입력/출력 형식과 불변식 검증
 */

import { describe, it, expect } from 'vitest';
import { runAll } from '@/lib/engine/orchestrator';

describe('계약 테스트', () => {
  it('입력 길이 55 미만이면 예외 발생', () => {
    const shortResponses = Array(54).fill(4);
    expect(() => runAll(shortResponses)).toThrow('Invalid responses length: 54. Expected 55.');
  });

  it('입력 길이 55 초과면 예외 발생', () => {
    const longResponses = Array(56).fill(4);
    expect(() => runAll(longResponses)).toThrow('응답은 정확히 55개여야 합니다');
  });

  it('잘못된 응답 값이면 예외 발생', () => {
    const invalidResponses = Array(55).fill(4);
    invalidResponses[0] = 0; // 1~7 범위 밖
    expect(() => runAll(invalidResponses)).toThrow('문항 1의 응답이 유효하지 않습니다: 0');
  });

  it('모든 출력이 0~100 범위', () => {
    const responses = Array(55).fill(4);
    const result = runAll(responses);

    // Big5 점수 범위 검증
    Object.values(result.big5).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });

    // Inner9 점수 범위 검증
    result.inner9.forEach(axis => {
      expect(axis.value).toBeGreaterThanOrEqual(0);
      expect(axis.value).toBeLessThanOrEqual(100);
    });
  });

  it('MBTI 형식 검증', () => {
    const responses = Array(55).fill(4);
    const result = runAll(responses);

    // MBTI는 4글자여야 함
    expect(result.mbti).toHaveLength(4);
    expect(result.mbti).toMatch(/^[EI][SN][TF][PJ]$/);
  });

  it('RETI 범위 검증', () => {
    const responses = Array(55).fill(4);
    const result = runAll(responses);

    // RETI는 1~9 범위
    expect(result.reti).toBeGreaterThanOrEqual(1);
    expect(result.reti).toBeLessThanOrEqual(9);
    expect(Number.isInteger(result.reti)).toBe(true);
  });

  it('단조 증가 검증 - 외향성 문항 증가 시 외향성 점수 증가', () => {
    const baseResponses = Array(55).fill(4);
    const increasedResponses = [...baseResponses];
    
    // 외향성 문항들 (3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53)을 1씩 증가
    [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53].forEach(idx => {
      increasedResponses[idx - 1] = Math.min(7, increasedResponses[idx - 1] + 1);
    });

    const baseResult = runAll(baseResponses);
    const increasedResult = runAll(increasedResponses);

    // 외향성 점수가 증가했는지 확인
    expect(increasedResult.big5.e).toBeGreaterThanOrEqual(baseResult.big5.e);
  });

  it('대칭성 검증 - 개방성 문항 증가 시 개방성 점수 증가', () => {
    const baseResponses = Array(55).fill(4);
    const increasedResponses = [...baseResponses];
    
    // 개방성 문항들 (1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51)을 1씩 증가
    [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51].forEach(idx => {
      increasedResponses[idx - 1] = Math.min(7, increasedResponses[idx - 1] + 1);
    });

    const baseResult = runAll(baseResponses);
    const increasedResult = runAll(increasedResponses);

    // 개방성 점수가 증가했는지 확인
    expect(increasedResult.big5.o).toBeGreaterThanOrEqual(baseResult.big5.o);
  });

  it('결과 구조 검증', () => {
    const responses = Array(55).fill(4);
    const result = runAll(responses);

    // 필수 필드 존재 확인
    expect(result.big5).toBeDefined();
    expect(result.mbti).toBeDefined();
    expect(result.reti).toBeDefined();
    expect(result.inner9).toBeDefined();
    expect(result.timestamp).toBeDefined();

    // Big5 필드 확인
    expect(result.big5).toHaveProperty('o');
    expect(result.big5).toHaveProperty('c');
    expect(result.big5).toHaveProperty('e');
    expect(result.big5).toHaveProperty('a');
    expect(result.big5).toHaveProperty('n');

    // Inner9 구조 확인
    expect(result.inner9).toHaveLength(9);
    result.inner9.forEach(axis => {
      expect(axis).toHaveProperty('label');
      expect(axis).toHaveProperty('value');
      expect(typeof axis.label).toBe('string');
      expect(typeof axis.value).toBe('number');
    });

    // 타임스탬프 형식 확인
    expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
  });
});
