import { describe, it, expect } from 'vitest';
import runIMCore60 from '@/core/im-core-v2';
import { items60 } from '@/core/im-core-v2/items60';
import type { Likert } from '@/core/im-core-v2/types';

describe('IM-Core v2.2 – reverse scoring & weighted average', () => {
  it('returns engine_version v2.2 and big5 present', () => {
    const mock: Record<number, Likert> = Object.fromEntries(
      items60.map((m, idx) => [idx + 1, 4 as Likert])
    );
    const result = runIMCore60(mock, items60);
    expect(result.engine_version).toBe('v2.2');
    expect(result.big5).toBeDefined();
    expect(result.mbti).toBeDefined();
    expect(result.inner9).toBeDefined();
  });
});



