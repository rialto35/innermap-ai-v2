/**
 * Unit tests for Inner9 score computation
 */

import { computeInner9Scores, validateInner9Scores, getDefaultInner9Scores } from './inner9';

describe('Inner9 Score Computation', () => {
  describe('computeInner9Scores', () => {
    it('should compute valid scores for normal Big5 values', () => {
      const big5 = { O: 82, C: 61, E: 45, A: 77, N: 38 };
      const mbti = { EI: 50, SN: 50, TF: 50, JP: 50 };
      
      const result = computeInner9Scores(big5, mbti);
      
      // All scores should be between 0 and 100
      Object.values(result).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(Number.isFinite(score)).toBe(true);
      });
      
      // Specific validations
      expect(result.creation).toBe(82); // Direct mapping from O
      expect(result.will).toBe(61); // Direct mapping from C
      expect(result.sensitivity).toBe(38); // Direct mapping from N
      expect(result.harmony).toBe(77); // Direct mapping from A
      expect(result.expression).toBe(45); // Direct mapping from E
      expect(result.resilience).toBe(62); // 100 - N = 100 - 38 = 62
    });

    it('should handle edge cases (all zeros)', () => {
      const big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      const mbti = { EI: 0, SN: 0, TF: 0, JP: 0 };
      
      const result = computeInner9Scores(big5, mbti);
      
      expect(result.creation).toBe(0);
      expect(result.will).toBe(0);
      expect(result.sensitivity).toBe(0);
      expect(result.harmony).toBe(0);
      expect(result.expression).toBe(0);
      expect(result.resilience).toBe(100); // 100 - 0 = 100
    });

    it('should handle edge cases (all 100s)', () => {
      const big5 = { O: 100, C: 100, E: 100, A: 100, N: 100 };
      const mbti = { EI: 100, SN: 100, TF: 100, JP: 100 };
      
      const result = computeInner9Scores(big5, mbti);
      
      expect(result.creation).toBe(100);
      expect(result.will).toBe(100);
      expect(result.sensitivity).toBe(100);
      expect(result.harmony).toBe(100);
      expect(result.expression).toBe(100);
      expect(result.resilience).toBe(0); // 100 - 100 = 0
    });

    it('should handle NaN and invalid values', () => {
      const big5 = { O: NaN, C: Infinity, E: -Infinity, A: null as any, N: undefined as any };
      const mbti = { EI: 50, SN: 50, TF: 50, JP: 50 };
      
      const result = computeInner9Scores(big5, mbti);
      
      // All scores should be valid numbers between 0 and 100
      Object.values(result).forEach(score => {
        expect(Number.isFinite(score)).toBe(true);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('should maintain monotonic relationships', () => {
      const big5Low = { O: 20, C: 20, E: 20, A: 20, N: 80 };
      const big5High = { O: 80, C: 80, E: 80, A: 80, N: 20 };
      const mbti = { EI: 50, SN: 50, TF: 50, JP: 50 };
      
      const resultLow = computeInner9Scores(big5Low, mbti);
      const resultHigh = computeInner9Scores(big5High, mbti);
      
      // Higher Big5 scores should generally lead to higher Inner9 scores
      expect(resultHigh.creation).toBeGreaterThan(resultLow.creation);
      expect(resultHigh.will).toBeGreaterThan(resultLow.will);
      expect(resultHigh.harmony).toBeGreaterThan(resultLow.harmony);
      expect(resultHigh.expression).toBeGreaterThan(resultLow.expression);
      
      // Higher N should lead to higher sensitivity but lower resilience
      expect(resultLow.sensitivity).toBeGreaterThan(resultHigh.sensitivity);
      expect(resultHigh.resilience).toBeGreaterThan(resultLow.resilience);
    });
  });

  describe('validateInner9Scores', () => {
    it('should validate correct scores', () => {
      const validScores = {
        creation: 80, will: 70, sensitivity: 60, harmony: 90,
        expression: 50, insight: 75, resilience: 40, balance: 65, growth: 55
      };
      
      expect(validateInner9Scores(validScores)).toBe(true);
    });

    it('should reject invalid scores', () => {
      const invalidScores = {
        creation: 150, will: -10, sensitivity: NaN, harmony: 90,
        expression: 50, insight: 75, resilience: 40, balance: 65, growth: 55
      };
      
      expect(validateInner9Scores(invalidScores)).toBe(false);
    });
  });

  describe('getDefaultInner9Scores', () => {
    it('should return neutral scores', () => {
      const defaultScores = getDefaultInner9Scores();
      
      Object.values(defaultScores).forEach(score => {
        expect(score).toBe(50);
      });
    });
  });
});
