/**
 * Live Preview Component
 * 
 * Shows real-time personality preview as user answers
 */

'use client';

import dynamic from 'next/dynamic';
import { getBig5Preview, getMBTIPreview } from '@/lib/analyze/transform';

const MiniRadarChart = dynamic(() => import('./MiniRadarChart'), { ssr: false });

interface LivePreviewProps {
  answers: Record<string, number>;
  answeredCount: number;
  minAnswersForPreview?: number;
}

export default function LivePreview({
  answers,
  answeredCount,
  minAnswersForPreview = 15
}: LivePreviewProps) {
  
  // Only show after minimum answers
  if (answeredCount < minAnswersForPreview) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <div className="text-gray-400 mb-2">🔮</div>
        <p className="text-sm text-gray-500">
          {minAnswersForPreview - answeredCount}개 더 답변하시면<br />
          실시간 미리보기를 확인하실 수 있습니다
        </p>
      </div>
    );
  }
  
  const big5 = getBig5Preview(answers);
  const mbti = getMBTIPreview(answers);
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          실시간 미리보기
        </h3>
        <span className="text-xs text-indigo-600 bg-white px-3 py-1 rounded-full">
          임시 결과
        </span>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mini Radar */}
        <div className="bg-white rounded-xl p-4">
          <div className="h-48">
            <MiniRadarChart big5={big5} />
          </div>
        </div>
        
        {/* MBTI Preview */}
        <div className="bg-white rounded-xl p-6 flex flex-col justify-center">
          <div className="text-sm text-gray-600 mb-2">예상 MBTI</div>
          <div className="text-4xl font-bold text-indigo-600 mb-3">{mbti}</div>
          <p className="text-xs text-gray-500">
            * 최종 결과는 제출 후 확인하실 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}

