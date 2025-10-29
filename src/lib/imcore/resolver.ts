import { HERO_MANIFEST, FALLBACK_HERO } from './manifest'

export function resolveHeroContext(heroId: string | null | undefined) {
  if (!heroId) return FALLBACK_HERO
  const key = heroId.toLowerCase()
  return HERO_MANIFEST[key] || FALLBACK_HERO
}
