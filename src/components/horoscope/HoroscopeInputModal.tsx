'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const FormSchema = z.object({
  solarBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력하세요'),
  lunarBirth: z.string().optional(),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'HH:MM 형식으로 입력하세요'),
  location: z.string().optional(),
})

type FormData = z.infer<typeof FormSchema>

interface HoroscopeInputModalProps {
  onSuccess?: () => void
}

export default function HoroscopeInputModal({ onSuccess }: HoroscopeInputModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(values: FormData) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '운세 등록에 실패했습니다.')
      }

      setOpen(false)
      reset()
      
      // 성공 콜백 호출 (부모 컴포넌트에서 데이터 재조회)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Failed to register horoscope:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:scale-105 transition shadow-lg"
      >
        <span>✨</span>
        <span>운세 등록하기</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🔮</span>
                <span>운세 등록</span>
              </h2>
              <p className="mt-2 text-sm text-white/60">
                생년월일과 출생 시간을 입력하세요
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* 양력 생년월일 */}
              <div>
                <label htmlFor="solarBirth" className="block text-sm font-medium text-white mb-2">
                  양력 생년월일 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="solarBirth"
                  {...register('solarBirth')}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
                />
                {errors.solarBirth && (
                  <p className="mt-1 text-xs text-red-400">{errors.solarBirth.message}</p>
                )}
              </div>

              {/* 음력 생년월일 */}
              <div>
                <label htmlFor="lunarBirth" className="block text-sm font-medium text-white mb-2">
                  음력 생년월일 (선택)
                </label>
                <input
                  type="date"
                  id="lunarBirth"
                  {...register('lunarBirth')}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
                />
                {errors.lunarBirth && (
                  <p className="mt-1 text-xs text-red-400">{errors.lunarBirth.message}</p>
                )}
              </div>

              {/* 출생 시간 */}
              <div>
                <label htmlFor="birthTime" className="block text-sm font-medium text-white mb-2">
                  출생 시간 <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  id="birthTime"
                  {...register('birthTime')}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
                />
                {errors.birthTime && (
                  <p className="mt-1 text-xs text-red-400">{errors.birthTime.message}</p>
                )}
              </div>

              {/* 출생 지역 */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
                  출생 지역 (선택)
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="예: 서울, 부산, 대구"
                  {...register('location')}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-400">{errors.location.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      등록 중...
                    </span>
                  ) : (
                    '등록하기'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

