/**
 * /report/[id]
 * 
 * Deep Report Page
 * - Shows report status (queued/running/ready/failed)
 * - Displays narrative + visualizations when ready
 * - Share link & download options
 */

import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Suspense fallback={<ReportSkeleton />}>
          <ReportContent reportId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function ReportContent({ reportId }: { reportId: string }) {
  // TODO M2: Fetch report from API
  // const report = await fetchReport(reportId);
  
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Deep Report
        </h1>
        <p className="text-gray-600">
          Report ID: {reportId}
        </p>
      </header>
      
      {/* TODO: Add status badge */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <p className="text-gray-700 font-medium">
            Generating your personalized report...
          </p>
        </div>
        <p className="text-gray-500 text-center mt-4 text-sm">
          This usually takes 30-60 seconds
        </p>
      </div>
      
      {/* TODO M2: Add narrative, visuals, share/download */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-500 text-center">
          Report display coming in M2 (Sprint 2)
        </p>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-2xl"></div>
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
      <div className="h-96 bg-gray-200 rounded-2xl"></div>
    </div>
  );
}

