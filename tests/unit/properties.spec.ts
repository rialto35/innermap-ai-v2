/**
 * 경계·일관성 테스트
 * 속성 기반 테스트로 불변식 검증
 */

import { describe, it, expect } from 'vitest';
import { runAll } from '@/lib/engine/orchestrator';

describe('속성 기반 테스트', () => {
  it('모든 축은 0~100 범위', () => {
    const responses = Array(55).fill(4); // 중립
    const out = runAll(responses);

    // Big5 점수 범위 검증
    Object.values(out.big5).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });

    // Inner9 점수 범위 검증
    out.inner9.forEach(axis => {
      expect(axis.value).toBeGreaterThanOrEqual(0);
      expect(axis.value).toBeLessThanOrEqual(100);
    });
  });

  it('MBTI 형식 검증', () => {
    const responses = Array(55).fill(4);
    const out = runAll(responses);

    // MBTI는 4글자여야 함
    expect(out.mbti).toHaveLength(4);
    expect(out.mbti).toMatch(/^[EI][SN][TF][PJ]$/);
  });

  it('RETI 범위 검증', () => {
    const responses = Array(55).fill(4);
    const out = runAll(responses);

    // RETI는 1~9 범위
    expect(out.reti).toBeGreaterThanOrEqual(1);
    expect(out.reti).toBeLessThanOrEqual(9);
    expect(Number.isInteger(out.reti)).toBe(true);
  });

  it('Inner9 9축 검증', () => {
    const responses = Array(55).fill(4);
    const out = runAll(responses);

    // Inner9는 정확히 9개 축
    expect(out.inner9).toHaveLength(9);
    
    // 각 축에 label과 value가 있어야 함
    out.inner9.forEach(axis => {
      expect(axis.label).toBeDefined();
      expect(axis.value).toBeDefined();
      expect(typeof axis.value).toBe('number');
    });
  });

  it('단조 증가 테스트', () => {
    // 개방성 문항을 높게 설정했을 때 창조성이 증가하는지 확인
    const lowOpenness = Array(55).fill(4);
    const highOpenness = Array(55).fill(4);
    
    // 개방성 문항들 (1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51)을 높게 설정
    [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51].forEach(idx => {
      lowOpenness[idx - 1] = 1;
      highOpenness[idx - 1] = 7;
    });

    const lowResult = runAll(lowOpenness);
    const highResult = runAll(highOpenness);

    // 창조성 축이 증가해야 함
    const lowCreativity = lowResult.inner9.find(axis => axis.label === '창조성')?.value || 0;
    const highCreativity = highResult.inner9.find(axis => axis.label === '창조성')?.value || 0;
    
    expect(highCreativity).toBeGreaterThan(lowCreativity);
  });

  it('일관성 테스트 - 동일 입력은 동일 출력', () => {
    const responses = Array(55).fill(4);
    
    const result1 = runAll(responses);
    const result2 = runAll(responses);

    // Big5 점수 일치
    expect(result1.big5).toEqual(result2.big5);
    
    // MBTI 일치
    expect(result1.mbti).toBe(result2.mbti);
    
    // RETI 일치
    expect(result1.reti).toBe(result2.reti);
    
    // Inner9 일치
    expect(result1.inner9).toEqual(result2.inner9);
  });

  it('경계값 테스트', () => {
    // 최소값 (모든 문항 1)
    const minResponses = Array(55).fill(1);
    const minResult = runAll(minResponses);
    
    // 최대값 (모든 문항 7)
    const maxResponses = Array(55).fill(7);
    const maxResult = runAll(maxResponses);

    // 최소값 결과 검증
    Object.values(minResult.big5).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });

    // 최대값 결과 검증
    Object.values(maxResult.big5).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });

    // 최소값과 최대값이 다르다는 것을 확인
    expect(minResult.big5).not.toEqual(maxResult.big5);
  });
});
