/**
 * Tie-Breaker Module
 * Handles tie-breaking logic for ambiguous results
 */

import type { InnerNine } from '../inner9/types';

export interface TieBreakerOptions {
  threshold?: number; // Minimum difference to consider as "clear winner" (default: 5)
  useSecondary?: boolean; // Use secondary factors for tie-breaking (default: true)
}

/**
 * Find tied dimensions in Inner9 scores
 * 
 * @param inner9 - Inner9 scores
 * @param threshold - Maximum difference to consider as "tied" (default: 5)
 * @returns Array of tied dimension groups
 */
export function findTies(
  inner9: InnerNine,
  threshold: number = 5
): string[][] {
  const entries = Object.entries(inner9) as [keyof InnerNine, number][];
  const ties: string[][] = [];
  
  // Sort by score descending
  entries.sort((a, b) => b[1] - a[1]);
  
  let currentGroup: string[] = [entries[0][0]];
  let currentScore = entries[0][1];
  
  for (let i = 1; i < entries.length; i++) {
    const [key, score] = entries[i];
    
    if (Math.abs(score - currentScore) <= threshold) {
      // Within threshold, add to current group
      currentGroup.push(key);
    } else {
      // Outside threshold, save current group if it has ties
      if (currentGroup.length > 1) {
        ties.push(currentGroup);
      }
      // Start new group
      currentGroup = [key];
      currentScore = score;
    }
  }
  
  // Save last group if it has ties
  if (currentGroup.length > 1) {
    ties.push(currentGroup);
  }
  
  return ties;
}

/**
 * Break ties using secondary factors
 * 
 * @param tiedDimensions - Array of tied dimension names
 * @param inner9 - Full Inner9 scores
 * @param secondaryFactors - Optional secondary factor scores
 * @returns Winning dimension
 */
export function breakTie(
  tiedDimensions: string[],
  inner9: InnerNine,
  secondaryFactors?: Record<string, number>
): string {
  if (tiedDimensions.length === 0) {
    throw new Error('No tied dimensions provided');
  }
  
  if (tiedDimensions.length === 1) {
    return tiedDimensions[0];
  }
  
  // Strategy 1: Use secondary factors if provided
  if (secondaryFactors) {
    const scores = tiedDimensions.map(dim => ({
      dim,
      score: secondaryFactors[dim] ?? 0,
    }));
    scores.sort((a, b) => b.score - a.score);
    
    if (scores[0].score > scores[1].score) {
      return scores[0].dim;
    }
  }
  
  // Strategy 2: Use complementary dimensions
  // For example, if "creation" and "will" are tied,
  // check their complementary dimensions
  const complementaryScores = tiedDimensions.map(dim => {
    const complementary = getComplementaryDimension(dim);
    return {
      dim,
      complementaryScore: complementary ? inner9[complementary as keyof InnerNine] ?? 0 : 0,
    };
  });
  complementaryScores.sort((a, b) => b.complementaryScore - a.complementaryScore);
  
  if (complementaryScores[0].complementaryScore > complementaryScores[1].complementaryScore) {
    return complementaryScores[0].dim;
  }
  
  // Strategy 3: Fallback to alphabetical order (deterministic)
  return tiedDimensions.sort()[0];
}

/**
 * Get complementary dimension for a given dimension
 * 
 * @param dimension - Dimension name
 * @returns Complementary dimension name or null
 */
function getComplementaryDimension(dimension: string): string | null {
  const complementaryMap: Record<string, string> = {
    creation: 'balance',
    will: 'harmony',
    insight: 'expression',
    sensitivity: 'growth',
    growth: 'sensitivity',
    balance: 'creation',
    harmony: 'will',
    expression: 'insight',
  };
  
  return complementaryMap[dimension] ?? null;
}

/**
 * Resolve all ties in Inner9 scores
 * 
 * @param inner9 - Inner9 scores
 * @param options - Tie-breaker options
 * @returns Resolved Inner9 scores (with small adjustments to break ties)
 */
export function resolveAllTies(
  inner9: InnerNine,
  options: TieBreakerOptions = {}
): InnerNine {
  const { threshold = 5, useSecondary = true } = options;
  const ties = findTies(inner9, threshold);
  
  if (ties.length === 0) {
    return inner9; // No ties to resolve
  }
  
  const resolved = { ...inner9 };
  
  for (const tiedGroup of ties) {
    const winner = breakTie(
      tiedGroup,
      inner9,
      useSecondary ? resolved : undefined
    );
    
    // Slightly boost winner to break the tie
    resolved[winner as keyof InnerNine] += 0.1;
  }
  
  return resolved;
}

/**
 * Check if Inner9 scores have any ambiguous results
 * 
 * @param inner9 - Inner9 scores
 * @param threshold - Maximum difference to consider as "ambiguous" (default: 5)
 * @returns true if ambiguous, false otherwise
 */
export function hasAmbiguousResults(
  inner9: InnerNine,
  threshold: number = 5
): boolean {
  const ties = findTies(inner9, threshold);
  return ties.length > 0;
}

