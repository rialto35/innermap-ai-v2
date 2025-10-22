/**
 * /results/[id]
 * Server wrapper + client component split to allow segment config exports.
 */

// 캐시 완전 차단 설정 (서버에서만 선언)
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'default-no-store'

import ResultPageClient from './ResultPageClient'

interface PageProps {
  params: { id: string }
}

export default function ResultPage({ params }: PageProps) {
  const { id } = params
  return <ResultPageClient id={id} />
}

