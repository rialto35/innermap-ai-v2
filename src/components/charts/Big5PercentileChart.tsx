'use client';

import { useMemo } from 'react';
import type { Big5Percentiles } from '@/lib/types';

interface Big5PercentileChartProps {
  percentiles: Big5Percentiles;
  className?: string;
}

const BIG5_LABELS: Record<keyof Big5Percentiles, { ko: string; en: string; color: string; desc: string }> = {
  O: {
    ko: '개방성',
    en: 'Openness',
    color: 'from-purple-500 to-pink-500',
    desc: '새로운 경험과 아이디어에 대한 개방성'
  },
  C: {
    ko: '성실성',
    en: 'Conscientiousness',
    color: 'from-blue-500 to-cyan-500',
    desc: '목표 지향적이고 조직적인 성향'
  },
  E: {
    ko: '외향성',
    en: 'Extraversion',
    color: 'from-orange-500 to-yellow-500',
    desc: '사교적이고 활동적인 성향'
  },
  A: {
    ko: '친화성',
    en: 'Agreeableness',
    color: 'from-green-500 to-emerald-500',
    desc: '협력적이고 공감적인 성향'
  },
  N: {
    ko: '신경성',
    en: 'Neuroticism',
    color: 'from-red-500 to-rose-500',
    desc: '정서적 안정성 (낮을수록 안정적)'
  },
};

export default function Big5PercentileChart({ percentiles, className = '' }: Big5PercentileChartProps) {
  const sortedFactors = useMemo(() => {
    return (Object.entries(percentiles) as [keyof Big5Percentiles, number][])
      .sort((a, b) => b[1] - a[1]);
  }, [percentiles]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Big5 성격 요인 분석</h3>
        <p className="text-white/60 text-sm">
          각 성격 요인의 백분위수 (0-100)를 나타냅니다
        </p>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {sortedFactors.map(([factor, value]) => {
          const info = BIG5_LABELS[factor];
          const isHigh = value > 60;
          const isLow = value < 40;
          
          return (
            <div key={factor} className="group">
              {/* Label */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{info.ko}</span>
                  <span className="text-sm text-white/50">{info.en}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-sm text-white/60">%</span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${info.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                
                {/* Percentage markers */}
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-white/30">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition">
                {info.desc}
                {isHigh && ' - 높은 수준'}
                {isLow && ' - 낮은 수준'}
              </p>

              {/* Interpretation badge */}
              {(isHigh || isLow) && (
                <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  isHigh 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {isHigh ? '강점 영역' : '성장 기회'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>해석 가이드</span>
        </h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-green-400">•</span>
            <span><strong className="text-white">60% 이상:</strong> 해당 특성이 강하게 나타나는 영역입니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span><strong className="text-white">40% 미만:</strong> 반대 특성이 강하게 나타나는 영역입니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span><strong className="text-white">40-60%:</strong> 균형 잡힌 중간 영역입니다</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Compact version for dashboard cards
 */
export function Big5PercentileCompact({ percentiles, className = '' }: Big5PercentileChartProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {(Object.entries(percentiles) as [keyof Big5Percentiles, number][]).map(([factor, value]) => {
        const info = BIG5_LABELS[factor];
        
        return (
          <div key={factor} className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-white/80">{info.ko}</div>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-bold text-white">{value}%</div>
          </div>
        );
      })}
    </div>
  );
}

