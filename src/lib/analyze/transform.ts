/**
 * Answer Transformation & Validation
 * 
 * Converts raw answers to engine-compatible input
 * Handles reverse items, weights, domain mapping
 */

import questionsData from '@/data/questions.unified.json';
import type { Answer } from '@innermap/engine';

interface Question {
  id: string;
  text: string;
  scale: number;
  reverse: boolean;
  weight: number;
  domain: string;
  tags: string[];
}

interface TransformResult {
  answers: Answer[];
  domainScores: Record<string, number[]>;
  metadata: {
    totalQuestions: number;
    answeredCount: number;
    domains: string[];
    version: string;
  };
}

/**
 * Load questions from unified JSON
 */
export function loadQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (const section of questionsData.sections) {
    questions.push(...section.questions as Question[]);
  }
  
  return questions;
}

/**
 * Get question by ID
 */
export function getQuestion(id: string): Question | undefined {
  const questions = loadQuestions();
  return questions.find(q => q.id === id);
}

/**
 * Apply reverse scoring
 * For 7-point scale: 1→7, 2→6, 3→5, 4→4, 5→3, 6→2, 7→1
 */
export function applyReverse(value: number, scale: number, reverse: boolean): number {
  if (!reverse) return value;
  return (scale + 1) - value;
}

/**
 * Normalize to -1 ~ +1 range
 * For 7-point scale: 1→-1, 4→0, 7→+1
 */
export function normalize(value: number, scale: number): number {
  const midpoint = (scale + 1) / 2;
  return (value - midpoint) / (midpoint - 1);
}

/**
 * Transform raw answers to engine input
 * 
 * @param rawAnswers - { questionId: value (1-7) }
 * @returns Transformed data ready for engine
 */
export function transformAnswers(rawAnswers: Record<string, number>): TransformResult {
  const questions = loadQuestions();
  const answers: Answer[] = [];
  const domainScores: Record<string, number[]> = {};
  
  for (const question of questions) {
    const rawValue = rawAnswers[question.id];
    
    if (rawValue === undefined) continue;
    
    // Validate range
    if (rawValue < 1 || rawValue > question.scale) {
      console.warn(`Invalid value for ${question.id}: ${rawValue}`);
      continue;
    }
    
    // Apply reverse scoring
    const reversedValue = applyReverse(rawValue, question.scale, question.reverse);
    
    // Normalize to -1 ~ +1
    const normalized = normalize(reversedValue, question.scale);
    
    // Apply weight
    const weighted = normalized * question.weight;
    
    // Store answer
    answers.push({
      questionId: question.id,
      value: weighted,
      timestamp: new Date().toISOString()
    });
    
    // Group by domain
    const domain = question.domain;
    if (!domainScores[domain]) {
      domainScores[domain] = [];
    }
    domainScores[domain].push(weighted);
  }
  
  // Extract unique domains
  const domains = Object.keys(domainScores);
  
  return {
    answers,
    domainScores,
    metadata: {
      totalQuestions: questions.length,
      answeredCount: answers.length,
      domains,
      version: questionsData.version
    }
  };
}

/**
 * Validate completeness
 */
export function validateCompleteness(rawAnswers: Record<string, number>): {
  isValid: boolean;
  missing: string[];
  errors: string[];
} {
  const questions = loadQuestions();
  const missing: string[] = [];
  const errors: string[] = [];
  
  for (const question of questions) {
    const value = rawAnswers[question.id];
    
    if (value === undefined) {
      missing.push(question.id);
      continue;
    }
    
    if (value < 1 || value > question.scale) {
      errors.push(`${question.id}: Invalid value ${value} (expected 1-${question.scale})`);
    }
  }
  
  return {
    isValid: missing.length === 0 && errors.length === 0,
    missing,
    errors
  };
}

/**
 * Calculate domain averages for preview
 */
export function calculateDomainAverages(rawAnswers: Record<string, number>): Record<string, number> {
  const { domainScores } = transformAnswers(rawAnswers);
  const averages: Record<string, number> = {};
  
  for (const [domain, scores] of Object.entries(domainScores)) {
    if (scores.length === 0) continue;
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    // Convert back to 0-100 scale for display
    averages[domain] = Math.round(((avg + 1) / 2) * 100);
  }
  
  return averages;
}

/**
 * Get Big5 preview scores
 */
export function getBig5Preview(rawAnswers: Record<string, number>): {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
} {
  const averages = calculateDomainAverages(rawAnswers);
  
  return {
    openness: averages['big5.openness'] || 50,
    conscientiousness: averages['big5.conscientiousness'] || 50,
    extraversion: averages['big5.extraversion'] || 50,
    agreeableness: averages['big5.agreeableness'] || 50,
    neuroticism: averages['big5.neuroticism'] || 50
  };
}

/**
 * Get estimated MBTI preview
 */
export function getMBTIPreview(rawAnswers: Record<string, number>): string {
  const averages = calculateDomainAverages(rawAnswers);
  
  const E = averages['mbti.E'] || 50;
  const I = averages['mbti.I'] || 50;
  const S = averages['mbti.S'] || 50;
  const N = averages['mbti.N'] || 50;
  const T = averages['mbti.T'] || 50;
  const F = averages['mbti.F'] || 50;
  const J = averages['mbti.J'] || 50;
  const P = averages['mbti.P'] || 50;
  
  return `${E > I ? 'E' : 'I'}${N > S ? 'N' : 'S'}${T > F ? 'T' : 'F'}${J > P ? 'J' : 'P'}`;
}

