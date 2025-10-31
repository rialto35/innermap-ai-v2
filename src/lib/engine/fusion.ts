/**
 * Fusion utilities (Late-fusion for MBTI)
 * - Combines Big5 continuous axes with self/pred MBTI using weighted vote
 * - Safe defaults; weights can be tuned via env/flags
 */

type Big5 = { O: number; C: number; E: number; A: number; N: number };

export type FuseInput = {
  big5: Big5;
  mbtiSelf?: string | null;  // existing/self-reported
  mbtiPred?: string | null;  // engine predicted
  boundary?: boolean;        // boundary on continuous axes
};

export type FuseOutput = { type: string; confidence: number; votes: Array<{ t: string; w: number }> };

export function fuseMbti(input: FuseInput): FuseOutput {
  const axes = big5ToAxes(input.big5);
  const base = axesToType(axes);
  const boundary = !!input.boundary;

  // default weights; boundary tilts towards self
  const wAxis = 0.2;
  const wSelf = boundary ? 0.5 : 0.3;
  const wPred = boundary ? 0.3 : 0.5;

  const votes: Array<{ t: string; w: number }> = [];
  votes.push({ t: base, w: wAxis });
  if (input.mbtiPred) votes.push({ t: sanitizeType(input.mbtiPred), w: wPred });
  if (input.mbtiSelf) votes.push({ t: sanitizeType(input.mbtiSelf), w: wSelf });

  const tally: Record<string, number> = {};
  for (const v of votes) {
    if (!isValidType(v.t)) continue;
    tally[v.t] = (tally[v.t] ?? 0) + v.w;
  }
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const [type, score] = entries[0] ?? [base, wAxis];
  const total = entries.reduce((s, [, w]) => s + w, 0) || 1;
  const confidence = Math.round((score / total) * 100);
  return { type, confidence, votes };
}

function big5ToAxes(b5: Big5) {
  const EI = clamp(b5.E);
  const SN = clamp(100 - b5.O);
  const TF = clamp(100 - b5.A);
  const JP = clamp(b5.C);
  return { EI, SN, TF, JP };
}

function axesToType(a: { EI: number; SN: number; TF: number; JP: number }): string {
  const E = a.EI >= 50 ? 'E' : 'I';
  const S = a.SN >= 50 ? 'S' : 'N';
  const T = a.TF >= 50 ? 'T' : 'F';
  const J = a.JP >= 50 ? 'J' : 'P';
  return `${E}${S}${T}${J}`;
}

function clamp(v?: number) { return Math.max(0, Math.min(100, typeof v === 'number' ? v : 0)); }

function sanitizeType(t: string): string { return t?.toUpperCase()?.replace(/[^EISNTFJP]/g, '')?.slice(0, 4) || 'XXXX'; }

function isValidType(t: string): boolean { return /^[EI][SN][TF][JP]$/.test(t); }


