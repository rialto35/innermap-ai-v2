/**
 * ReportActions
 * 
 * 리포트 액션 버튼들
 * - PDF 다운로드 (다음 PR)
 * - 공유 링크 (다음 PR)
 * - 대시보드로 돌아가기
 * 
 * @version v1.1.0
 */

'use client';

import Link from 'next/link';

interface ReportActionsProps {
  reportId: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
}

export default function ReportActions({ reportId, status }: ReportActionsProps) {
  const canDownload = status === 'ready';
  const canShare = status === 'ready';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        액션
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition"
        >
          ← 대시보드로
        </Link>

        {/* PDF Download (disabled for now) */}
        <button
          disabled={!canDownload}
          className={`px-6 py-3 rounded-lg transition ${
            canDownload
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => {
            if (canDownload) {
              alert('PDF 다운로드 기능은 다음 업데이트에서 제공됩니다.');
            }
          }}
        >
          📄 PDF 다운로드
        </button>

        {/* Share Link (disabled for now) */}
        <button
          disabled={!canShare}
          className={`px-6 py-3 rounded-lg transition ${
            canShare
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => {
            if (canShare) {
              alert('공유 링크 기능은 다음 업데이트에서 제공됩니다.');
            }
          }}
        >
          🔗 공유하기
        </button>
      </div>

      {!canDownload && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          리포트 생성이 완료되면 PDF 다운로드 및 공유가 가능합니다.
        </p>
      )}
    </div>
  );
}

