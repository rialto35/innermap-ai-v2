'use client'

import { ChangeEvent } from 'react'

export type FilterState = {
  text: string
  mbti: string
  reti: string
  sort: 'number-asc' | 'number-desc'
}

const MBTI_TYPES = [
  'ALL',
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

const RETI_TYPES = [
  { value: 'ALL', label: '전체' },
  { value: '1', label: '1 완벽형' },
  { value: '2', label: '2 도우미형' },
  { value: '3', label: '3 성취형' },
  { value: '4', label: '4 개성형' },
  { value: '5', label: '5 탐구형' },
  { value: '6', label: '6 충성형' },
  { value: '7', label: '7 열정형' },
  { value: '8', label: '8 도전형' },
  { value: '9', label: '9 평화형' }
]

interface HeroFiltersProps {
  value: FilterState
  onChange: (filters: FilterState) => void
}

export default function HeroFilters({ value, onChange }: HeroFiltersProps) {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, text: event.target.value })
  }

  const handleSelectChange = (key: 'mbti' | 'reti' | 'sort') =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...value, [key]: event.target.value })
    }

  const resetFilters = () => onChange({ text: '', mbti: 'ALL', reti: 'ALL', sort: 'number-asc' })

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">필터</h2>
      <p className="mt-2 text-sm text-slate-300/80">
        영웅을 빠르게 찾고 싶다면 키워드 검색이나 MBTI · RETI 필터를 활용해 보세요.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="hero-search">
            키워드 검색
          </label>
          <input
            id="hero-search"
            value={value.text}
            onChange={handleTextChange}
            placeholder="영웅 이름, 태그라인, 설명 검색"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="hero-mbti">
            MBTI 필터
          </label>
          <select
            id="hero-mbti"
            value={value.mbti}
            onChange={handleSelectChange('mbti')}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            {MBTI_TYPES.map(type => (
              <option key={type} value={type} className="bg-slate-800">
                {type === 'ALL' ? '전체' : type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="hero-reti">
            RETI 필터
          </label>
          <select
            id="hero-reti"
            value={value.reti}
            onChange={handleSelectChange('reti')}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            {RETI_TYPES.map(type => (
              <option key={type.value} value={type.value} className="bg-slate-800">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="hero-sort">
            정렬
          </label>
          <select
            id="hero-sort"
            value={value.sort}
            onChange={handleSelectChange('sort')}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            <option className="bg-slate-800" value="number-asc">
              번호 오름차순 (001 → 144)
            </option>
            <option className="bg-slate-800" value="number-desc">
              번호 내림차순 (144 → 001)
            </option>
          </select>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="mt-8 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/15"
      >
        필터 초기화
      </button>
    </aside>
  )
}
