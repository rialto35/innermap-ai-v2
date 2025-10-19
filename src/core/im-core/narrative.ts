/**
 * Narrative Generation - Rich Personalized Storytelling
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';
import { generateInner9Narrative } from '../../lib/analysis/inner9Narrative';

export function buildNarrative(inner9: InnerNine) {
  // Use the new narrative generator
  const narrative = generateInner9Narrative(inner9);
  
  return { 
    summary: narrative.summary,
    strengths: narrative.strengths,
    growthAreas: narrative.growthAreas
  };
}