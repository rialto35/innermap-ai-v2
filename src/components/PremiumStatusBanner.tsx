interface PremiumStatusBannerProps {
  status?: string
  end?: string
  cancelAtPeriodEnd?: boolean
  pastDue?: boolean
}

export function PremiumStatusBanner({ status, end, cancelAtPeriodEnd, pastDue }: PremiumStatusBannerProps) {
  if (!status) return null

  if (pastDue) {
    return (
      <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
        결제 재시도가 필요합니다. 결제 수단을 업데이트해주세요.
      </div>
    )
  }

  if (cancelAtPeriodEnd) {
    const formattedEnd = end ? new Date(end).toLocaleDateString('ko-KR') : undefined
    return (
      <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 text-sm text-violet-200">
        구독이 {formattedEnd ?? '만료 예정일 미정'}에 종료됩니다.
      </div>
    )
  }

  return null
}
