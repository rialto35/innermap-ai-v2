'use client'

import { FormEvent, useState } from 'react'

type WizardFormProps = {
  onSubmit: (birthDate: string) => void
}

export default function WizardForm({ onSubmit }: WizardFormProps) {
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!birthDate) {
      setError('생년월일을 입력해 주세요.')
      return
    }

    setError('')
    onSubmit(birthDate)
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">생년월일 입력</h2>
      <p className="mt-2 text-sm text-slate-300/80">
        60갑자를 기준으로 사주 12지지를 계산한 뒤 InnerMap의 12부족과 매칭합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="wizard-birth-date">
            생년월일 (YYYY-MM-DD)
          </label>
          <input
            id="wizard-birth-date"
            type="date"
            value={birthDate}
            onChange={event => setBirthDate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300/70">
          • 1984-01-01(甲子일)을 기준으로 계산합니다.
          <br />• 태어난 날짜만 입력하면 됩니다. 시간은 추후 업데이트 예정입니다.
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02]"
        >
          부족 매칭 보기
        </button>
      </form>
    </aside>
  )
}
