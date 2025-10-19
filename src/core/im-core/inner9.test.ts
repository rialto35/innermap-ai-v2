/**
 * Inner9 Score Computation Tests
 * Tests for range validation, type weighting, and edge cases
 */

import { describe, it, expect } from 'vitest';
import { computeInner9Base, computeInner9Scores } from './inner9';

describe('Inner9 Score Computation', () => {
  const testBig5 = { O: 60, C: 70, E: 50, A: 80, N: 40 };

  describe('computeInner9Base', () => {
    it('should compute valid scores for normal Big5 values', () => {
      const result = computeInner9Base(testBig5);
      
      // All scores should be between 0 and 100
      Object.values(result).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(Number.isFinite(score)).toBe(true);
      });
      
      // Specific validations
      expect(result.creation).toBe(60); // Direct mapping from O
      expect(result.will).toBe(70); // Direct mapping from C
      expect(result.sensitivity).toBe(40); // Direct mapping from N
      expect(result.harmony).toBe(80); // Direct mapping from A
      expect(result.expression).toBe(50); // Direct mapping from E
      expect(result.resilience).toBe(60); // 100 - N = 100 - 40 = 60
    });

    it('should handle edge cases (all zeros)', () => {
      const big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      const result = computeInner9Base(big5);
      
      expect(result.creation).toBe(0);
      expect(result.will).toBe(0);
      expect(result.sensitivity).toBe(0);
      expect(result.harmony).toBe(0);
      expect(result.expression).toBe(0);
      expect(result.resilience).toBe(100); // 100 - 0 = 100
    });

    it('should handle edge cases (all 100s)', () => {
      const big5 = { O: 100, C: 100, E: 100, A: 100, N: 100 };
      const result = computeInner9Base(big5);
      
      expect(result.creation).toBe(100);
      expect(result.will).toBe(100);
      expect(result.sensitivity).toBe(100);
      expect(result.harmony).toBe(100);
      expect(result.expression).toBe(100);
      expect(result.resilience).toBe(0); // 100 - 100 = 0
    });

    it('should handle NaN and invalid values', () => {
      const big5 = { O: NaN, C: Infinity, E: -Infinity, A: null as any, N: undefined as any };
      const result = computeInner9Base(big5);
      
      // All scores should be valid numbers between 0 and 100
      Object.values(result).forEach(score => {
        expect(Number.isFinite(score)).toBe(true);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('computeInner9Scores with type weighting', () => {
    it('should apply MBTI weighting correctly', () => {
      const base = computeInner9Base(testBig5);
      const intp = computeInner9Scores(testBig5, 'INTP', 5, true);
      const esfj = computeInner9Scores(testBig5, 'ESFJ', 2, true);
      
      // INTP should have higher insight (N + T + logic type)
      expect(intp.insight).toBeGreaterThan(base.insight);
      
      // ESFJ should have higher growth (S + F + express type)
      expect(esfj.growth).toBeGreaterThan(base.growth);
    });

    it('should apply RETI weighting correctly', () => {
      const base = computeInner9Scores(testBig5, 'INTJ', 1, false); // No MBTI weighting
      const logic = computeInner9Scores(testBig5, 'INTJ', 5, true); // Logic type (1,5,9)
      const express = computeInner9Scores(testBig5, 'INTJ', 2, true); // Express type (2,3,7)
      
      // Logic type should boost insight
      expect(logic.insight).toBeGreaterThan(base.insight);
      
      // Express type should boost growth
      expect(express.growth).toBeGreaterThan(base.growth);
    });

    it('should maintain score ranges with weighting', () => {
      const result = computeInner9Scores(testBig5, 'ENFP', 7, true);
      
      Object.values(result).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(Number.isFinite(score)).toBe(true);
      });
    });

    it('should work without type weighting when disabled', () => {
      const base = computeInner9Base(testBig5);
      const weighted = computeInner9Scores(testBig5, 'INTP', 5, false);
      
      // Should be identical to base when weighting disabled
      expect(weighted.creation).toBe(base.creation);
      expect(weighted.will).toBe(base.will);
      expect(weighted.insight).toBe(base.insight);
      expect(weighted.growth).toBe(base.growth);
    });
  });

  describe('type-specific patterns', () => {
    it('should show expected patterns for INTP-5 (analytical)', () => {
      const result = computeInner9Scores(testBig5, 'INTP', 5, true);
      
      // INTP-5 should have high insight due to N + T + logic type
      expect(result.insight).toBeGreaterThan(70);
    });

    it('should show expected patterns for ESFJ-2 (expressive)', () => {
      const result = computeInner9Scores(testBig5, 'ESFJ', 2, true);
      
      // ESFJ-2 should have high growth due to S + F + express type
      expect(result.growth).toBeGreaterThan(70);
    });

    it('should show expected patterns for ENTJ-8 (willful)', () => {
      const result = computeInner9Scores(testBig5, 'ENTJ', 8, true);
      
      // ENTJ-8 should have balanced insight and growth due to will type
      expect(result.insight).toBeGreaterThan(result.creation);
      expect(result.growth).toBeGreaterThan(result.will);
    });
  });
});
