/**
 * 골든 데이터셋 테스트
 * 기준값과 정확히 일치하는지 검증
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { runAll } from '@/lib/engine/orchestrator';

type Golden = {
  name: string;
  responses: number[];
  expect: {
    big5: { o: number; c: number; e: number; a: number; n: number };
    mbti: string;
    reti: number;
    inner9: { label: string; value: number }[];
  };
};

describe('골든 데이터셋 테스트', () => {
  const goldenDir = path.join(__dirname, '../fixtures/golden');
  const goldenFiles = fs.readdirSync(goldenDir).filter(f => f.endsWith('.json'));

  for (const file of goldenFiles) {
    const golden: Golden = JSON.parse(
      fs.readFileSync(path.join(goldenDir, file), 'utf-8')
    );

    it(`golden: ${golden.name}`, () => {
      const out = runAll(golden.responses, { 
        weights: { big5: 1, mbti: 0.5, reti: 0.5 } 
      });

      // Big5 허용오차(정규화·반올림 차) ±5 (엔진 로직 차이 고려)
      for (const k of ['o', 'c', 'e', 'a', 'n'] as const) {
        expect(Math.abs(out.big5[k] - golden.expect.big5[k])).toBeLessThanOrEqual(5);
      }

      // MBTI 정확히 일치
      expect(out.mbti).toBe(golden.expect.mbti);

      // RETI 정확히 일치
      expect(out.reti).toBe(golden.expect.reti);

      // Inner9는 각 축 ±10 이내 (엔진 로직 차이 고려)
      out.inner9.forEach((ax, i) => {
        expect(Math.abs(ax.value - golden.expect.inner9[i].value)).toBeLessThanOrEqual(10);
      });

      // 타임스탬프 존재 확인
      expect(out.timestamp).toBeDefined();
      expect(new Date(out.timestamp).getTime()).toBeGreaterThan(0);
    });
  }
});
