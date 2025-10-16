/**
 * /report/[id]
 * 
 * Deep Report Page (Temporary Redirect)
 * TODO M2: Implement async report generation
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: PageProps) {
  const router = useRouter();

  useEffect(() => {
    // 임시로 결과 페이지로 리다이렉트
    // TODO M2: API로 리포트 상태 확인 후 표시
    params.then(({ id }) => {
      router.replace(`/results/${id}`);
    });
  }, [router, params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">결과 페이지로 이동 중...</p>
        <p className="text-gray-400 text-sm mt-2">심층 리포트는 M2에서 제공됩니다</p>
      </div>
    </div>
  );
}

