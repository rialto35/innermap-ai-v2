/**
 * ReportStatus
 * 
 * 리포트 생성 상태 표시 컴포넌트
 * - queued, processing, ready, failed 상태별 UI
 * - 진행 애니메이션
 * - 예상 소요 시간
 * 
 * @version v1.1.0
 */

'use client';

interface ReportStatusProps {
  status: 'queued' | 'processing' | 'ready' | 'failed';
  error?: string;
  estimatedTimeRemaining?: number; // seconds
  onRetry?: () => void;
}

export default function ReportStatus({
  status,
  error,
  estimatedTimeRemaining,
  onRetry
}: ReportStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'queued':
        return {
          icon: '⏳',
          title: '대기 중',
          message: '곧 생성을 시작합니다...',
          color: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          showSpinner: true
        };
      case 'processing':
        return {
          icon: '⚡',
          title: '생성 중',
          message: 'AI가 당신의 리포트를 작성하고 있습니다...',
          color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-300',
          showSpinner: true
        };
      case 'ready':
        return {
          icon: '✅',
          title: '완료',
          message: '리포트가 준비되었습니다!',
          color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
          textColor: 'text-green-700 dark:text-green-300',
          showSpinner: false
        };
      case 'failed':
        return {
          icon: '❌',
          title: '생성 실패',
          message: error || '리포트 생성 중 오류가 발생했습니다.',
          color: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-300',
          showSpinner: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`${config.color} border-2 rounded-xl p-6 mb-6`}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-4xl">
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className={`text-xl font-bold ${config.textColor} mb-1`}>
            {config.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {config.message}
          </p>

          {/* Estimated time */}
          {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              예상 대기 시간: 약 {estimatedTimeRemaining}초
            </p>
          )}
        </div>

        {/* Spinner or Retry button */}
        <div>
          {config.showSpinner && (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          )}
          {status === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>

      {/* Progress bar (for processing) */}
      {status === 'processing' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

