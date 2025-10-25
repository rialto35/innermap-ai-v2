/**
 * /report/:id?tab=summary|deep
 * 단일 리포트 진입점
 */

'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ReportV1 } from '@/types/report';
import ReportSummary from '@/components/report/ReportSummary';
import ReportDeep from '@/components/report/ReportDeep';
import React, { useState } from 'react';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'summary';
  const [activeTab, setActiveTab] = useState(tab);
  const [reportId, setReportId] = useState<string | null>(null);

  // params를 await
  React.useEffect(() => {
    params.then(({ id }) => setReportId(id));
  }, [params]);

  // 리포트 데이터 조회
  const { data: report, error, isLoading } = useSWR<ReportV1>(
    reportId ? `/api/reports/${reportId}?include=deep` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch report');
      return res.json();
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-4 bg-white/5 rounded mb-2"></div>
            <div className="h-4 bg-white/5 rounded mb-2"></div>
            <div className="h-4 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">리포트를 찾을 수 없습니다</h1>
            <p className="text-white/70">요청하신 리포트가 존재하지 않거나 접근 권한이 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내면 분석 리포트</h1>
          <p className="text-white/70">
            생성일: {new Date(report.meta.generatedAt).toLocaleDateString('ko-KR')}
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'summary'
                ? 'bg-white text-black font-medium'
                : 'text-white/70 hover:text-white'
            }`}
          >
            📊 요약
          </button>
          <button
            onClick={() => setActiveTab('deep')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'deep'
                ? 'bg-white text-black font-medium'
                : 'text-white/70 hover:text-white'
            }`}
          >
            🔍 심층 분석
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'summary' ? (
          <ReportSummary report={report} />
        ) : (
          <ReportDeep report={report} />
        )}
      </div>
    </div>
  );
}
