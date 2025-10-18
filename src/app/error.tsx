'use client'

interface GlobalErrorProps {
  error: any
  reset: () => void
}

export default function GlobalError({ error }: GlobalErrorProps) {
  if (error?.code === 'FORBIDDEN_PREMIUM') {
    if (typeof window !== 'undefined') {
      window.location.href = '/premium?guard=1'
    }
    return null
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#0a0f1f] text-white/80">
      <div className="rounded-2xl bg-white/5 p-8 text-center shadow-lg shadow-black/20">
        <h1 className="text-xl font-semibold">문제가 발생했습니다.</h1>
        <p className="mt-2 text-sm text-white/60">잠시 후 다시 시도해 주세요.</p>
      </div>
    </div>
  )
}

