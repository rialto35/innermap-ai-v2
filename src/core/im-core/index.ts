/**
 * @innermap/im-core - Analysis Pipeline Engine
 * Orchestrates Inner9 → Hero → Color → Narrative flow
 */

import { AnalyzeInput, AnalyzeOutput } from './types';
import { mapBig5ToInner9 } from '../inner9';
import { matchHero } from './hero-match';
import { mapColors } from './color-map';
import { buildNarrative } from './narrative';

const ENGINE_VERSION = 'im-core@1.0.0';

export async function runAnalysis(input: AnalyzeInput): Promise<AnalyzeOutput> {
  const { scores: inner9, modelVersion } = mapBig5ToInner9(input.big5, { clip0to100: true });
  const hero = matchHero(inner9);
  const color = mapColors(inner9);
  const narrative = buildNarrative(inner9);

  return {
    inner9,
    hero,
    color,
    narrative,
    engineVersion: ENGINE_VERSION,
    modelVersion,
  };
}

export * from './types';

