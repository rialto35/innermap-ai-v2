import { clamp01, ensureLikert, mean, to01, to100 } from "./score";
import type { Big5Key, Big5Result, ItemMeta, Likert, MBTIAxis01 } from "./types";

type Accumulator = Record<Big5Key, { sum: number; weight: number }>;
const BIG5_KEYS: Big5Key[] = ["O", "C", "E", "A", "N"];

export function scoreBig5(
  responses: Record<number, Likert>,
  metas: ItemMeta[],
  mbtiAxis01: MBTIAxis01,
): Big5Result {
  const acc: Accumulator = { O: { sum: 0, weight: 0 }, C: { sum: 0, weight: 0 }, E: { sum: 0, weight: 0 }, A: { sum: 0, weight: 0 }, N: { sum: 0, weight: 0 } };

  for (const meta of metas) {
    if (!meta.big5) continue;
    const response = ensureLikert(responses[meta.id] ?? 4);
    const base = to01(response, meta.rev);
    const metaWeight = meta.weight ?? 1;
    for (const [key, wRaw] of Object.entries(meta.big5) as Array<[Big5Key, number]>) {
      const w = Math.abs(wRaw) * metaWeight; if (w <= 0) continue;
      const value = wRaw >= 0 ? base : 1 - base;
      acc[key].sum += value * w; acc[key].weight += w;
    }
  }

  const axis01Base: Record<Big5Key, number> = {
    O: acc.O.weight > 0 ? acc.O.sum / acc.O.weight : 0.5,
    C: acc.C.weight > 0 ? acc.C.sum / acc.C.weight : 0.5,
    E: acc.E.weight > 0 ? acc.E.sum / acc.E.weight : 0.5,
    A: acc.A.weight > 0 ? acc.A.sum / acc.A.weight : 0.5,
    N: acc.N.weight > 0 ? acc.N.sum / acc.N.weight : 0.5,
  };

  const adjusted01: Record<Big5Key, number> = {
    O: clamp01(axis01Base.O * 0.8 + (mbtiAxis01.SN >= 0.5 ? 0.65 : 0.35) * 0.2),
    C: clamp01(axis01Base.C * 0.8 + (mbtiAxis01.JP >= 0.5 ? 0.65 : 0.35) * 0.2),
    E: clamp01(axis01Base.E * 0.75 + (mbtiAxis01.EI >= 0.5 ? 0.7 : 0.3) * 0.25),
    A: clamp01(axis01Base.A * 0.8 + (mbtiAxis01.TF >= 0.5 ? 0.35 : 0.65) * 0.2),
    N: clamp01(axis01Base.N),
  };

  const scores = BIG5_KEYS.reduce<Record<Big5Key, number>>((accum, key) => { accum[key] = to100(adjusted01[key]); return accum; }, {} as Record<Big5Key, number>);
  const axisConfidence = BIG5_KEYS.reduce<Record<Big5Key, number>>((accum, key) => { accum[key] = clamp01(Math.abs(scores[key] - 50) / 50); return accum; }, {} as Record<Big5Key, number>);
  const overallConfidence = clamp01(mean(Object.values(axisConfidence)));

  return { scores, axis01: adjusted01, confidence: { overall: overallConfidence, axes: axisConfidence } };
}



