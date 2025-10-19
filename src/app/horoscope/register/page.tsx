'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HoroscopeRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    solarBirth: '',
    lunarBirth: '',
    birthTime: '',
    location: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '운세 등록에 실패했습니다.')
      }

      // 성공 시 대시보드로 이동
      router.push('/dashboard?tab=fortune')
    } catch (err: any) {
      console.error('Failed to register horoscope:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white flex items-center justify-center gap-3">
            <span>🔮</span>
            <span>운세 등록</span>
          </h1>
          <p className="text-lg text-white/70">
            생년월일과 출생 시간을 입력하여
            <br />
            나만의 사주와 운세를 확인하세요
          </p>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8"
        >
          {/* 양력 생년월일 */}
          <div className="mb-6">
            <label htmlFor="solarBirth" className="block text-sm font-medium text-white mb-2">
              양력 생년월일 <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              id="solarBirth"
              name="solarBirth"
              required
              value={formData.solarBirth}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* 음력 생년월일 (선택) */}
          <div className="mb-6">
            <label htmlFor="lunarBirth" className="block text-sm font-medium text-white mb-2">
              음력 생년월일 (선택)
            </label>
            <input
              type="date"
              id="lunarBirth"
              name="lunarBirth"
              value={formData.lunarBirth}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
            />
            <p className="mt-1 text-xs text-white/50">
              음력 생년월일을 알고 계신다면 입력해주세요
            </p>
          </div>

          {/* 출생 시간 */}
          <div className="mb-6">
            <label htmlFor="birthTime" className="block text-sm font-medium text-white mb-2">
              출생 시간 <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              id="birthTime"
              name="birthTime"
              required
              value={formData.birthTime}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
            />
            <p className="mt-1 text-xs text-white/50">
              정확한 출생 시간을 입력하면 더 정확한 사주를 확인할 수 있습니다
            </p>
          </div>

          {/* 출생 지역 (선택) */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
              출생 지역 (선택)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="예: 서울, 부산, 대구"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 rounded-lg px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-center transition"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  등록 중...
                </span>
              ) : (
                '운세 등록하기'
              )}
            </button>
          </div>
        </form>

        {/* 안내 */}
        <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">💡 안내사항</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>정확한 출생 시간을 모르시는 경우, 대략적인 시간을 입력해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>음력 생년월일은 선택사항이며, 양력만으로도 운세를 확인할 수 있습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>입력하신 정보는 안전하게 보관되며, 본인만 조회할 수 있습니다</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

