/**
 * @innermap/im-core - Analysis Pipeline Engine
 * Orchestrates Inner9 → Hero → Color → Narrative flow
 */

import { AnalyzeInput, AnalyzeOutput } from './types';
import { mapBig5ToInner9 } from '../inner9';
import { applyMbtiModifier, applyRetiModifier } from '../inner9/modifiers';
import { matchHero } from './hero-match';
import { mapColors } from './color-map';
import { buildNarrative } from './narrative';
import { big5ToPercentiles } from './scoreBig5';
import { getCombinedNorms, getNormsMetadata } from './normsLoader';
import { resolveAllTies } from './tieBreaker';

const ENGINE_VERSION = 'im-core@2.1.0';

export async function runAnalysis(input: AnalyzeInput): Promise<AnalyzeOutput> {
  // Step 1: Map Big5 to Inner9 (base)
  const { scores: baseInner9, modelVersion } = mapBig5ToInner9(input.big5, { clip0to100: true });
  
  // Step 1.1: Apply modifiers (bounded, lightweight)
  // weights: wB=0.7, wM=0.2, wR=0.1 (implicit via bounded deltas)
  let modInner9 = applyMbtiModifier(baseInner9, input.mbti, 5);
  modInner9 = applyRetiModifier(modInner9, input.reti, 4);
  
  // Step 2: Resolve ties in Inner9 scores
  const inner9 = resolveAllTies(modInner9, { threshold: 5 });
  
  // Step 3: Calculate Big5 percentiles using norms
  const norms = getCombinedNorms(input.age, input.gender);
  const big5Percentiles = big5ToPercentiles(input.big5, norms);
  
  // Step 4: Match hero
  const hero = matchHero(inner9);
  
  // Step 5: Map colors
  const color = mapColors(inner9);
  
  // Step 6: Build narrative
  const narrative = buildNarrative(inner9);
  
  // Step 7: Get norms metadata
  const normsMetadata = getNormsMetadata();

  return {
    inner9,
    hero,
    color,
    narrative,
    big5Percentiles,
    engineVersion: ENGINE_VERSION,
    modelVersion,
    normsVersion: normsMetadata.version,
  };
}

export * from './types';

