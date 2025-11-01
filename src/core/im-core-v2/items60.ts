import questionsData from "@/data/questions.unified.json";
import type { Axis, Big5Key, EnneagramKey, ItemMeta } from "./types";

type UnifiedQuestion = {
  id: string;
  text: string;
  reverse?: boolean;
  weight?: number;
  domain?: string;
};

const axisMap: Record<string, Axis> = { E: "EI", I: "EI", S: "SN", N: "SN", T: "TF", F: "TF", J: "JP", P: "JP" };
const axisSignMap: Record<string, 1 | -1> = { E: 1, I: -1, N: 1, S: -1, T: 1, F: -1, J: 1, P: -1 };
const big5Map: Record<string, Big5Key> = { openness: "O", conscientiousness: "C", extraversion: "E", agreeableness: "A", neuroticism: "N" };

const sections = (questionsData as any)?.sections ?? [];
const flattened: UnifiedQuestion[] = sections.flatMap((s: any) => s?.questions ?? []);

export const items60: ItemMeta[] = flattened.map((q, idx) => {
  const meta: ItemMeta = {
    id: idx + 1,
    question: q.text,
    rev: Boolean(q.reverse),
    weight: typeof q.weight === "number" ? q.weight : 1,
  };

  const domain = q.domain as string | undefined;
  if (domain) {
    if (domain.startsWith("big5.")) {
      const key = domain.split(".")[1];
      const mapped = big5Map[key];
      if (mapped) meta.big5 = { [mapped]: meta.weight ?? 1 };
    } else if (domain.startsWith("mbti.")) {
      const letter = domain.split(".")[1]?.toUpperCase();
      if (letter) {
        const axis = axisMap[letter];
        if (axis) {
          meta.axis = axis;
          meta.axisSign = axisSignMap[letter] ?? 1;
        }
      }
    } else if (domain.startsWith("reti.")) {
      const num = Number(domain.split(".")[1]);
      if (Number.isFinite(num) && num >= 1 && num <= 9) {
        meta.ennea = { [num as EnneagramKey]: meta.weight ?? 1 };
      }
    }
  }

  return meta;
});

export const TOTAL_ITEMS = items60.length;



