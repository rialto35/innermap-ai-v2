import { describe, it, expect } from 'vitest';
import { calibrateInner9 } from '@/core/inner9/calibration';

describe('inner9 calibration', () => {
  it('identity returns same scores', () => {
    const scores = { creation: 70, will: 60 } as any;
    const out = calibrateInner9(scores, { method: 'identity' });
    expect(out).toEqual(scores);
  });
});


