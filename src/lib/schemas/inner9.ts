/**
 * Inner9 Schema Validation with Zod
 * Ensures all scores are 0-100 integers with proper validation
 */

import { z } from "zod";

export const Inner9Schema = z.object({
  creation: z.number().min(0).max(100),
  will: z.number().min(0).max(100),
  sensitivity: z.number().min(0).max(100),
  harmony: z.number().min(0).max(100),
  expression: z.number().min(0).max(100),
  insight: z.number().min(0).max(100),
  resilience: z.number().min(0).max(100),
  balance: z.number().min(0).max(100),
  growth: z.number().min(0).max(100),
});

export type Inner9 = z.infer<typeof Inner9Schema>;

/**
 * Clamp value to 0-100 range and round to integer
 */
export const clamp100 = (v: number): number => Math.max(0, Math.min(100, Math.round(v)));

/**
 * Safe number conversion with fallback
 */
export const safeNumber = (value: any): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Validate and sanitize Inner9 scores
 */
export function validateInner9Scores(scores: any): Inner9 {
  const sanitized = Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [
      key,
      clamp100(safeNumber(value))
    ])
  );
  
  return Inner9Schema.parse(sanitized);
}

/**
 * Get default Inner9 scores (neutral values)
 */
export function getDefaultInner9Scores(): Inner9 {
  return {
    creation: 50,
    will: 50,
    sensitivity: 50,
    harmony: 50,
    expression: 50,
    insight: 50,
    resilience: 50,
    balance: 50,
    growth: 50,
  };
}
