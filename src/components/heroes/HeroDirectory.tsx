'use client'

import { useMemo, useState } from 'react'
import { HEROES_144, Hero } from '@/lib/data/heroes144'
import HeroList from './HeroList'
import HeroFilters, { FilterState } from './HeroFilters'
import HeroModal from './HeroModal'

const DEFAULT_FILTERS: FilterState = {
  text: '',
  mbti: 'ALL',
  reti: 'ALL',
  sort: 'number-asc'
}

export default function HeroDirectory() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)

  const filteredHeroes = useMemo(() => {
    const keyword = filters.text.trim().toLowerCase()

    return HEROES_144.filter(hero => {
      const matchesMbti = filters.mbti === 'ALL' || hero.mbti === filters.mbti
      const matchesReti = filters.reti === 'ALL' || hero.reti === filters.reti
      const matchesKeyword =
        keyword.length === 0 ||
        hero.name.toLowerCase().includes(keyword) ||
        hero.nameEn.toLowerCase().includes(keyword) ||
        hero.tagline.toLowerCase().includes(keyword)

      return matchesMbti && matchesReti && matchesKeyword
    }).sort((a, b) => {
      if (filters.sort === 'number-desc') {
        return b.number - a.number
      }

      return a.number - b.number
    })
  }, [filters])

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Hero Archive</span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">144 영웅 도감</h1>
          <p className="mt-4 text-lg text-slate-200/80">
            MBTI와 RETI 조합으로 탄생한 144명의 영웅 세계관을 탐험하세요. 필터와 검색으로 나와 닮은 영웅을 찾을 수 있습니다.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <HeroFilters value={filters} onChange={setFilters} />
          <HeroList heroes={filteredHeroes} onSelect={setSelectedHero} />
        </div>
      </div>

      <HeroModal hero={selectedHero} onClose={() => setSelectedHero(null)} />
    </section>
  )
}
