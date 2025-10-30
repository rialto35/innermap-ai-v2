/**
 * Inner9Overview Component
 * Inner9 분석 결과 표시 (탭 콘텐츠)
 */

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { INNER9_DESCRIPTIONS } from '@/constants/inner9';
import { generateRichNarrative } from '@/lib/analysis/inner9Narrative';
import DimensionCard from '@/components/inner9/DimensionCard';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
      
      // Generate basic narrative (synchronous, rule-based)
      const mbti = inner9Data?.mbti || inner9Data?.summary?.mbti;
      const richNarrative = generateRichNarrative(src, mbti);
      setNarrative(richNarrative);
      
      // Fetch AI-enhanced story from server (async)
      if (richNarrative._meta) {
        fetch('/api/inner9/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inner9Scores: src,
            personalityType: richNarrative.personalityType,
            topDimension: richNarrative._meta.topDimension,
            lowDimension: richNarrative._meta.lowDimension,
            avg: richNarrative.average,
            mbti: richNarrative._meta.mbti
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.story) {
            console.log('✅ AI story loaded:', data.story.length, 'chars');
            // Update narrative with AI story
            setNarrative((prev: any) => prev ? { ...prev, detailedStory: data.story } : prev);
          }
        })
        .catch(error => {
          console.warn('⚠️ AI story generation failed, keeping rule-based story:', error);
        });
      }
      
      // Try to get LLM enhancement from server
      fetch('/api/analyze/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: src })
      })
      .then(res => res.json())
      .then(data => {
        if (data.aiEnhancement) {
          setAiEnhancement(data.aiEnhancement);
        }
      })
      .catch(error => {
        console.log('LLM enhancement not available:', error);
        // Continue without LLM enhancement
      })
      .finally(() => {
        // 데이터가 반영된 뒤에만 프로그래스 종료
        setIsAnalyzing(false);
      });
      
      // 데이터가 있으면 즉시 로딩 상태 해제
      setIsAnalyzing(false);
    }
  }, [inner9Data]);

  // 데이터가 없거나 모든 값이 0인 경우
  const hasValidData = chartData && chartData.some((dim: any) => dim.value > 0);
  
  // 로딩 상태 UI (컴팩트 버전)
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center" data-testid="inner9-loading">
        <div className="mb-6">
          {/* 애니메이션 - 크기 축소 */}
          <div className="mb-6 relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-3 border-violet-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          {/* 텍스트 - 크기 축소 */}
          <h3 className="text-xl font-semibold text-white mb-2">
            AI가 당신을 분석하고 있습니다
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Inner9 9가지 차원으로 당신의 내면을 탐색하는 중...
          </p>
          
          {/* 현재 상태 */}
          <p className="text-violet-400 text-sm mb-4">
            {analysisProgress < 20 && "Big5 데이터 분석 중..."}
            {analysisProgress >= 20 && analysisProgress < 40 && "MBTI/RETI 가중치 적용 중..."}
            {analysisProgress >= 40 && analysisProgress < 60 && "Inner9 점수 계산 중..."}
            {analysisProgress >= 60 && analysisProgress < 80 && "내러티브 생성 중..."}
            {analysisProgress >= 80 && analysisProgress < 90 && "AI 분석 생성 중..."}
            {analysisProgress >= 90 && analysisProgress < 100 && "AI가 최종 분석을 완성하고 있습니다..."}
            {analysisProgress === 100 && "분석 완료!"}
          </p>

          {/* 진행률 바 */}
          <div className="w-full bg-slate-700/30 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          {/* 진행 단계 - 컴팩트 */}
          <div className="flex justify-center space-x-2 mb-2">
            {[20, 40, 60, 80, 100].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  analysisProgress >= step 
                    ? 'bg-violet-400' 
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/40 mb-2">{analysisProgress}% 완료</p>
          <p className="text-[11px] text-white/30">분석이 완료될 때까지 창을 닫지 마세요</p>
        </div>
      </div>
    );
  }

  if (!inner9Data || !hasValidData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-xl font-semibold text-white mb-2">Inner9 분석 결과가 없습니다</h3>
          <p className="text-white/60 text-sm mb-4">
            검사를 완료하면 9가지 차원으로 당신의 내면을 탐색할 수 있습니다
          </p>
          <Link
            href="/test/quick"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            검사 시작하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inner9 Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6" data-testid="inner9-chart">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🧭</span>
          <span>Inner Compass (Inner9)</span>
        </h3>
        {chartData && <InnerCompass9 data={chartData} color="#8B5CF6" />}
      </div>

      {/* Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartData?.map((dim: any) => (
          <DimensionCard
            key={dim.key}
            dimensionKey={dim.key}
            label={dim.label}
            value={dim.value}
            data-testid="inner9-dimension"
          />
        ))}
      </div>

      {/* Enhanced Narrative Summary */}
      {narrative && (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-purple-500/5 p-5 sm:p-6 backdrop-blur-sm" data-testid="inner9-interpretation">
          {/* 섹션 제목 - text-lg (다른 페이지와 일관성) */}
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📖</span>
            <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              당신의 이야기
            </span>
          </h3>
          
          {/* Personality Type Badge - text-sm (다른 페이지와 일관성) */}
          {narrative.personalityType && (
            <div className="mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl sm:rounded-2xl border border-purple-400/40 shadow-lg shadow-purple-500/20">
                <span className="text-xl sm:text-2xl">
                  {narrative.personalityType === 'visionary' && '🔮'}
                  {narrative.personalityType === 'achiever' && '🎯'}
                  {narrative.personalityType === 'empath' && '💝'}
                  {narrative.personalityType === 'innovator' && '🚀'}
                  {narrative.personalityType === 'balanced' && '⚖️'}
                </span>
                <span className="text-purple-200 text-sm sm:text-base font-bold">
                  {narrative.personalityType === 'visionary' && '비전형 인재'}
                  {narrative.personalityType === 'achiever' && '성취형 인재'}
                  {narrative.personalityType === 'empath' && '감성형 인재'}
                  {narrative.personalityType === 'innovator' && '혁신형 인재'}
                  {narrative.personalityType === 'balanced' && '조화형 인재'}
                </span>
              </div>
            </div>
          )}
          
          {/* Detailed Story - text-sm, 가독성 개선 (단락 구분, 줄바꿈 2번) */}
          {narrative.detailedStory && (
            <div className="mb-5 sm:mb-6 p-4 sm:p-5 bg-gradient-to-br from-slate-800/70 to-slate-700/70 rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl flex-shrink-0">✨</span>
                <h4 className="text-xs sm:text-sm font-semibold text-purple-300 uppercase tracking-wide">핵심 인사이트</h4>
              </div>
              {/* 가독성 개선: leading-7 (1.75rem), 단락 구분 whitespace-pre-line */}
              <p className="text-white/95 text-sm sm:text-base leading-7 pl-7 sm:pl-9 whitespace-pre-line">
                {narrative.detailedStory}
              </p>
            </div>
          )}
          
          {/* Rule-based summary - text-xs (중요도 낮음) */}
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{narrative.headline}</p>
          </div>
          
          {/* AI enhancement - text-xs */}
          {aiEnhancement && (
            <div className="rounded-lg sm:rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 sm:p-4 mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-purple-300 mb-2 flex items-center gap-1">
                <span>🤖</span>
                <span>AI 코칭 피드백</span>
              </h4>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{aiEnhancement}</p>
            </div>
          )}
          
          {/* Strengths & Growth Areas - text-sm (헤딩), text-xs (항목) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-5 sm:mt-6">
            {/* Strengths */}
            {narrative.strengths && (
              <div className="rounded-xl sm:rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-4 sm:p-6 shadow-lg">
                <h4 className="text-sm sm:text-base font-bold text-green-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">💪</span>
                  <span>강점 영역</span>
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {narrative.strengths.map((strength: any, idx: number) => (
                    <div key={idx} className="group p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-green-500/20 hover:border-green-500/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-medium text-white/90">
                          {INNER9_DESCRIPTIONS[strength.key as keyof typeof INNER9_DESCRIPTIONS]?.label || strength.key}
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                            <span className="text-xs sm:text-sm font-bold text-green-300">{strength.score}</span>
                          </div>
                          <span className="text-[10px] sm:text-xs font-semibold text-green-200 uppercase">{strength.label}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Growth Areas */}
            {narrative.growth && (
              <div className="rounded-xl sm:rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4 sm:p-6 shadow-lg">
                <h4 className="text-sm sm:text-base font-bold text-blue-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🌱</span>
                  <span>성장 영역</span>
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {narrative.growth.map((area: any, idx: number) => (
                    <div key={idx} className="group p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-blue-500/20 hover:border-blue-500/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm font-medium text-white/90">
                          {INNER9_DESCRIPTIONS[area.key as keyof typeof INNER9_DESCRIPTIONS]?.label || area.key}
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                            <span className="text-xs sm:text-sm font-bold text-blue-300">{area.score}</span>
                          </div>
                          <span className="text-[10px] sm:text-xs font-semibold text-blue-200 uppercase">{area.label}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${area.score}%` }}
                        />
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

