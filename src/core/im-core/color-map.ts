/**
 * Color (Decision Stone) Mapping Logic (v2 - catalog based)
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';
import colorCatalog from '@/data/color_catalog.json';

interface ColorStone {
  id: number;
  name: string;
  color: string;
  traits: string[];
  score?: number;
}

/**
 * Map Inner9 scores to natal and growth color stones
 * @param inner9 Inner9 scores
 * @returns Natal and growth color stones with details
 */
export function mapColors(inner9: InnerNine) {
  const { natal: natalStones, growth: growthStones } = colorCatalog as {
    natal: ColorStone[];
    growth: ColorStone[];
  };

  // Calculate score for each natal stone
  const natalScored = natalStones.map((stone) => {
    const score =
      stone.traits.reduce((sum, trait) => sum + (inner9[trait as keyof InnerNine] ?? 0), 0) /
      stone.traits.length;
    return { ...stone, score };
  });

  // Calculate score for each growth stone
  const growthScored = growthStones.map((stone) => {
    const score =
      stone.traits.reduce((sum, trait) => sum + (inner9[trait as keyof InnerNine] ?? 0), 0) /
      stone.traits.length;
    return { ...stone, score };
  });

  // Sort and get best matches
  natalScored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  growthScored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const natalBest = natalScored[0];
  const growthBest = growthScored[0];

  return {
    natal: {
      id: natalBest.id,
      name: natalBest.name,
      color: natalBest.color,
      score: natalBest.score,
    },
    growth: {
      id: growthBest.id,
      name: growthBest.name,
      color: growthBest.color,
      score: growthBest.score,
    },
  };
}

