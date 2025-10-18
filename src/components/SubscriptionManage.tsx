interface SubscriptionManageProps {
  providerPortalUrl?: string | null
  receiptUrl?: string | null
}

export function SubscriptionManage({ providerPortalUrl, receiptUrl }: SubscriptionManageProps) {
  const portal = providerPortalUrl ?? undefined
  const receipt = receiptUrl ?? undefined

  if (!portal && !receipt) {
    return null
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3 text-sm">
      {portal && (
        <a
          href={portal}
          className="rounded-lg bg-white/10 px-3 py-2 text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          결제수단·청구 관리
        </a>
      )}
      {receipt && (
        <a
          href={receipt}
          className="rounded-lg bg-white/10 px-3 py-2 text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          결제 내역·영수증
        </a>
      )}
    </div>
  )
}

