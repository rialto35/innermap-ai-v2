/**
 * DetailedReport Component
 * 상세 리포트 탭 콘텐츠 - 통합 분석 시스템
 */

'use client';

import { useEffect, useState } from 'react';
import Big5RadarChart from '@/components/Big5RadarChart';
import GrowthVectorChart from '@/components/GrowthVectorChart';
import Inner9Graphs from '@/components/analysis/Inner9Graphs';
import big5Data from '@/data/big5.json';
import { detailedMBTIAnalysis, detailedRETIAnalysis } from '@/data/detailedAnalysis.js';

interface DetailedReportProps {
  heroData: any;
}

export default function DetailedReport({ heroData }: DetailedReportProps) {
  // 상태 관리 - MBTI/RETI 기본 펼침 상태
  const [showMBTIDetails, setShowMBTIDetails] = useState(true);
  const [showRETIDetails, setShowRETIDetails] = useState(true);
  const [flags, setFlags] = useState<{ confidenceBadge?: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/flags')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setFlags(j?.flags ?? null))
      .catch(() => setFlags(null));
  }, []);

  const mbtiConfidence = (() => {
    // 서버에서 전달된 값이 있으면 우선 사용
    const fromServer = (heroData as any)?.mbtiConfidence;
    if (fromServer) return fromServer;
    // 없으면 Big5 기반 간이 계산(0~100 스케일 가정)
    const b5 = heroData?.big5;
    if (!b5) return null;
    const axes = {
      EI: Math.max(0, Math.min(100, b5.E ?? b5.e ?? 0)),
      SN: Math.max(0, Math.min(100, 100 - (b5.O ?? b5.o ?? 0))),
      TF: Math.max(0, Math.min(100, 100 - (b5.A ?? b5.a ?? 0))),
      JP: Math.max(0, Math.min(100, b5.C ?? b5.c ?? 0)),
    };
    const boundary = Object.values(axes).some((v) => v >= 45 && v <= 55);
    const perAxisConfidence = Object.values(axes).map((v) => Math.abs(v - 50) / 50);
    const confidence = Math.round((perAxisConfidence.reduce((a, b) => a + b, 0) / perAxisConfidence.length) * 100);
    return { axes, boundary, confidence };
  })();

  if (!heroData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-white mb-2">상세 리포트</h3>
        <p className="text-white/60 text-sm">분석 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 통합 분석 데이터 체크
  const hasAnyStrengths = 
    (heroData.analysis?.big5?.strengths?.length > 0) ||
    (heroData.analysis?.inner9?.strengths?.length > 0) ||
    (heroData.analysis?.mbti?.strengths?.length > 0) ||
    (heroData.analysis?.reti?.coreTraits?.length > 0);

  const hasAnyWeaknesses = 
    (heroData.analysis?.big5?.weaknesses?.length > 0) ||
    (heroData.analysis?.inner9?.growthAreas?.length > 0) ||
    (heroData.analysis?.mbti?.challenges?.length > 0) ||
    (heroData.analysis?.reti?.challenges?.length > 0);

  return (
    <div className="space-y-6">
      {/* Confidence badge (flag-guarded, dev/preview only usage) */}
      {flags?.confidenceBadge && mbtiConfidence && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-white/80 flex items-center gap-2">
            <span className="text-violet-300">MBTI 확신도</span>
            <span className="font-semibold text-white">{mbtiConfidence.confidence}%</span>
            {mbtiConfidence.boundary && (
              <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 text-xs border border-amber-500/30">경계 영역</span>
            )}
          </div>
          {mbtiConfidence.boundary ? (
            <button disabled className="cursor-not-allowed rounded-md bg-white/10 px-3 py-1.5 text-xs text-white/70 border border-white/15">
              정밀화 3문항 (준비중)
            </button>
          ) : (
            <span className="text-xs text-white/40">안정</span>
          )}
        </div>
      )}
      {/* 1. Big5 레이더 차트 (독립) */}
      {heroData.big5 && (
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🌌</span>
            <span>Big5 레이더</span>
          </h3>
          <Big5RadarChart big5={heroData.big5} />
        </div>
      )}

      {/* 2. Big5 5가지 특성 상세 설명 (별도 그리드) */}
      {heroData.big5 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
          {['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map(trait => (
            <div key={trait} className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold text-sm sm:text-base text-white mb-2">
                {big5Data.traits[trait as keyof typeof big5Data.traits].name}
              </h4>
              <p className="text-xs sm:text-sm text-white/60 mb-2">
                {big5Data.traits[trait as keyof typeof big5Data.traits].description}
              </p>
              <div className="space-y-1 text-xs">
                <div className="text-emerald-300">
                  높음: {big5Data.traits[trait as keyof typeof big5Data.traits].high}
                </div>
                <div className="text-amber-300">
                  낮음: {big5Data.traits[trait as keyof typeof big5Data.traits].low}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 통합 강점 섹션 */}
      <div className="rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-emerald-300 mb-4 sm:mb-6 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">✨</span>
          <span>통합 강점 분석</span>
        </h3>
        
        {/* Big5 강점 */}
        {heroData.analysis?.big5?.strengths?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-emerald-300 mb-2 flex items-center gap-2">
              <span>🌌</span>
              <span>Big5 기반 강점</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.big5.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Inner9 강점 */}
        {heroData.analysis?.inner9?.strengths?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-emerald-300 mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>Inner9 강점 영역</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.inner9.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* MBTI 강점 */}
        {heroData.analysis?.mbti?.strengths?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-emerald-300 mb-2 flex items-center gap-2">
              <span>🧩</span>
              <span>MBTI 강점</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.mbti.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* RETI 핵심 특성 */}
        {heroData.analysis?.reti?.coreTraits?.length > 0 && (
          <div>
            <h4 className="text-sm sm:text-base font-medium text-emerald-300 mb-2 flex items-center gap-2">
              <span>💎</span>
              <span>RETI 핵심 특성</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {heroData.analysis.reti.coreTraits.map((trait: string, idx: number) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 bg-emerald-500/20 rounded-lg text-sm sm:text-base text-emerald-300 border border-emerald-500/30"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 데이터 없을 때 */}
        {!hasAnyStrengths && (
          <p className="text-white/60 text-sm sm:text-base">
            분석 중... 강점 데이터를 추출하고 있습니다.
          </p>
        )}
      </div>

      {/* 4. 통합 성장영역 섹션 */}
      <div className="rounded-xl sm:rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-amber-300 mb-4 sm:mb-6 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">⚠️</span>
          <span>통합 성장 영역</span>
        </h3>
        
        {/* Big5 약점 */}
        {heroData.analysis?.big5?.weaknesses?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-amber-300 mb-2 flex items-center gap-2">
              <span>🌌</span>
              <span>Big5 성장 영역</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.big5.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Inner9 성장영역 */}
        {heroData.analysis?.inner9?.growthAreas?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-amber-300 mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>Inner9 성장 영역</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.inner9.growthAreas.map((area: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* MBTI 도전과제 */}
        {heroData.analysis?.mbti?.challenges?.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium text-amber-300 mb-2 flex items-center gap-2">
              <span>🧩</span>
              <span>MBTI 도전 과제</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.mbti.challenges.map((challenge: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* RETI 성장과제 */}
        {heroData.analysis?.reti?.challenges?.length > 0 && (
          <div>
            <h4 className="text-sm sm:text-base font-medium text-amber-300 mb-2 flex items-center gap-2">
              <span>💎</span>
              <span>RETI 성장 과제</span>
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {heroData.analysis.reti.challenges.map((challenge: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-white/80">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 데이터 없을 때 */}
        {!hasAnyWeaknesses && (
          <p className="text-white/60 text-sm sm:text-base">
            분석 중... 성장 영역 데이터를 추출하고 있습니다.
          </p>
        )}
      </div>

      {/* 5. Growth Vector Chart */}
      {heroData.growth && (
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📈</span>
            <span>성장 벡터</span>
          </h3>
          <GrowthVectorChart growth={heroData.growth} />
        </div>
      )}

      {/* Inner9 Graphs (Combined Big5 Percentiles + MBTI Ratios) */}
      {heroData.big5Percentiles && heroData.mbtiRatios && (
        <Inner9Graphs
          big5Percentiles={heroData.big5Percentiles}
          mbtiRatios={heroData.mbtiRatios}
        />
      )}

      {/* 6. MBTI 상세 (기본 펼침, 접기 버튼 유지) */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">MBTI 유형 상세</h3>
        <div className="text-2xl sm:text-3xl font-bold text-violet-300 mb-2">
          {heroData.hero?.mbti || heroData.mbti?.type}
        </div>
        <div className="text-base sm:text-lg text-white/80 mb-2">
          {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.koreanName}
        </div>
        <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
          {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.detailedDescription}
        </p>
        
        {/* 기본적으로 펼쳐진 상태 */}
        {showMBTIDetails && (
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div>
              <div className="font-medium text-emerald-300 mb-1">강점</div>
              <ul className="list-disc list-inside text-white/70 space-y-1">
                {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-amber-300 mb-1">도전 과제</div>
              <ul className="list-disc list-inside text-white/70 space-y-1">
                {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-blue-300 mb-1">추천 직업</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.careerPaths.map((career, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-[10px] sm:text-xs">
                    {career}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-white/80 mb-1">관계 패턴</div>
              <p className="text-white/70">
                {detailedMBTIAnalysis[(heroData.hero?.mbti || heroData.mbti?.type) as keyof typeof detailedMBTIAnalysis]?.relationships}
              </p>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setShowMBTIDetails(!showMBTIDetails)}
          className="mt-4 text-xs sm:text-sm text-violet-300 hover:text-violet-200 transition"
        >
          {showMBTIDetails ? '접기 ▲' : '펼치기 ▼'}
        </button>
      </div>

      {/* 7. RETI 상세 (기본 펼침, 접기 버튼 유지) */}
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">RETI 점수 상세</h3>
        <div className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">
          R{heroData.world?.reti || heroData.hero?.reti?.code || '1'}
        </div>
        <div className="text-base sm:text-lg text-white/80 mb-2">
          {detailedRETIAnalysis[String(heroData.world?.reti || heroData.hero?.reti?.code || '1') as keyof typeof detailedRETIAnalysis]?.koreanName}
        </div>
        <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
          {detailedRETIAnalysis[String(heroData.world?.reti || heroData.hero?.reti?.code || '1') as keyof typeof detailedRETIAnalysis]?.detailedDescription}
        </p>
        
        {/* 기본적으로 펼쳐진 상태 */}
        {showRETIDetails && (
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div>
              <div className="font-medium text-white/80 mb-1">핵심 특성</div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {detailedRETIAnalysis[String(heroData.world?.reti || heroData.hero?.reti?.code || '1') as keyof typeof detailedRETIAnalysis]?.coreTraits.map((trait, i) => (
                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-white/80 text-[10px] sm:text-xs">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-amber-300 mb-1">성장 과제</div>
              <ul className="list-disc list-inside text-white/70 space-y-1">
                {detailedRETIAnalysis[String(heroData.world?.reti || heroData.hero?.reti?.code || '1') as keyof typeof detailedRETIAnalysis]?.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setShowRETIDetails(!showRETIDetails)}
          className="mt-4 text-xs sm:text-sm text-blue-300 hover:text-blue-200 transition"
        >
          {showRETIDetails ? '접기 ▲' : '펼치기 ▼'}
        </button>
      </div>
    </div>
  );
}
