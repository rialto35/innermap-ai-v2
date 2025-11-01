import { clamp01, ensureLikert, mean, to01, to100 } from "./score";
import type { Axis, ItemMeta, Likert, MBTIAxis01, MBTIResult } from "./types";

type AxisAccumulator = Record<Axis, { sum: number; weight: number }>;

const axisLetters: Record<Axis, [string, string]> = {
  EI: ["E", "I"],
  SN: ["N", "S"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

export function scoreMBTI(responses: Record<number, Likert>, metas: ItemMeta[]): MBTIResult {
  const acc: AxisAccumulator = {
    EI: { sum: 0, weight: 0 },
    SN: { sum: 0, weight: 0 },
    TF: { sum: 0, weight: 0 },
    JP: { sum: 0, weight: 0 },
  };

  for (const meta of metas) {
    if (!meta.axis) continue;
    const value = responses[meta.id];
    const likert = ensureLikert(value ?? 4);
    const axisValue = to01(likert, meta.rev);
    const sign = meta.axisSign ?? 1;
    const adjusted = sign === -1 ? 1 - axisValue : axisValue;
    const weight = meta.weight ?? 1;
    acc[meta.axis].sum += adjusted * weight;
    acc[meta.axis].weight += weight;
  }

  const axis01: MBTIAxis01 = {
    EI: acc.EI.weight > 0 ? acc.EI.sum / acc.EI.weight : 0.5,
    SN: acc.SN.weight > 0 ? acc.SN.sum / acc.SN.weight : 0.5,
    TF: acc.TF.weight > 0 ? acc.TF.sum / acc.TF.weight : 0.5,
    JP: acc.JP.weight > 0 ? acc.JP.sum / acc.JP.weight : 0.5,
  };

  const axis100: MBTIAxis01 = {
    EI: to100(axis01.EI), SN: to100(axis01.SN), TF: to100(axis01.TF), JP: to100(axis01.JP)
  };

  const boundary = {
    EI: axis100.EI >= 45 && axis100.EI <= 55,
    SN: axis100.SN >= 45 && axis100.SN <= 55,
    TF: axis100.TF >= 45 && axis100.TF <= 55,
    JP: axis100.JP >= 45 && axis100.JP <= 55,
  } as Record<Axis, boolean>;

  const axisConfidence = {
    EI: clamp01(Math.abs(axis100.EI - 50) / 50),
    SN: clamp01(Math.abs(axis100.SN - 50) / 50),
    TF: clamp01(Math.abs(axis100.TF - 50) / 50),
    JP: clamp01(Math.abs(axis100.JP - 50) / 50),
  } as Record<Axis, number>;

  const overallConfidence = clamp01(mean(Object.values(axisConfidence)));
  const type =
    (axis01.EI >= 0.5 ? axisLetters.EI[0] : axisLetters.EI[1]) +
    (axis01.SN >= 0.5 ? axisLetters.SN[0] : axisLetters.SN[1]) +
    (axis01.TF >= 0.5 ? axisLetters.TF[0] : axisLetters.TF[1]) +
    (axis01.JP >= 0.5 ? axisLetters.JP[0] : axisLetters.JP[1]);

  return { type, axis01, axis100, confidence: { overall: overallConfidence, axes: axisConfidence, boundary } };
}



