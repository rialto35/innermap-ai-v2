/**
 * Unified Progress Component
 * 
 * Shows progress bar, current question, estimated time left
 */

'use client';

import { formatTime } from '@/lib/utils';

interface UnifiedProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  estimatedTimeLeft: number; // seconds
}

export default function UnifiedProgress({
  currentIndex,
  totalQuestions,
  answeredCount,
  estimatedTimeLeft
}: UnifiedProgressProps) {
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-6">
          <span className="text-gray-600">
            <span className="font-semibold text-indigo-600">{answeredCount}</span>
            <span className="text-gray-400"> / {totalQuestions}</span>
          </span>
          <span className="text-gray-600">
            {progress}% 완료
          </span>
        </div>
        
        <div className="text-gray-500">
          예상 남은 시간: <span className="font-medium">{formatTime(estimatedTimeLeft)}</span>
        </div>
      </div>
    </div>
  );
}

