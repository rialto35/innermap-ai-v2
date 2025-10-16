/**
 * /results/[id]
 * 
 * Result Snapshot Page
 * PR #4 Implementation
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ResultSkeleton from '@/components/ui/ResultSkeleton';
import type { ResultSnapshot } from '@innermap/engine';

// Dynamic imports for charts (client-only)
const Big5RadarChart = dynamic(() => import('@/components/Big5RadarChart'), { ssr: false });
const GrowthVectorChart = dynamic(() => import('@/components/GrowthVectorChart'), { ssr: false });

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<ResultSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch result
  useEffect(() => {
    if (!session) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        console.log('Fetching result for ID:', id);
        const response = await fetch(`/api/results/${id}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error Response:', errorData);
          throw new Error(errorData.error?.message || `Failed to fetch result (${response.status})`);
        }

        const data = await response.json();
        console.log('Result data received:', data);
        setResult(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, session]);

  if (loading || status === 'loading') {
    return <ResultSkeleton />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            결과를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            검사 ID: {id}
          </p>
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
          <p className="text-xs text-gray-400 mt-4">
            💡 검사를 완료하지 않았거나, 결과가 아직 처리 중일 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {result.hero.name}
          </h1>
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {result.tribe.type}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {result.stone.type}
            </span>
            <span className="text-gray-500">
              {new Date(result.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </motion.header>

        {/* Hero Profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl">
              {result.hero.name.charAt(0)}
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">{result.hero.description}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {result.hero.traits.map((trait, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Big5 Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Big5 Personality</h3>
            <div className="h-64">
              <Big5RadarChart big5={{
                O: result.big5.openness,
                C: result.big5.conscientiousness,
                E: result.big5.extraversion,
                A: result.big5.agreeableness,
                N: result.big5.neuroticism
              }} />
            </div>
          </motion.div>

          {/* MBTI/RETI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Types</h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-600 mb-2">MBTI</div>
                <div className="text-3xl font-bold text-indigo-600">{result.mbti.type}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Confidence: {Math.round(result.mbti.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">RETI (Enneagram)</div>
                <div className="text-3xl font-bold text-purple-600">Type {result.reti.primaryType}</div>
                {result.reti.wing && (
                  <div className="text-sm text-gray-500 mt-1">Wing: {result.reti.wing}</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">심층 리포트가 필요하신가요?</h2>
          <p className="mb-6 text-indigo-100">
            AI 기반 내러티브 분석과 상세한 인사이트를 확인하세요
          </p>
          <button
            onClick={() => router.push(`/report/${result.id}`)}
            className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            리포트 생성하기 →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

