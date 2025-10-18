/**
 * Hero Matching Logic (v1 stub)
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';

// v1 스텁: 상위 2~3 속성으로 히어로 임시 매핑
export function matchHero(inner9: InnerNine) {
  const entries = Object.entries(inner9).sort((a, b) => (b[1] as number) - (a[1] as number));
  const top = entries
    .slice(0, 3)
    .map((e) => e[0])
    .join('-');
  // 임시 코드: 이후 hero_catalog로 치환
  return { id: 0, code: `H-${top}`, title: '프로토타입 영웅' };
}

