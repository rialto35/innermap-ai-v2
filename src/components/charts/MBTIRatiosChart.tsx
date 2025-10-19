'use client';

import type { MBTIRatios } from '@/lib/types';

interface MBTIRatiosChartProps {
  ratios: MBTIRatios;
  mbtiType: string;
  className?: string;
}

const MBTI_AXES = {
  EI: { left: 'E (외향)', right: 'I (내향)', leftFull: '외향성', rightFull: '내향성' },
  SN: { left: 'S (감각)', right: 'N (직관)', leftFull: '감각형', rightFull: '직관형' },
  TF: { left: 'T (사고)', right: 'F (감정)', leftFull: '사고형', rightFull: '감정형' },
  JP: { left: 'J (판단)', right: 'P (인식)', leftFull: '판단형', rightFull: '인식형' },
};

export default function MBTIRatiosChart({ ratios, mbtiType, className = '' }: MBTIRatiosChartProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          MBTI 유형: <span className="text-violet-400">{mbtiType}</span>
        </h3>
        <p className="text-white/60 text-sm">
          각 축의 선호도 비율을 나타냅니다
        </p>
      </div>

      {/* Axes */}
      <div className="space-y-6">
        {(Object.entries(ratios) as [keyof MBTIRatios, number][]).map(([axis, value]) => {
          const axisInfo = MBTI_AXES[axis];
          const leftValue = value;
          const rightValue = 100 - value;
          const preference = mbtiType[axis === 'EI' ? 0 : axis === 'SN' ? 1 : axis === 'TF' ? 2 : 3];
          const isLeftPreferred = preference === axis[0];
          
          return (
            <div key={axis} className="space-y-2">
              {/* Labels */}
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${isLeftPreferred ? 'text-white' : 'text-white/50'}`}>
                  {axisInfo.left}
                </span>
                <span className="text-white/40 text-xs">{axis}</span>
                <span className={`font-medium ${!isLeftPreferred ? 'text-white' : 'text-white/50'}`}>
                  {axisInfo.right}
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-10 bg-white/5 rounded-full overflow-hidden">
                {/* Left side (E/S/T/J) */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-end pr-3 transition-all duration-700"
                  style={{ width: `${leftValue}%` }}
                >
                  {leftValue > 15 && (
                    <span className="text-sm font-bold text-white">{leftValue}%</span>
                  )}
                </div>

                {/* Right side (I/N/F/P) */}
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-500 to-cyan-500 flex items-center justify-start pl-3 transition-all duration-700"
                  style={{ width: `${rightValue}%` }}
                >
                  {rightValue > 15 && (
                    <span className="text-sm font-bold text-white">{rightValue}%</span>
                  )}
                </div>

                {/* Center line */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
              </div>

              {/* Interpretation */}
              <div className="text-center text-xs text-white/60">
                {isLeftPreferred ? (
                  <span>{axisInfo.leftFull} 선호 ({leftValue}%)</span>
                ) : (
                  <span>{axisInfo.rightFull} 선호 ({rightValue}%)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>🎯</span>
          <span>성향 분석</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {(Object.entries(ratios) as [keyof MBTIRatios, number][]).map(([axis, value]) => {
            const axisInfo = MBTI_AXES[axis];
            const preference = mbtiType[axis === 'EI' ? 0 : axis === 'SN' ? 1 : axis === 'TF' ? 2 : 3];
            const isLeftPreferred = preference === axis[0];
            const strength = Math.abs(value - 50);
            
            let strengthLabel = '';
            if (strength > 30) strengthLabel = '매우 강함';
            else if (strength > 15) strengthLabel = '강함';
            else if (strength > 5) strengthLabel = '약간';
            else strengthLabel = '균형';

            return (
              <div key={axis} className="p-3 rounded-lg bg-white/5">
                <div className="font-medium text-white mb-1">
                  {isLeftPreferred ? axisInfo.leftFull : axisInfo.rightFull}
                </div>
                <div className="text-white/60">{strengthLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for cards
 */
export function MBTIRatiosCompact({ ratios, mbtiType, className = '' }: MBTIRatiosChartProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {(Object.entries(ratios) as [keyof MBTIRatios, number][]).map(([axis, value]) => {
        const axisInfo = MBTI_AXES[axis];
        const preference = mbtiType[axis === 'EI' ? 0 : axis === 'SN' ? 1 : axis === 'TF' ? 2 : 3];
        const isLeftPreferred = preference === axis[0];
        const displayValue = isLeftPreferred ? value : 100 - value;
        
        return (
          <div key={axis} className="flex items-center gap-2 text-xs">
            <span className="w-8 text-white/60">{axis}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${isLeftPreferred ? 'bg-violet-500' : 'bg-blue-500'} rounded-full transition-all duration-500`}
                style={{ width: `${displayValue}%` }}
              />
            </div>
            <span className="w-10 text-right text-white font-medium">{displayValue}%</span>
          </div>
        );
      })}
    </div>
  );
}

