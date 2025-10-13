'use client'

import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 text-white/80">
        <h1 className="text-2xl font-bold text-white">설정</h1>

        <section className="card-glass p-6">
          <div className="text-white font-semibold mb-2">계정</div>
          <div className="text-sm">이름: {user?.name || '-'}</div>
          <div className="text-sm">이메일: {user?.email || '-'}</div>
        </section>

        <section className="card-glass p-6">
          <div className="text-white font-semibold mb-2">연동</div>
          <div className="text-sm">Google: 연결됨</div>
          <div className="text-sm">카카오/네이버: 준비중</div>
        </section>
      </div>
    </div>
  )
}
