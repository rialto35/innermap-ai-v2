/**
 * Inner9Overview Component
 * Inner9 분석 결과 표시 (탭 콘텐츠)
 */

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { INNER9_DESCRIPTIONS } from '@/constants/inner9';
import { summarize } from '@/lib/analysis/inner9Narrative';
import { llmPolish, isLLMAvailable } from '@/lib/analysis/inner9LLM';
import { getInner9Config } from '@/config/inner9';

const InnerCompass9 = dynamic(() => import('@/components/charts/InnerCompass9'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
    </div>
  ),
});

interface Inner9OverviewProps {
  inner9Data?: any;
  onRunDemo?: () => void;
}

export default function Inner9Overview({ inner9Data, onRunDemo }: Inner9OverviewProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [narrative, setNarrative] = useState<any>(null);
  const [aiEnhancement, setAiEnhancement] = useState<string>('');

  useEffect(() => {
    // Support multiple shapes: snake_case, camelCase, and raw inner9
    const src = inner9Data?.inner9_scores || inner9Data?.inner9Scores || inner9Data?.inner9;
    if (src) {
      const normalize = (v: any) => {
        const num = Number(v ?? 0);
        if (Number.isNaN(num)) return 0;
        // If value looks like 0..1, convert to percentage
        const val = num <= 1 ? num * 100 : num;
        return Math.max(0, Math.min(100, Math.round(val)));
      };

      const dimensions = [
        { key: 'creation', label: INNER9_DESCRIPTIONS.creation.label, value: normalize(src.creation) },
        { key: 'will', label: INNER9_DESCRIPTIONS.will.label, value: normalize(src.will) },
        { key: 'sensitivity', label: INNER9_DESCRIPTIONS.sensitivity.label, value: normalize(src.sensitivity) },
        { key: 'harmony', label: INNER9_DESCRIPTIONS.harmony.label, value: normalize(src.harmony) },
        { key: 'expression', label: INNER9_DESCRIPTIONS.expression.label, value: normalize(src.expression) },
        { key: 'insight', label: INNER9_DESCRIPTIONS.insight.label, value: normalize(src.insight) },
        { key: 'resilience', label: INNER9_DESCRIPTIONS.resilience.label, value: normalize(src.resilience) },
        { key: 'balance', label: INNER9_DESCRIPTIONS.balance.label, value: normalize(src.balance) },
        { key: 'growth', label: INNER9_DESCRIPTIONS.growth.label, value: normalize(src.growth) },
      ];
      setChartData(dimensions);
      
      // Generate hybrid narrative
      const base = summarize(src);
      setNarrative(base);
      
      // LLM enhancement (if available)
      if (isLLMAvailable() && getInner9Config().useLLMEnhancement) {
        llmPolish(base, src).then(setAiEnhancement);
      }
    }
  }, [inner9Data]);

  // 데이터가 없거나 모든 값이 0인 경우
  const hasValidData = chartData && chartData.some((dim: any) => dim.value > 0);
  
  if (!inner9Data || !hasValidData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-xl font-semibold text-white mb-2">Inner9 분석</h3>
          <p className="text-white/60 text-sm">
            9가지 차원으로 당신의 내면을 탐색합니다
          </p>
        </div>
        {onRunDemo && (
          <button
            onClick={onRunDemo}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-xl hover:scale-105 transition"
          >
            Inner9 데모 실행
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inner9 Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🧭</span>
          <span>Inner Compass (Inner9)</span>
        </h3>
        {chartData && <InnerCompass9 data={chartData} color="#8B5CF6" />}
      </div>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData?.map((dim: any) => (
          <div
            key={dim.key}
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">{dim.label}</span>
              <span className="text-lg font-bold text-violet-300">{Math.round(dim.value)}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                style={{ width: `${dim.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Narrative Summary */}
      {narrative && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span>📖</span>
            <span>당신의 이야기</span>
          </h3>
          
          {/* Rule-based summary */}
          <p className="text-white/80 leading-relaxed mb-4">{narrative.headline}</p>
          
          {/* AI enhancement */}
          {aiEnhancement && (
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 mb-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-1">
                <span>🤖</span>
                <span>AI 코칭 피드백</span>
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">{aiEnhancement}</p>
            </div>
          )}
          
          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Strengths */}
            {narrative.strengths && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-1">
                  <span>💪</span>
                  <span>강점 영역</span>
                </h4>
                <div className="space-y-2">
                  {narrative.strengths.map((strength: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-white/80">{INNER9_DESCRIPTIONS[strength.key as any]?.label || strength.key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-300">{strength.score}</span>
                        <span className="text-xs text-green-200">{strength.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Growth Areas */}
            {narrative.growth && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1">
                  <span>🌱</span>
                  <span>성장 영역</span>
                </h4>
                <div className="space-y-2">
                  {narrative.growth.map((area: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-white/80">{INNER9_DESCRIPTIONS[area.key as any]?.label || area.key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-300">{area.score}</span>
                        <span className="text-xs text-blue-200">{area.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/50 mb-1">엔진 버전</div>
            <div className="font-mono text-violet-300">{inner9Data.engineVersion}</div>
          </div>
          <div>
            <div className="text-white/50 mb-1">모델 버전</div>
            <div className="font-mono text-violet-300">{inner9Data.modelVersion}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

