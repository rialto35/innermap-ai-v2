/**
 * Browser-safe deterministic cohort helper (no Node crypto)
 * - djb2 hash → 0..100 bucket
 */
export function inCohortBrowser(identifier: string | undefined | null, percent: number): boolean {
  if (!identifier) return false;
  const p = Math.max(0, Math.min(100, percent));
  let hash = 5381;
  for (let i = 0; i < identifier.length; i++) {
    hash = ((hash << 5) + hash) + identifier.charCodeAt(i); // hash * 33 + c
    hash |= 0; // 32-bit
  }
  const bucket = Math.abs(hash % 10000) / 100; // 0..100
  return bucket < p;
}


