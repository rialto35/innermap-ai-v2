/**
 * Unified Progress Component
 * 
 * Shows progress bar, current question, estimated time left
 * Updated for dark theme (/test/* pages)
 */

'use client';

import { formatTime } from '@/lib/utils';

interface UnifiedProgressProps {
  current: number;
  total: number;
  answered: number;
  estimatedTimeLeft: number; // seconds
}

export default function UnifiedProgress({
  current,
  total,
  answered,
  estimatedTimeLeft
}: UnifiedProgressProps) {
  const progress = Math.round((answered / total) * 100);
  
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-6">
          <span className="text-white/70">
            <span className="font-semibold text-white">{answered}</span>
            <span className="text-white/50"> / {total}</span>
          </span>
          <span className="text-white/70">
            {progress}% 완료
          </span>
        </div>
        
        <div className="text-white/60">
          예상 남은 시간: <span className="font-medium text-white/80">{formatTime(estimatedTimeLeft)}</span>
        </div>
      </div>
    </div>
  );
}
