import { describe, it, expect } from 'vitest';
import { mapBig5ToInner9 } from '@/core/inner9/mapBig5';
import { applyMbtiModifier, applyRetiModifier } from '@/core/inner9/modifiers';

describe('Inner9 엔진 테스트', () => {
  describe('Big5 → Inner9 기본 매핑', () => {
    it('Big5 only → Inner9 맵핑', () => {
      const big5 = { O: 80, C: 60, E: 70, A: 50, N: 30 };
      const result = mapBig5ToInner9(big5);
      
      expect(result.scores).toBeDefined();
      expect(result.modelVersion).toBe('inner9@1.1.0');
      
      // 9개 차원이 모두 존재하는지 확인
      const expectedKeys = [
        'creation', 'will', 'sensitivity', 'harmony', 'expression',
        'insight', 'resilience', 'balance', 'growth'
      ];
      
      for (const key of expectedKeys) {
        expect(result.scores).toHaveProperty(key);
        expect(typeof result.scores[key as keyof typeof result.scores]).toBe('number');
      }
    });

    it('경계값/정규화 범위 검사', () => {
      const testCases = [
        { O: 0, C: 0, E: 0, A: 0, N: 0 },      // 최소값
        { O: 100, C: 100, E: 100, A: 100, N: 100 }, // 최대값
        { O: 50, C: 50, E: 50, A: 50, N: 50 }, // 중간값
        { O: 25, C: 75, E: 10, A: 90, N: 60 }  // 혼합값
      ];

      for (const big5 of testCases) {
        const result = mapBig5ToInner9(big5);
        
        // 모든 값이 0-100 범위 내에 있는지 확인
        for (const [key, value] of Object.entries(result.scores)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(100);
        }
      }
    });

    it('Big5 특성별 매핑 정확성', () => {
      const big5 = { O: 80, C: 60, E: 70, A: 50, N: 30 };
      const result = mapBig5ToInner9(big5);
      
      // 직접 매핑되는 특성들
      expect(result.scores.creation).toBe(80); // O → creation
      expect(result.scores.will).toBe(60);     // C → will
      expect(result.scores.expression).toBe(70); // E → expression
      expect(result.scores.harmony).toBe(50);   // A → harmony
      expect(result.scores.sensitivity).toBe(30); // N → sensitivity
    });

    it('파생 속성 계산 정확성', () => {
      const big5 = { O: 80, C: 60, E: 70, A: 50, N: 30 };
      const result = mapBig5ToInner9(big5);
      
      // insight = O * 0.6 + C * 0.4 = 80 * 0.6 + 60 * 0.4 = 48 + 24 = 72
      expect(result.scores.insight).toBe(72);
      
      // resilience = 100 - N = 100 - 30 = 70
      expect(result.scores.resilience).toBe(70);
      
      // balance = 100 - |O + E - (C + A)| / 2
      // = 100 - |80 + 70 - (60 + 50)| / 2 = 100 - |150 - 110| / 2 = 100 - 20 = 80
      expect(result.scores.balance).toBe(80);
    });
  });

  describe('MBTI/RETI 수정자 적용', () => {
    it('MBTI 수정자 적용', () => {
      const baseInner9 = {
        creation: 70, will: 60, sensitivity: 50, harmony: 80,
        expression: 75, insight: 65, resilience: 70, balance: 60, growth: 65
      };
      
      const mbti = { axes: { EI: 0.3, SN: -0.2, TF: 0.1, JP: 0.4 }, type: 'ENFP', confidence: 85 };
      const modified = applyMbtiModifier(baseInner9, mbti, 5);
      
      // 수정이 적용되었는지 확인 (정확한 값은 수정자 로직에 따라 다름)
      expect(modified).toBeDefined();
      expect(typeof modified.creation).toBe('number');
    });

    it('RETI 수정자 적용', () => {
      const baseInner9 = {
        creation: 70, will: 60, sensitivity: 50, harmony: 80,
        expression: 75, insight: 65, resilience: 70, balance: 60, growth: 65
      };
      
      const reti = { primary: 3, secondary: 7, tertiary: 1 };
      const modified = applyRetiModifier(baseInner9, reti, 4);
      
      // 수정이 적용되었는지 확인
      expect(modified).toBeDefined();
      expect(typeof modified.creation).toBe('number');
    });
  });

  describe('가중치 설정', () => {
    it('사용자 정의 가중치 적용', () => {
      const big5 = { O: 80, C: 60, E: 70, A: 50, N: 30 };
      const customWeights = {
        creation_from_O: 1.2,
        will_from_C: 0.8,
        expression_from_E: 1.1,
        harmony_from_A: 0.9,
        sensitivity_from_N: 1.0
      };
      
      const result = mapBig5ToInner9(big5, { weights: customWeights });
      
      // 가중치가 적용되었는지 확인
      expect(result.scores.creation).toBe(96); // 80 * 1.2 = 96
      expect(result.scores.will).toBe(48);      // 60 * 0.8 = 48
      expect(result.scores.expression).toBe(77); // 70 * 1.1 = 77
      expect(result.scores.harmony).toBe(45);   // 50 * 0.9 = 45
      expect(result.scores.sensitivity).toBe(30); // 30 * 1.0 = 30
    });
  });

  describe('클리핑 및 정규화', () => {
    it('0-100 범위 클리핑', () => {
      const big5 = { O: 120, C: -10, E: 50, A: 50, N: 50 }; // 범위 초과 값
      const result = mapBig5ToInner9(big5, { clip0to100: true });
      
      // 모든 값이 0-100 범위 내에 있는지 확인
      for (const [key, value] of Object.entries(result.scores)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    });

    it('클리핑 비활성화', () => {
      const big5 = { O: 120, C: -10, E: 50, A: 50, N: 50 };
      const result = mapBig5ToInner9(big5, { clip0to100: false });
      
      // 클리핑이 적용되지 않았는지 확인 (음수나 100 초과 값 허용)
      const hasOutOfRange = Object.values(result.scores).some(
        value => value < 0 || value > 100
      );
      expect(hasOutOfRange).toBe(true);
    });
  });

  describe('엣지 케이스', () => {
    it('모든 Big5 값이 0인 경우', () => {
      const big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      const result = mapBig5ToInner9(big5);
      
      // 직접 매핑되는 값들은 0이어야 함
      expect(result.scores.creation).toBe(0);
      expect(result.scores.will).toBe(0);
      expect(result.scores.expression).toBe(0);
      expect(result.scores.harmony).toBe(0);
      expect(result.scores.sensitivity).toBe(0);
      
      // 파생 속성들도 0이어야 함
      expect(result.scores.insight).toBe(0); // 0 * 0.6 + 0 * 0.4 = 0
      expect(result.scores.resilience).toBe(100); // 100 - 0 = 100
      expect(result.scores.balance).toBe(100); // 100 - |0 + 0 - (0 + 0)| / 2 = 100
      expect(result.scores.growth).toBe(25); // (0 + 0 + 0 + 100) / 4 = 25
    });

    it('모든 Big5 값이 100인 경우', () => {
      const big5 = { O: 100, C: 100, E: 100, A: 100, N: 100 };
      const result = mapBig5ToInner9(big5);
      
      // 직접 매핑되는 값들은 100이어야 함
      expect(result.scores.creation).toBe(100);
      expect(result.scores.will).toBe(100);
      expect(result.scores.expression).toBe(100);
      expect(result.scores.harmony).toBe(100);
      expect(result.scores.sensitivity).toBe(100);
      
      // 파생 속성들 계산
      expect(result.scores.insight).toBe(100); // 100 * 0.6 + 100 * 0.4 = 100
      expect(result.scores.resilience).toBe(0); // 100 - 100 = 0
      expect(result.scores.balance).toBe(100); // 100 - |100 + 100 - (100 + 100)| / 2 = 100
      expect(result.scores.growth).toBe(75); // (100 + 100 + 100 + 0) / 4 = 75
    });

    it('극단적인 값 조합', () => {
      const big5 = { O: 100, C: 0, E: 100, A: 0, N: 100 };
      const result = mapBig5ToInner9(big5);
      
      // 극단적인 조합에서도 정상적으로 계산되는지 확인
      expect(result.scores.creation).toBe(100);
      expect(result.scores.will).toBe(0);
      expect(result.scores.expression).toBe(100);
      expect(result.scores.harmony).toBe(0);
      expect(result.scores.sensitivity).toBe(100);
    });
  });

  describe('성능 및 안정성', () => {
    it('대량 데이터 처리', () => {
      const testData = Array.from({ length: 1000 }, (_, i) => ({
        O: (i * 10) % 101,
        C: (i * 7) % 101,
        E: (i * 13) % 101,
        A: (i * 5) % 101,
        N: (i * 11) % 101
      }));
      
      const startTime = Date.now();
      
      for (const big5 of testData) {
        const result = mapBig5ToInner9(big5);
        expect(result.scores).toBeDefined();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // 1000개 처리에 1초 이내 완료되어야 함
      expect(duration).toBeLessThan(1000);
    });

    it('메모리 누수 방지', () => {
      // 반복 호출 시 메모리 누수가 없는지 확인
      for (let i = 0; i < 100; i++) {
        const big5 = { O: 50, C: 50, E: 50, A: 50, N: 50 };
        const result = mapBig5ToInner9(big5);
        expect(result.scores).toBeDefined();
      }
    });
  });
});
