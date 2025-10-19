/**
 * Norms Loader Module
 * Handles loading and accessing population norms data
 */

import normsData from '../data/norms.json';
import type { Big5Norms } from './scoreBig5';

export interface NormsData {
  version: string;
  description: string;
  source: string;
  lastUpdated: string;
  big5: Record<string, {
    mean: number;
    sd: number;
    description: string;
    percentiles: Record<string, number>;
  }>;
  ageGroups: Record<string, Record<string, { mean: number; sd: number }>>;
  genderGroups: Record<string, Record<string, { mean: number; sd: number }>>;
}

/**
 * Get default Big5 norms
 * 
 * @returns Default Big5 norms
 */
export function getDefaultNorms(): Big5Norms {
  const { big5 } = normsData as NormsData;
  
  return {
    O: { mean: big5.O.mean, sd: big5.O.sd },
    C: { mean: big5.C.mean, sd: big5.C.sd },
    E: { mean: big5.E.mean, sd: big5.E.sd },
    A: { mean: big5.A.mean, sd: big5.A.sd },
    N: { mean: big5.N.mean, sd: big5.N.sd },
  };
}

/**
 * Get age-specific Big5 norms
 * 
 * @param age - User's age
 * @returns Age-specific Big5 norms
 */
export function getAgeNorms(age: number): Big5Norms {
  const { ageGroups } = normsData as NormsData;
  
  let group: string;
  if (age < 26) group = '18-25';
  else if (age < 36) group = '26-35';
  else if (age < 46) group = '36-45';
  else group = '46+';
  
  const norms = ageGroups[group];
  
  return {
    O: { mean: norms.O.mean, sd: norms.O.sd },
    C: { mean: norms.C.mean, sd: norms.C.sd },
    E: { mean: norms.E.mean, sd: norms.E.sd },
    A: { mean: norms.A.mean, sd: norms.A.sd },
    N: { mean: norms.N.mean, sd: norms.N.sd },
  };
}

/**
 * Get gender-specific Big5 norms
 * 
 * @param gender - User's gender ('male' or 'female')
 * @returns Gender-specific Big5 norms
 */
export function getGenderNorms(gender: 'male' | 'female'): Big5Norms {
  const { genderGroups } = normsData as NormsData;
  const norms = genderGroups[gender];
  
  return {
    O: { mean: norms.O.mean, sd: norms.O.sd },
    C: { mean: norms.C.mean, sd: norms.C.sd },
    E: { mean: norms.E.mean, sd: norms.E.sd },
    A: { mean: norms.A.mean, sd: norms.A.sd },
    N: { mean: norms.N.mean, sd: norms.N.sd },
  };
}

/**
 * Get combined norms based on age and gender
 * 
 * @param age - User's age
 * @param gender - User's gender
 * @returns Combined norms (weighted average)
 */
export function getCombinedNorms(
  age?: number,
  gender?: 'male' | 'female'
): Big5Norms {
  if (!age && !gender) {
    return getDefaultNorms();
  }
  
  if (age && !gender) {
    return getAgeNorms(age);
  }
  
  if (!age && gender) {
    return getGenderNorms(gender);
  }
  
  // Combine age and gender norms (50/50 weight)
  const ageNorms = getAgeNorms(age!);
  const genderNorms = getGenderNorms(gender!);
  
  return {
    O: {
      mean: (ageNorms.O.mean + genderNorms.O.mean) / 2,
      sd: Math.sqrt((ageNorms.O.sd ** 2 + genderNorms.O.sd ** 2) / 2),
    },
    C: {
      mean: (ageNorms.C.mean + genderNorms.C.mean) / 2,
      sd: Math.sqrt((ageNorms.C.sd ** 2 + genderNorms.C.sd ** 2) / 2),
    },
    E: {
      mean: (ageNorms.E.mean + genderNorms.E.mean) / 2,
      sd: Math.sqrt((ageNorms.E.sd ** 2 + genderNorms.E.sd ** 2) / 2),
    },
    A: {
      mean: (ageNorms.A.mean + genderNorms.A.mean) / 2,
      sd: Math.sqrt((ageNorms.A.sd ** 2 + genderNorms.A.sd ** 2) / 2),
    },
    N: {
      mean: (ageNorms.N.mean + genderNorms.N.mean) / 2,
      sd: Math.sqrt((ageNorms.N.sd ** 2 + genderNorms.N.sd ** 2) / 2),
    },
  };
}

/**
 * Get norms metadata
 * 
 * @returns Norms metadata
 */
export function getNormsMetadata(): Pick<NormsData, 'version' | 'description' | 'source' | 'lastUpdated'> {
  const { version, description, source, lastUpdated } = normsData as NormsData;
  return { version, description, source, lastUpdated };
}

