import crypto from 'node:crypto';

/**
 * Deterministic cohort rollout helper
 * - Hash (userId or email) → 0..100 bucket
 * - Enable if bucket < percent
 */
export function inCohort(identifier: string, percent: number): boolean {
  const p = Math.max(0, Math.min(100, percent));
  if (!identifier) return false;
  const hash = crypto.createHash('sha256').update(identifier).digest('hex');
  // take first 8 hex → int → map to 0..100
  const n = parseInt(hash.slice(0, 8), 16);
  const bucket = (n % 10000) / 100; // 0..100
  return bucket < p;
}


