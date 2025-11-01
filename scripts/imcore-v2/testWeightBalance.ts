import { items60 } from '@/core/im-core-v2/items60';

function summarizeWeights() {
  const big5 = { O: 0, C: 0, E: 0, A: 0, N: 0 } as Record<'O'|'C'|'E'|'A'|'N', number>;
  const ennea = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 } as Record<1|2|3|4|5|6|7|8|9, number>;
  for (const it of items60) {
    if (it.big5) for (const [k, v] of Object.entries(it.big5)) big5[k as keyof typeof big5] += Math.abs(v || 0);
    if (it.ennea) for (const [k, v] of Object.entries(it.ennea)) ennea[Number(k) as 1|2|3|4|5|6|7|8|9] += (v || 0);
  }
  // eslint-disable-next-line no-console
  console.log('Big5 Weight Total:', big5);
  // eslint-disable-next-line no-console
  console.log('Enneagram Weight Total:', ennea);
}

summarizeWeights();



