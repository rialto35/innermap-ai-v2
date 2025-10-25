'use client';

import useSWR from 'swr';
import type { ReportV1 } from '@/types/report';
import Link from 'next/link';

export default function ResultListPage() {
  const { data, isLoading, error } = useSWR<{ reports: ReportV1[] }>(
    '/api/reports?owner=me',
    async (url: string) => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    }
  );

  if (isLoading) {
    return <div className="p-6 text-white">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">리포트를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">내 결과</h1>
          <p className="text-white/70">총 {data?.reports.length ?? 0}개의 결과</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {data?.reports.map((report) => (
            <Link
              key={report.id}
              href={`/result/${report.id}?tab=summary`}
              className="block rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
            >
              <h2 className="text-lg font-semibold text-white mb-2">결과 #{report.id.slice(0, 8)}</h2>
              <p className="text-white/70 text-sm">{report.summary.highlight}</p>
              <div className="mt-4 text-xs text-white/50">생성일 {new Date(report.meta.generatedAt).toLocaleDateString('ko-KR')}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
