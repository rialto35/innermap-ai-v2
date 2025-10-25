'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import type { ReportV1 } from '@/types/report';
import ReportSummary from '@/components/report/ReportSummary';
import ReportDeep from '@/components/report/ReportDeep';
import React, { useState } from 'react';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'summary';
  const [activeTab, setActiveTab] = useState(tab);
  const [resultId, setResultId] = useState<string | null>(null);

  React.useEffect(() => {
    params.then(({ id }) => setResultId(id));
  }, [params]);

  const { data: report, error, isLoading } = useSWR<ReportV1>(
    resultId ? `/api/results/${resultId}` : null,
    async (url: string) => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch result');
      const data = await res.json();
      
      // results API 응답을 ReportV1 형식으로 변환
      const coerceNum = (v: any, d = 0) => (typeof v === 'number' ? v : Number(v ?? d));
      const coerceBig5 = (b: any) => ({
        o: coerceNum(b?.O ?? b?.o),
        c: coerceNum(b?.C ?? b?.c),
        e: coerceNum(b?.E ?? b?.e),
        a: coerceNum(b?.A ?? b?.a),
        n: coerceNum(b?.N ?? b?.n),
      });
      const inner9Arr = (() => {
        const rec = data?.inner9_scores as Record<string, number> | null;
        if (!rec) return [] as Array<{ label: string; value: number }>;
        return Object.entries(rec).map(([k, v]) => ({ label: k, value: coerceNum(v) }));
      })();

      return {
        id: data.id,
        ownerId: data.user_id || 'unknown',
        meta: {
          version: 'v1.3.1' as const,
          engineVersion: data.engine_version || 'IM-Core 1.3.1',
          weightsVersion: 'v1.3',
          generatedAt: data.created_at || new Date().toISOString(),
        },
        scores: {
          big5: coerceBig5(data.big5_scores || {}),
          mbti: data.mbti?.type || data.mbti || 'XXXX',
          reti: coerceNum(data.reti?.primaryType || data.reti?.score || data.reti, 5),
          inner9: inner9Arr,
        },
        summary: {
          highlight: data.analysis_text || '분석 결과를 확인해보세요.',
          bullets: ['분석 완료', '결과 확인 가능'],
        },
      } as ReportV1;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내결과</h1>
          <p className="text-white/70">ID: {report.id}</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'summary' ? 'bg-white text-black font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            📊 요약
          </button>
          <button
            onClick={() => setActiveTab('deep')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'deep' ? 'bg-white text-black font-medium' : 'text-white/70 hover:text-white'
            }`}
          >
            🔍 심층 분석
          </button>
        </div>

        {activeTab === 'summary' ? <ReportSummary report={report} /> : <ReportDeep report={report} />}
      </div>
    </div>
  );
}


