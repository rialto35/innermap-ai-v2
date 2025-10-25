// Hero asset mapping utility
// - Builds a stable path from MBTI/RETI
// - Falls back to default icon when unknown

export type Gender = "male" | "female";

export const HERO_DEFAULT_SRC = "/heroes/default.svg";

function normalizeMbti(type: string | undefined): string {
  return (type || "").trim().toUpperCase();
}

function clampReti(value: number | undefined): number {
  const v = Number(value || 1);
  if (!Number.isFinite(v)) return 1;
  return Math.max(1, Math.min(9, Math.trunc(v)));
}

/**
 * Build hero image src from MBTI/RETI following existing asset naming:
 * /heroes/<gender>/<MBTI>_TYPE<RETI>.png
 */
export function getHeroSrc(params: { gender?: Gender; mbti?: string; reti?: number }): string {
  const gender: Gender = (params.gender as Gender) || "male";
  const mbti = normalizeMbti(params.mbti);
  const reti = clampReti(params.reti);
  if (!mbti) return HERO_DEFAULT_SRC;
  return `/heroes/${gender}/${mbti}_TYPE${reti}.png`;
}


