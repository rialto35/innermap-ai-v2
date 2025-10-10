'use client'

import { useState } from 'react'
import WizardForm from '@/components/wizard/WizardForm'
import WizardResult from '@/components/wizard/WizardResult'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'

export interface WizardResultState {
  status: 'idle' | 'ready'
  birthDate: string
  tribeId: string
}

const INITIAL_RESULT: WizardResultState = {
  status: 'idle',
  birthDate: '',
  tribeId: ''
}

export default function WizardPage() {
  const [result, setResult] = useState<WizardResultState>(INITIAL_RESULT)

  const handleSubmit = (birthDate: string) => {
    const { tribe } = getTribeFromBirthDate(birthDate)
    setResult({ status: 'ready', birthDate, tribeId: tribe.id })
  }

  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Birth Wizard</span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">생년월일 기반 빠른 부족 매칭</h1>
          <p className="mt-4 text-lg text-slate-200/80">
            생년월일을 입력하면 사주 12지지에 맞춰 InnerMap의 12부족 중 당신이 태어난 부족을 안내해 드립니다.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <WizardForm onSubmit={handleSubmit} />
          <WizardResult state={result} />
        </div>
      </div>
    </div>
  )
}
