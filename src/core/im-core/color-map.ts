/**
 * Color (Decision Stone) Mapping Logic (v1 stub)
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';

// v1 스텁: 창조/통찰 → 성장석, 감수/균형 → 선천석처럼 가정
export function mapColors(inner9: InnerNine) {
  const natal = inner9.sensitivity > inner9.balance ? 1 : 2; // 더미 ID
  const growth = inner9.creation + inner9.insight > 120 ? 9 : 7;
  return { natal, growth };
}

