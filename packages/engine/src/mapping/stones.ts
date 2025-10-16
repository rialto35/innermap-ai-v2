/**
 * Stones Mapping (12 Acquired)
 * 
 * MBTI + RETI 기반 12결정석 매핑 (후천적 특성)
 * 
 * @version v1.0.0
 */

import type { Stone, StoneType, MBTIScores, RETIScores } from '../types';

const STONE_MAP: Record<string, StoneType> = {
  'INTJ-1': 'diamond', 'INTP-5': 'sapphire', 'ENTJ-8': 'ruby', 'ENTP-7': 'topaz',
  'INFJ-4': 'amethyst', 'INFP-9': 'opal', 'ENFJ-2': 'pearl', 'ENFP-7': 'amber',
  'ISTJ-1': 'obsidian', 'ISFJ-2': 'jade', 'ESTJ-8': 'ruby', 'ESFJ-2': 'pearl',
  'ISTP-5': 'quartz', 'ISFP-4': 'opal', 'ESTP-7': 'topaz', 'ESFP-7': 'amber'
};

export function mapStone(mbti: MBTIScores, reti: RETIScores): Stone {
  const key = `${mbti.type}-${reti.primaryType}`;
  const type = STONE_MAP[key] || 'diamond';
  
  const score = Math.round(60 + mbti.confidence * 20 + reti.confidence * 20);
  
  return {
    type,
    score,
    quality: score > 80 ? 'brilliance' : score > 60 ? 'clarity' : 'durability'
  };
}
