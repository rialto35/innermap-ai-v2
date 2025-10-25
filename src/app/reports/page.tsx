'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReportV1 } from '@/types/report';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<ReportV1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
      return;
    }

    if (!session) return;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports?owner=me&limit=20');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#090e1c] via-[#0d1430] to-[#111827] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">리포트를 불러올 수 없습니다</h1>
            <p className="text-white/70">{error}</p>
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
          <h1 className="text-3xl font-bold mb-2">내 결과</h1>
          <p className="text-white/70">
            총 {reports.length}개의 분석 결과가 있습니다
          </p>
        </div>

        {/* 리포트 목록 */}
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">아직 분석 결과가 없습니다</h2>
            <p className="text-white/70 mb-6">첫 번째 성격 분석을 시작해보세요!</p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-white font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
            >
              <span>🔍</span>
              <span>검사 시작하기</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
              >
                {/* 리포트 헤더 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      분석 결과 #{index + 1}
                    </h3>
                    <span className="text-xs text-white/50">
                      {new Date(report.meta.generatedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm text-white/70">
                    {report.summary.highlight}
                  </p>
                </div>

                {/* 핵심 점수 */}
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">MBTI</span>
                    <span className="text-violet-400 font-semibold">{report.scores.mbti}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">RETI</span>
                    <span className="text-blue-400 font-semibold">{report.scores.reti}형</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Big5 평균</span>
                    <span className="text-green-400 font-semibold">
                      {Math.round(
                        (report.scores.big5.o + report.scores.big5.c + report.scores.big5.e + 
                         report.scores.big5.a + report.scores.big5.n) / 5
                      )}
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Link
                    href={`/report/${report.id}?tab=summary`}
                    className="flex-1 rounded-lg bg-violet-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                  >
                    📊 요약 보기
                  </Link>
                  <Link
                    href={`/report/${report.id}?tab=deep`}
                    className="flex-1 rounded-lg border border-white/20 py-2 px-4 text-center text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                  >
                    🔍 심층 분석
                  </Link>
                </div>

                {/* 엔진 정보 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-white/50 space-y-1">
                    <p>엔진: {report.meta.engineVersion}</p>
                    <p>가중치: {report.meta.weightsVersion}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 새 검사 시작 버튼 */}
        {reports.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-white font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
            >
              <span>➕</span>
              <span>새로운 검사 시작하기</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
