import { clamp01, ensureLikert, to01 } from "./score";
import type { EnneagramDistribution, EnneagramKey, EnneagramResult, ItemMeta, Likert } from "./types";

const ENNEA: EnneagramKey[] = [1,2,3,4,5,6,7,8,9];

export function scoreEnneagram(responses: Record<number, Likert>, metas: ItemMeta[], mbtiType: string): EnneagramResult {
  const raw: Record<EnneagramKey, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for (const meta of metas) {
    if (!meta.ennea) continue;
    const value = ensureLikert(responses[meta.id] ?? 4);
    const base = to01(value, meta.rev);
    const w = meta.weight ?? 1;
    for (const [k, c] of Object.entries(meta.ennea)) {
      const key = Number(k) as EnneagramKey; if (!ENNEA.includes(key)) continue;
      raw[key] += base * (c || 0) * w;
    }
  }

  const prior = mbtiPrior(mbtiType);
  const arr = ENNEA.map(k => raw[k] + prior[k]);
  const max = Math.max(...arr);
  const exps = arr.map(v => Math.exp(v - max));
  const sum = exps.reduce((a,b)=>a+b,0) || 1;
  const probs = exps.map(v => v / sum);
  const dist: EnneagramDistribution = ENNEA.map((k,i)=>({ type:k, p: clamp01(probs[i])})).sort((a,b)=>b.p-a.p);
  const top = dist[0];
  return { type: top?.type ?? 9, probTop: top?.p ?? 0, dist };
}

function mbtiPrior(m: string): Record<EnneagramKey, number> {
  const base: Record<EnneagramKey, number> = {1:.11,2:.11,3:.11,4:.11,5:.11,6:.11,7:.11,8:.11,9:.11};
  if (!m) return base;
  const M = m.toUpperCase();
  if (M.includes('NT')) { base[5]+=0.04; base[1]+=0.02; }
  if (M.includes('NF')) { base[4]+=0.04; base[2]+=0.02; base[9]+=0.02; }
  if (M.includes('SJ')) { base[1]+=0.03; base[6]+=0.03; }
  if (M.includes('SP')) { base[7]+=0.03; base[9]+=0.02; }
  const total = ENNEA.reduce((s,k)=>s+base[k],0);
  ENNEA.forEach(k=>{ base[k] = base[k] / total; });
  return base;
}



