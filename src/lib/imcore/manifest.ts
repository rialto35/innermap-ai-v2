import { HEROES_144 } from '@/lib/data/heroes144'

export type HeroManifest = {
  id: string
  name: string
  tribe: string
  stone: string
  title: string
  traits: string[]
}

function toManifestId(value: string): string {
  return value.toLowerCase()
}

export const HERO_MANIFEST: Record<string, HeroManifest> = HEROES_144.reduce(
  (acc, hero) => {
    const id = toManifestId(hero.id)
    acc[id] = {
      id: hero.id,
      name: hero.name,
      tribe: hero.retiType || 'Unknown Tribe',
      stone: hero.reti ? `Stone-${hero.reti}` : 'Unknown Stone',
      title: hero.tagline,
      traits: hero.strengths ?? []
    }
    return acc
  },
  {} as Record<string, HeroManifest>
)

export const FALLBACK_HERO: HeroManifest = {
  id: 'unknown',
  name: '미확인 영웅',
  tribe: 'Unknown Tribe',
  stone: 'Unknown Stone',
  title: '당신의 영웅을 발견해보세요',
  traits: []
}
