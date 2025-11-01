import { scoreBig5 } from "./big5";
import { scoreEnneagram } from "./ennea";
import { computeInner9 } from "./inner9";
import { items60 } from "./items60";
import { scoreMBTI } from "./mbti";
import { ensureLikert } from "./score";
import type { EngineResult, ItemMeta, Likert, MBTIResult } from "./types";

type ResponseInput = Record<number, Likert> | Likert[];

function normalize(responses: ResponseInput): Record<number, Likert> {
  if (Array.isArray(responses)) {
    return responses.reduce<Record<number, Likert>>((acc, v, i) => {
      acc[i + 1] = ensureLikert(v);
      return acc;
    }, {});
  }
  const out: Record<number, Likert> = {};
  for (const [k, v] of Object.entries(responses)) out[Number(k)] = ensureLikert(v as number);
  return out;
}

export function runIMCore60(responses: ResponseInput, metas: ItemMeta[] = items60): EngineResult {
  const r = normalize(responses);
  const mbti: MBTIResult = scoreMBTI(r, metas);
  const big5 = scoreBig5(r, metas, mbti.axis01);
  const enneagram = scoreEnneagram(r, metas, mbti.type);
  const inner9 = computeInner9(big5.scores);
  return {
    engine_version: 'v2.2',
    big5: big5.scores,
    mbti,
    enneagram,
    inner9,
    confidence: { big5: big5.confidence, mbti: mbti.confidence },
  };
}

export default runIMCore60;



