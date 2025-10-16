/**
 * /results/[id]
 * 
 * Result Snapshot Page
 * - Displays Big5, MBTI, RETI scores
 * - Shows tribe, stone, hero matching
 * - Instant summary (no async wait)
 * - Link to generate deep report
 */

import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Suspense fallback={<ResultSkeleton />}>
          <ResultContent resultId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function ResultContent({ resultId }: { resultId: string }) {
  // TODO PR #3: Fetch result from API
  // const result = await fetchResult(resultId);
  
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your InnerMap Result
        </h1>
        <p className="text-gray-600">
          Result ID: {resultId}
        </p>
      </header>
      
      {/* TODO: Add result sections */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-500 text-center">
          Result snapshot display coming in PR #3
        </p>
      </div>
      
      {/* Generate Report CTA */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">
          Want a Deep Report?
        </h2>
        <p className="mb-6">
          Get narrative insights and detailed visualizations
        </p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Generate Report
        </button>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-2xl"></div>
      <div className="h-96 bg-gray-200 rounded-2xl"></div>
      <div className="h-48 bg-gray-200 rounded-2xl"></div>
    </div>
  );
}

