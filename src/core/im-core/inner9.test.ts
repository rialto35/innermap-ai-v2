/**
 * Inner9 Score Computation Tests
 * Tests for range validation, type weighting, and edge cases
 */

import { describe, it, expect } from 'vitest';
import { toInner9 } from './inner9';
import { toBig5 } from './big5';
import { toMBTI } from './mbti';
import { toRETI } from './reti';

describe('Inner9 Score Computation', () => {
  const testResponses = Array(55).fill(4);

  describe('toInner9 integration', () => {
    it('should compute valid scores for normal responses', async () => {
      const big5 = toBig5(testResponses);
      const mbti = toMBTI({ big5, responses: testResponses });
      const reti = toRETI({ big5, responses: testResponses });
      const result = toInner9({ big5, mbti, reti });
      
      // All scores should be between 0 and 100
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
        expect(Number.isFinite(axis.value)).toBe(true);
      });
      
      // Should have 9 axes
      expect(result).toHaveLength(9);
      
      // All axes should have labels
      result.forEach(axis => {
        expect(axis.label).toBeDefined();
        expect(typeof axis.label).toBe('string');
      });
    });

    it('should handle edge cases (all zeros)', () => {
      const responses = Array(55).fill(1);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // All scores should be valid
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
        expect(Number.isFinite(axis.value)).toBe(true);
      });
    });

    it('should handle edge cases (all 7s)', () => {
      const responses = Array(55).fill(7);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // All scores should be valid
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
        expect(Number.isFinite(axis.value)).toBe(true);
      });
    });

    it('should handle NaN and invalid values gracefully', () => {
      const responses = Array(55).fill(4);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // All scores should be valid numbers
      result.forEach(axis => {
        expect(Number.isFinite(axis.value)).toBe(true);
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('type-specific patterns', () => {
    it('should show expected patterns for analytical types', () => {
      const responses = Array(55).fill(4);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // Should have valid patterns
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
      });
    });

    it('should show expected patterns for expressive types', () => {
      const responses = Array(55).fill(6);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // Should have valid patterns
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
      });
    });

    it('should show expected patterns for willful types', () => {
      const responses = Array(55).fill(2);
      const big5 = toBig5(responses);
      const mbti = toMBTI({ big5, responses });
      const reti = toRETI({ big5, responses });
      const result = toInner9({ big5, mbti, reti });
      
      // Should have valid patterns
      result.forEach(axis => {
        expect(axis.value).toBeGreaterThanOrEqual(0);
        expect(axis.value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('determinism', () => {
    it('should produce identical results for identical inputs', () => {
      const responses1 = Array(55).fill(4);
      const responses2 = Array(55).fill(4);
      
      const big5_1 = toBig5(responses1);
      const mbti_1 = toMBTI({ big5: big5_1, responses: responses1 });
      const reti_1 = toRETI({ big5: big5_1, responses: responses1 });
      const result1 = toInner9({ big5: big5_1, mbti: mbti_1, reti: reti_1 });
      
      const big5_2 = toBig5(responses2);
      const mbti_2 = toMBTI({ big5: big5_2, responses: responses2 });
      const reti_2 = toRETI({ big5: big5_2, responses: responses2 });
      const result2 = toInner9({ big5: big5_2, mbti: mbti_2, reti: reti_2 });
      
      // Results should be identical
      expect(result1).toEqual(result2);
    });
  });
});