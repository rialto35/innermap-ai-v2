import { describe, it, expect } from 'vitest';
import { computeMbtiConfidenceFromBig5 } from '@/lib/engine/mbti';

describe('MBTI 확신도 (연속 축 기반)', () => {
  it('중간값(50)에 가까울수록 확신도가 낮아진다', () => {
    const low = computeMbtiConfidenceFromBig5({ O: 50, C: 50, E: 50, A: 50, N: 50 });
    const high = computeMbtiConfidenceFromBig5({ O: 90, C: 90, E: 90, A: 10, N: 10 });
    expect(low.confidence).toBeLessThan(high.confidence);
    expect(low.boundary).toBe(true); // 50은 경계 영역
  });

  it('극단값에서 확신도가 높다', () => {
    const conf = computeMbtiConfidenceFromBig5({ O: 0, C: 100, E: 100, A: 0, N: 50 });
    expect(conf.confidence).toBeGreaterThanOrEqual(80);
  });
});


