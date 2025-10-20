/**
 * DetailedReport Component
 * 상세 리포트 탭 콘텐츠
 */

'use client';

import { useState } from 'react';
import Big5RadarChart from '@/components/Big5RadarChart';
import GrowthVectorChart from '@/components/GrowthVectorChart';
import Big5PercentileChart from '@/components/charts/Big5PercentileChart';
import MBTIRatiosChart from '@/components/charts/MBTIRatiosChart';
import Inner9Graphs from '@/components/analysis/Inner9Graphs';
import big5Data from '@/data/big5.json';
import { detailedMBTIAnalysis, detailedRETIAnalysis } from '@/data/detailedAnalysis.js';

interface DetailedReportProps {
  heroData: any;
  inner9Data?: any;
}

export default function DetailedReport({ heroData, inner9Data }: DetailedReportProps) {
  // 상태 관리
  const [expandedStrength, setExpandedStrength] = useState<number | null>(null);
  const [expandedWeakness, setExpandedWeakness] = useState<number | null>(null);
  const [showMBTIDetails, setShowMBTIDetails] = useState(false);
  const [showRETIDetails, setShowRETIDetails] = useState(false);

  // 성장 벡터 계산 함수
  function calculateGrowthVectors(inner9Data: any, heroData: any) {
    const inner9 = inner9Data?.inner9_scores || {};
    
    // Inner9의 9가지 차원을 8가지 성장 벡터로 매핑
    return {
      innate: inner9.creation || 50,      // 선천 - 창조력
      acquired: inner9.will || 50,        // 후천 - 의지력
      conscious: inner9.insight || 50,    // 의식 - 통찰력
      unconscious: inner9.sensitivity || 50, // 무의식 - 감수성
      growth: inner9.growth || 50,        // 성장
      stability: inner9.balance || 50,    // 안정 - 균형
      harmony: inner9.harmony || 50,      // 조화
      individual: inner9.expression || 50, // 개별 - 표현력
    };
  }

  // 강점 상세 설명 데이터
  const strengthDetails: Record<string, { description: string; howToUse: string }> = {
    "영감 전파": {
      description: "당신은 새로운 아이디어와 비전을 다른 사람들에게 효과적으로 전달할 수 있습니다.",
      howToUse: "팀 브레인스토밍 세션을 주도하고, 프로젝트의 방향성을 제시하세요."
    },
    "공감 리더십": {
      description: "타인의 감정을 이해하고 공감하며 팀을 이끌어가는 능력이 뛰어납니다.",
      howToUse: "팀원들의 의견을 경청하고, 감정적 지원을 제공하여 신뢰를 구축하세요."
    },
    "창의적 시도": {
      description: "새로운 방법을 시도하고 혁신적인 해결책을 찾아내는 능력이 있습니다.",
      howToUse: "기존 방식에 도전하고, 실험적인 프로젝트를 주도하세요."
    }
  };

  // 약점 상세 설명 데이터
  const weaknessDetails: Record<string, { description: string; improvement: string }> = {
    "지속성 저하": {
      description: "장기 프로젝트나 반복적인 작업에서 집중력이 떨어질 수 있습니다.",
      improvement: "작은 마일스톤을 설정하고, 정기적인 보상 시스템을 만들어보세요."
    },
    "우선순위 분산": {
      description: "여러 일을 동시에 하려다 중요한 것에 집중하지 못할 수 있습니다.",
      improvement: "매일 아침 가장 중요한 3가지 일을 정하고, 그것부터 처리하세요."
    },
    "감정 과몰입": {
      description: "타인의 문제에 지나치게 감정이입하여 에너지가 소진될 수 있습니다.",
      improvement: "경계를 설정하고, 자신의 감정을 돌보는 시간을 가지세요."
    }
  };

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
            
            {/* Big5 설명 카드 */}
            <div className="grid grid-cols-5 gap-2 mt-4 text-xs">
              {['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map(trait => (
                <div key={trait} className="p-2 bg-white/5 rounded">
                  <div className="font-medium">{big5Data.traits[trait].name}</div>
                  <div className="text-white/60">{big5Data.traits[trait].description}</div>
                  <div className="mt-1 text-emerald-300">높음: {big5Data.traits[trait].high}</div>
                  <div className="text-amber-300">낮음: {big5Data.traits[trait].low}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(heroData.growth || inner9Data) && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📈</span>
              <span>성장 벡터</span>
            </h3>
            <GrowthVectorChart growth={heroData.growth || calculateGrowthVectors(inner9Data, heroData)} />
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
              <li 
                key={idx} 
                className="cursor-pointer hover:bg-emerald-500/10 p-2 rounded transition"
                onClick={() => setExpandedStrength(expandedStrength === idx ? null : idx)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{strength}</span>
                      <span className="text-xs text-white/40">
                        {expandedStrength === idx ? '▲' : '▼'}
                      </span>
                    </div>
                    {expandedStrength === idx && strengthDetails[strength] && (
                      <div className="mt-2 text-sm text-white/70 space-y-1 pl-2 border-l-2 border-emerald-500/30">
                        <p>{strengthDetails[strength].description}</p>
                        <p className="text-emerald-300">
                          💡 활용법: {strengthDetails[strength].howToUse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
              <li 
                key={idx} 
                className="cursor-pointer hover:bg-amber-500/10 p-2 rounded transition"
                onClick={() => setExpandedWeakness(expandedWeakness === idx ? null : idx)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{weakness}</span>
                      <span className="text-xs text-white/40">
                        {expandedWeakness === idx ? '▲' : '▼'}
                      </span>
                    </div>
                    {expandedWeakness === idx && weaknessDetails[weakness] && (
                      <div className="mt-2 text-sm text-white/70 space-y-1 pl-2 border-l-2 border-amber-500/30">
                        <p>{weaknessDetails[weakness].description}</p>
                        <p className="text-amber-300">
                          🎯 개선 방법: {weaknessDetails[weakness].improvement}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
        {/* MBTI 섹션 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">MBTI 유형</h3>
          <div className="text-3xl font-bold text-violet-300 mb-2">
            {heroData.hero?.mbti}
          </div>
          <div className="text-lg text-white/80 mb-2">
            {detailedMBTIAnalysis[heroData.hero?.mbti]?.koreanName}
          </div>
          <p className="text-sm text-white/60 mb-4">
            {detailedMBTIAnalysis[heroData.hero?.mbti]?.detailedDescription}
          </p>
          
          <button 
            onClick={() => setShowMBTIDetails(!showMBTIDetails)}
            className="text-sm text-violet-300 hover:text-violet-200 transition"
          >
            {showMBTIDetails ? '접기 ▲' : '자세히 보기 ▼'}
          </button>
          
          {showMBTIDetails && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="font-medium text-emerald-300 mb-1">강점</div>
                <ul className="list-disc list-inside text-white/70 space-y-1">
                  {detailedMBTIAnalysis[heroData.hero?.mbti]?.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-amber-300 mb-1">도전 과제</div>
                <ul className="list-disc list-inside text-white/70 space-y-1">
                  {detailedMBTIAnalysis[heroData.hero?.mbti]?.challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-blue-300 mb-1">추천 직업</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {detailedMBTIAnalysis[heroData.hero?.mbti]?.careerPaths.map((career, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-white/80 mb-1">관계 패턴</div>
                <p className="text-white/70">
                  {detailedMBTIAnalysis[heroData.hero?.mbti]?.relationships}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RETI 섹션 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">RETI 점수</h3>
          <div className="text-3xl font-bold text-blue-300 mb-2">
            {heroData.hero?.reti?.code} ({heroData.hero?.reti?.score?.toFixed(2)})
          </div>
          <div className="text-lg text-white/80 mb-2">
            {detailedRETIAnalysis[heroData.hero?.reti?.code]?.koreanName}
          </div>
          <p className="text-sm text-white/60 mb-4">
            {detailedRETIAnalysis[heroData.hero?.reti?.code]?.detailedDescription}
          </p>
          
          <button 
            onClick={() => setShowRETIDetails(!showRETIDetails)}
            className="text-sm text-blue-300 hover:text-blue-200 transition"
          >
            {showRETIDetails ? '접기 ▲' : '자세히 보기 ▼'}
          </button>
          
          {showRETIDetails && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="font-medium text-white/80 mb-1">핵심 특성</div>
                <div className="flex flex-wrap gap-2">
                  {detailedRETIAnalysis[heroData.hero?.reti?.code]?.coreTraits.map((trait, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-white/80 text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium text-amber-300 mb-1">성장 과제</div>
                <ul className="list-disc list-inside text-white/70 space-y-1">
                  {detailedRETIAnalysis[heroData.hero?.reti?.code]?.challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

