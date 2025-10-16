/**
 * /report/[id]
 * 
 * 심층 리포트 페이지
 * - LLM 생성 내러티브 표시
 * - 성장 벡터 시각화
 * - PDF 다운로드 및 공유 기능
 * 
 * @version v1.0.0
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ReportData {
  reportId: string;
  testResultId: string;
  reportType: string;
  status: string;
  content: string;
  visualData: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
      order: number;
    }>;
  };
  modelVersion: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch report
  useEffect(() => {
    if (!session) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        console.log('Fetching report:', id);
        
        const response = await fetch(`/api/report/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.error?.message || `Failed to fetch report (${response.status})`);
        }

        const data = await response.json();
        console.log('Report data:', data);
        setReport(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, session]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">리포트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            리포트를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">리포트 ID: {id}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              대시보드로 돌아가기
            </button>
            <button
              onClick={() => router.push('/analyze')}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              새로운 검사 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Parse sections from visual data
  const sections = report.visualData?.sections || [];
  sections.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center border-b pb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌟 심층 리포트
          </h1>
          <p className="text-gray-600">
            당신의 성격과 성장 가능성에 대한 AI 분석
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>생성일: {new Date(report.createdAt).toLocaleDateString('ko-KR')}</span>
            <span>•</span>
            <span>모델: {report.modelVersion || 'AI Engine v1.0'}</span>
          </div>
        </motion.header>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-indigo-600">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center space-y-4"
        >
          <h3 className="text-2xl font-bold">리포트 활용하기</h3>
          <p className="text-indigo-100">
            이 리포트를 저장하거나 다른 사람과 공유해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition"
            >
              📄 PDF로 저장
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                alert('링크가 복사되었습니다!');
              }}
              className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition"
            >
              🔗 링크 복사
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition"
            >
              🏠 대시보드로
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8">
          <p>이 리포트는 AI가 생성한 분석으로, 참고용으로만 사용해주세요.</p>
          <p className="mt-2">더 정확한 진단이 필요하다면 전문가와 상담하시기 바랍니다.</p>
        </div>
      </div>
    </div>
  );
}
