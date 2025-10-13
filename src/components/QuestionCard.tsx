'use client'

import { useEffect, useState } from 'react'
import type { Question, SliderItem, PairItem } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  onAnswer: (value: number | 'A' | 'B') => void
  value?: number | 'A' | 'B'
}

export default function QuestionCard({ question, onAnswer, value }: QuestionCardProps) {
  if (question.kind === 'slider') return <SliderQuestion question={question} onAnswer={onAnswer} value={value} />
  return <PairQuestion question={question} onAnswer={onAnswer} value={value} />
}

function SliderQuestion({ question, onAnswer, value }: { question: SliderItem; onAnswer: (value: number) => void; value?: number | 'A' | 'B' }) {
  const [selected, setSelected] = useState<number>(typeof value === 'number' ? value : 50)

  useEffect(() => {
    setSelected(typeof value === 'number' ? value : 50)
  }, [question.id, value])

  const options = [
    { label: '전혀 아니다', value: 1 },
    { label: '아니다', value: 2 },
    { label: '약간 아니다', value: 3 },
    { label: '보통이다', value: 4 },
    { label: '약간 그렇다', value: 5 },
    { label: '그렇다', value: 6 },
    { label: '매우 그렇다', value: 7 },
  ]

  const handleSelect = (likertValue: number) => {
    const converted = Math.round(((likertValue - 1) / 6) * 100)
    setSelected(converted)
    onAnswer(converted)
  }

  const isActive = (likertValue: number) => selected === Math.round(((likertValue - 1) / 6) * 100)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 h-[96px]">
          <div className="flex-1 overflow-y-auto pr-2">
            <h2 className="text-2xl text-white leading-relaxed whitespace-pre-line">{question.text}</h2>
          </div>
          <span className="text-sm text-white/50 min-w-[80px] text-right shrink-0">
            {question.leftLabel ?? '0'} ~ {question.rightLabel ?? '100'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 w-full">
        {options.map(option => {
          const active = isActive(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={[
                'flex-1 flex flex-col items-center px-1 sm:px-2 py-2 rounded-xl font-medium transition-all',
                'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/60',
                active
                  ? 'scale-110 bg-sky-500/30 text-sky-100 shadow-lg font-bold'
                  : 'bg-white/5 text-white/70',
              ].join(' ')}
            >
              <span className={['text-xs sm:text-sm transition', active ? 'text-sky-200' : 'text-white/50'].join(' ')}>{option.label}</span>
              <span className={['block rounded-full mt-2', active ? 'bg-sky-400 w-6 h-6' : 'bg-white/20 w-5 h-5'].join(' ')}></span>
            </button>
          )
        })}
      </div>

      {selected != null && (
        <div className="mt-4 text-sky-300 text-base font-semibold text-center animate-fade-in">
          나의 선택: {options.find(o => selected === Math.round(((o.value - 1) / 6) * 100))?.label ?? ''}
        </div>
      )}
    </div>
  )
}

function PairQuestion({ question, onAnswer, value }: { question: PairItem; onAnswer: (value: 'A' | 'B') => void; value?: number | 'A' | 'B' }) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(value === 'A' || value === 'B' ? value : null)

  useEffect(() => {
    if (value === 'A' || value === 'B') setSelected(value)
    else setSelected(null)
  }, [question.id, value])

  const options = [
    { key: 'A' as const, label: question.a },
    { key: 'B' as const, label: question.b },
  ]

  const handleSelect = (choice: 'A' | 'B') => {
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="mb-6 h-[72px] flex items-center">
        <h2 className="text-2xl text-white leading-relaxed">
          둘 중 더 나와 가까운 것은?
        </h2>
      </div>

      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option.key}
            type="button"
            onClick={() => handleSelect(option.key)}
            className={[
              'w-full px-6 py-4 rounded-xl text-left transition-all border min-h-[64px] flex items-center gap-3',
              'hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-sky-400/60',
              selected === option.key
                ? 'bg-gradient-to-r from-amber-400/30 to-orange-500/30 border-amber-300 text-white'
                : 'bg-white/10 border-white/10 text-white/80 hover:bg-white/15',
            ].join(' ')}
          >
            <span className="text-white/60 font-semibold w-6 text-center">{option.key}</span>
            <span className="flex-1">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

