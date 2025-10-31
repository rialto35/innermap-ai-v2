import { describe, it, expect } from 'vitest';
import { fuseMbti } from '@/lib/engine/fusion';

describe('fusion.fuseMbti', () => {
  it('returns a valid MBTI type with confidence', () => {
    const out = fuseMbti({
      big5: { O: 60, C: 55, E: 70, A: 45, N: 40 },
      mbtiPred: 'ENFP',
      mbtiSelf: 'ENFJ',
      boundary: false,
    });
    expect(out.type).toMatch(/^[EI][SN][TF][JP]$/);
    expect(out.confidence).toBeGreaterThanOrEqual(0);
    expect(out.confidence).toBeLessThanOrEqual(100);
  });
});


