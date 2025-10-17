/**
 * /report/[id] - Deep Report Page
 * 
 * 심층 리포트 페이지 (비동기 큐 방식)
 * - 상태 폴링 (queued/processing/ready/failed)
 * - Markdown 렌더링
 * - 시각화 (Big5 레이더, 성장 벡터)
 * 
 * @version v1.1.0
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReportHeader from '@/components/report/ReportHeader';
import ReportStatus from '@/components/report/ReportStatus';
import ReportMarkdown from '@/components/report/ReportMarkdown';
import ReportActions from '@/components/report/ReportActions';
import Big5RadarChart from '@/components/Big5RadarChart';

interface ReportData {
  id: string;
  user_id: string;
  result_id: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  summary_md?: string;
  visuals_json?: any;
  error_msg?: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

interface ResultData {
  id: string;
  hero_id: string;
  hero_name: string;
  engine_version: string;
  big5_openness: number;
  big5_conscientiousness: number;
  big5_extraversion: number;
  big5_agreeableness: number;
  big5_neuroticism: number;
}

interface StatusResponse {
  reportId: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  error?: string;
  estimatedTimeRemaining?: number;
  startedAt?: string;
  finishedAt?: string;
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [reportId, setReportId] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract reportId from params
  useEffect(() => {
    params.then(({ id }) => {
      setReportId(id);
    });
  }, [params]);

  // Auth check
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirect=/report/' + reportId);
    }
  }, [sessionStatus, router, reportId]);

  // Fetch report data initially
  useEffect(() => {
    if (!reportId || !session) return;

    const fetchReport = async () => {
      try {
        setLoading(true);

        // Fetch report
        const reportRes = await fetch(`/api/report/${reportId}`);
        if (!reportRes.ok) {
          throw new Error('리포트를 찾을 수 없습니다.');
        }

        const reportData = await reportRes.json();
        setReport(reportData);

        // Fetch result data for hero info
        const resultRes = await fetch(`/api/results/${reportData.result_id}`);
        if (resultRes.ok) {
          const raw = await resultRes.json();
          // Normalize nested payload from results API → flat shape used by this page
          const normalized: ResultData = {
            id: raw.id,
            hero_id: raw.hero?.id || 'default',
            hero_name: raw.hero?.name || '미지의 영웅',
            engine_version: raw.engineVersion || 'v1.0.0',
            big5_openness: raw.big5?.openness ?? 50,
            big5_conscientiousness: raw.big5?.conscientiousness ?? 50,
            big5_extraversion: raw.big5?.extraversion ?? 50,
            big5_agreeableness: raw.big5?.agreeableness ?? 50,
            big5_neuroticism: raw.big5?.neuroticism ?? 50
          };
          setResult(normalized);
        }

        setLoading(false);
      } catch (err) {
        console.error('[ReportPage] Error fetching report:', err);
        setError(err instanceof Error ? err.message : '리포트를 불러올 수 없습니다.');
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, session]);

  // Status polling (when queued or processing)
  useEffect(() => {
    if (!report || !reportId) return;
    if (report.status !== 'queued' && report.status !== 'processing') return;

    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await fetch(`/api/report/${reportId}/status`);
        if (statusRes.ok) {
          const status: StatusResponse = await statusRes.json();
          setStatusData(status);

          // Update report status if changed
          if (status.status !== report.status) {
            console.log(`[ReportPage] Status changed: ${report.status} → ${status.status}`);
            setReport({ ...report, status: status.status });

            // If ready or failed, refetch full report data
            if (status.status === 'ready' || status.status === 'failed') {
              const reportRes = await fetch(`/api/report/${reportId}`);
              if (reportRes.ok) {
                const updatedReport = await reportRes.json();
                setReport(updatedReport);
              }
            }
          }
        }
      } catch (err) {
        console.error('[ReportPage] Polling error:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [report, reportId]);

  // Retry handler
  const handleRetry = async () => {
    if (!result) return;

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: result.id })
      });

      if (!res.ok) {
        throw new Error('재시도 요청 실패');
      }

      const data = await res.json();
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      console.error('[ReportPage] Retry error:', err);
      alert('재시도 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
              오류 발생
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {error || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="report-root" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12">
      <style jsx global>{`
        /* PDF 페이지 분리: 큰 섹션 앞뒤에 page-break 적용 */
        .pdf-page-break { page-break-after: always; break-after: page; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        {result && (
          <ReportHeader
            heroId={result.hero_id}
            heroName={result.hero_name}
            engineVersion={result.engine_version}
            createdAt={report.created_at}
            finishedAt={report.finished_at}
            reportId={report.id}
          />
        )}

        {/* Status */}
        <ReportStatus
          status={report.status}
          error={report.error_msg}
          estimatedTimeRemaining={statusData?.estimatedTimeRemaining}
          onRetry={report.status === 'failed' ? handleRetry : undefined}
        />

        {/* Report Content (only if ready) */}
        {report.status === 'ready' && report.summary_md && (
          <>
            {/* Markdown Content */}
            <div className="mb-6 pdf-avoid-break">
              <ReportMarkdown content={report.summary_md} />
            </div>

            {/* Visualizations */}
            {result && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm mb-6 pdf-avoid-break">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  성격 프로필
                </h2>
                <Big5RadarChart
                  big5={{
                    O: result.big5_openness,
                    C: result.big5_conscientiousness,
                    E: result.big5_extraversion,
                    A: result.big5_agreeableness,
                    N: result.big5_neuroticism
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <ReportActions reportId={report.id} status={report.status} />

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          <div>© {new Date().getFullYear()} InnerMap AI · Professional Psychological Report</div>
          <div className="opacity-70">이 리포트는 개인적 인사이트 제공을 목적으로 하며 의료적 진단이 아닙니다.</div>
        </div>
      </div>
    </div>
  );
}
