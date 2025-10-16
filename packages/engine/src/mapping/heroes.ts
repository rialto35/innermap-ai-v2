/**
 * Heroes Mapping (144)
 * 
 * Tribe (12) × Stone (12) = 144 Heroes
 * 
 * @version v1.0.0
 */

import type { Hero, Tribe, Stone } from '../types';

export function mapHero(tribe: Tribe, stone: Stone): Hero {
  const id = `${tribe.type}-${stone.type}`;
  
  // 144 영웅 데이터 (간략 버전, 실제로는 DB/JSON에서 로드)
  const heroData = getHeroData(id);
  
  return {
    id,
    tribe: tribe.type,
    stone: stone.type,
    name: heroData.name,
    description: heroData.description,
    traits: heroData.traits,
    archetype: heroData.archetype
  };
}

function getHeroData(id: string): {
  name: string;
  description: string;
  traits: string[];
  archetype: string;
} {
  // TODO: Load from database or JSON
  // For now, return placeholder
  return {
    name: `Hero ${id}`,
    description: `${id} 영웅의 설명`,
    traits: ['지혜', '용기', '혁신'],
    archetype: 'Visionary'
  };
}
