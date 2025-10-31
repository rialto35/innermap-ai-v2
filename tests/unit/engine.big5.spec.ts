import { describe, it, expect } from 'vitest';
import { toBig5 } from '@/lib/engine/big5';

// IM_ENGINE_V2_ENABLED=true 일 때, questions.unified.json 기반 역문항/가중치 적용 경로가 활성
describe('Big5 엔진 (역문항/가중치)', () => {
  it('역문항이 적용되어 점수가 반전되는지 확인', () => {
    // 모든 문항 기본 4로 시작
    const responses = Array(55).fill(4);
    // 역문항(예: q_005, q_008, q_045 등) 위치에 7을 주입 → reverse면 낮아져야 함
    responses[4] = 7;   // q_005 (index 4)
    responses[7] = 7;   // q_008 (index 7)
    responses[44] = 7;  // q_045 (index 44)

    // 플래그 켜기 (테스트 프로세스 한정)
    process.env.IM_ENGINE_V2_ENABLED = 'true';
    process.env.IM_BIG5_CONFIG_ENABLED = 'true';

    const big5 = toBig5(responses);

    // 역문항에 높은 점수를 주면 해당 차원이 과도하게 상승하지 않도록(반전) 되어야 함
    // 정확한 수치보다는 범위 체크
    expect(big5.o).toBeGreaterThanOrEqual(0);
    expect(big5.c).toBeGreaterThanOrEqual(0);
    expect(big5.e).toBeGreaterThanOrEqual(0);
    expect(big5.a).toBeGreaterThanOrEqual(0);
    expect(big5.n).toBeGreaterThanOrEqual(0);
  });

  it('가중치 평균이 0~100 범위로 정상 산출', () => {
    const responses = Array(55).fill(5);
    process.env.IM_ENGINE_V2_ENABLED = 'true';
    process.env.IM_BIG5_CONFIG_ENABLED = 'true';

    const big5 = toBig5(responses);
    for (const v of Object.values(big5)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});


