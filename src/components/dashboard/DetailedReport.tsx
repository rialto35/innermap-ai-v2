/**
 * DetailedReport Component
 * 상세 리포트 탭 콘텐츠
 */

'use client';

import Big5RadarChart from '@/components/Big5RadarChart';
import GrowthVectorChart from '@/components/GrowthVectorChart';
import Big5PercentileChart from '@/components/charts/Big5PercentileChart';
import MBTIRatiosChart from '@/components/charts/MBTIRatiosChart';
import Inner9Graphs from '@/components/analysis/Inner9Graphs';

interface DetailedReportProps {
  heroData: any;
  inner9Data?: any;
}

export default function DetailedReport({ heroData, inner9Data }: DetailedReportProps) {
  if (!heroData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-white mb-2">상세 리포트</h3>
        <p className="text-white/60 text-sm">분석 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Big5 & Growth Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {heroData.big5 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🌌</span>
              <span>Big5 레이더</span>
            </h3>
            <Big5RadarChart big5={heroData.big5} />
          </div>
        )}

        {heroData.growth && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📈</span>
              <span>성장 벡터</span>
            </h3>
            <GrowthVectorChart growth={heroData.growth} />
          </div>
        )}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>강점</span>
          </h3>
          <ul className="space-y-2">
            {heroData.strengths?.map((strength: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-white/80">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="text-lg font-semibold text-amber-300 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>성장 영역</span>
          </h3>
          <ul className="space-y-2">
            {heroData.weaknesses?.map((weakness: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-white/80">
                <span className="text-amber-400 mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Inner9 Analysis Section */}
      {inner9Data && (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <h3 className="text-lg font-semibold text-violet-300 mb-4 flex items-center gap-2">
            <span>🧭</span>
            <span>Inner9 내면 분석</span>
          </h3>
          
          {/* Inner9 Scores Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {inner9Data.inner9_scores && Object.entries(inner9Data.inner9_scores).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-violet-300">{Math.round(value)}</div>
                <div className="text-xs text-white/60 capitalize">{key}</div>
                <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-blue-500 h-1 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Inner9 Narrative */}
          {inner9Data.narrative && (
            <div className="space-y-4">
              <div className="text-sm text-white/80">
                <strong className="text-violet-300">핵심 특성:</strong> {inner9Data.narrative.headline}
              </div>
              
              {inner9Data.narrative.strengths && inner9Data.narrative.strengths.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-emerald-300 mb-2">강점 영역</div>
                  <div className="flex flex-wrap gap-2">
                    {inner9Data.narrative.strengths.map((strength: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                        {strength.key} ({strength.score}점)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {inner9Data.narrative.growth && inner9Data.narrative.growth.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-amber-300 mb-2">성장 영역</div>
                  <div className="flex flex-wrap gap-2">
                    {inner9Data.narrative.growth.map((growth: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                        {growth.key} ({growth.score}점)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inner9 Graphs (Combined Big5 Percentiles + MBTI Ratios) */}
      {heroData.big5Percentiles && heroData.mbtiRatios && (
        <Inner9Graphs
          big5Percentiles={heroData.big5Percentiles}
          mbtiRatios={heroData.mbtiRatios}
        />
      )}

      {/* MBTI & RETI Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">MBTI 유형</h3>
          <div className="text-3xl font-bold text-violet-300 mb-2">{heroData.hero?.mbti}</div>
          <p className="text-sm text-white/60">
            당신의 성격 유형은 {heroData.hero?.mbti}입니다
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">RETI 점수</h3>
          <div className="text-3xl font-bold text-blue-300 mb-2">
            {heroData.hero?.reti?.code} ({heroData.hero?.reti?.score?.toFixed(2)})
          </div>
          <p className="text-sm text-white/60">정서 지능 지수</p>
        </div>
      </div>
    </div>
  );
}

