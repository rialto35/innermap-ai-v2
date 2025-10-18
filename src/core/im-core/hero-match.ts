/**
 * Hero Matching Logic (v2 - catalog based)
 * @module @innermap/im-core
 */

import { InnerNine } from '../inner9';
import heroCatalog from '@/data/hero_catalog.json';

interface HeroCandidate {
  id: number;
  code: string;
  title: string;
  traits: string[];
  color: number;
  score?: number;
}

/**
 * Match hero based on Inner9 scores and hero catalog
 * Calculates score for each hero based on trait alignment
 */
export function matchHero(inner9: InnerNine) {
  const heroes = heroCatalog as HeroCandidate[];

  // Calculate score for each hero
  const scored = heroes.map((hero) => {
    const score =
      hero.traits.reduce((sum, trait) => sum + (inner9[trait as keyof InnerNine] ?? 0), 0) /
      hero.traits.length;
    return { ...hero, score };
  });

  // Sort by score (descending) and return top match
  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const best = scored[0];
  return {
    id: best.id,
    code: best.code,
    title: best.title,
    color: best.color,
    score: best.score,
  };
}

