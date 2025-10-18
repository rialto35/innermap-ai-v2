interface SubscriptionManageProps {
  providerPortalUrl?: string
  receiptUrl?: string
}

export function SubscriptionManage({ providerPortalUrl, receiptUrl }: SubscriptionManageProps) {
  if (!providerPortalUrl && !receiptUrl) {
    return null
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3 text-sm">
      {providerPortalUrl && (
        <a
          href={providerPortalUrl}
          className="rounded-lg bg-white/10 px-3 py-2 text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          결제수단·청구 관리
        </a>
      )}
      {receiptUrl && (
        <a
          href={receiptUrl}
          className="rounded-lg bg-white/10 px-3 py-2 text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          결제 내역·영수증
        </a>
      )}
    </div>
  )
}

