/**
 * ReportDeep 컴포넌트
 * 심층 분석 허브 (그리드 카드 + 모듈 트리거 + 상태 뱃지)
 */

import { ReportV1, DeepKey, DeepState } from '@/types/report';
import { useState } from 'react';

interface ReportDeepProps {
  report: ReportV1;
}

const moduleConfig = {
  cognition: {
    title: '인지 패턴',
    description: '사고 방식과 학습 패턴 분석',
    icon: '🧠',
    color: 'from-purple-500 to-purple-700'
  },
  communication: {
    title: '소통 스타일',
    description: '대화와 표현 방식 분석',
    icon: '💬',
    color: 'from-blue-500 to-blue-700'
  },
  goal: {
    title: '목표 지향성',
    description: '목표 설정과 달성 방식 분석',
    icon: '🎯',
    color: 'from-green-500 to-green-700'
  },
  relation: {
    title: '관계 패턴',
    description: '인간관계와 소셜 스타일 분석',
    icon: '🤝',
    color: 'from-pink-500 to-pink-700'
  },
  energy: {
    title: '에너지 관리',
    description: '활력과 휴식 패턴 분석',
    icon: '⚡',
    color: 'from-yellow-500 to-yellow-700'
  },
  growth: {
    title: '성장 방향',
    description: '개발 영역과 잠재력 분석',
    icon: '🌱',
    color: 'from-emerald-500 to-emerald-700'
  }
};

export default function ReportDeep({ report }: ReportDeepProps) {
  const [loadingModules, setLoadingModules] = useState<Set<DeepKey>>(new Set());
  const { deep } = report;

  const handleModuleClick = async (moduleKey: DeepKey) => {
    if (loadingModules.has(moduleKey)) return;

    setLoadingModules(prev => new Set(prev).add(moduleKey));

    try {
      const response = await fetch(`/api/reports/${report.id}/deep/${moduleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to start module analysis');
      }

      // SWR mutate로 데이터 갱신
      // mutate(`/api/reports/${report.id}?include=deep`);
      
    } catch (error) {
      console.error('Error starting module analysis:', error);
    } finally {
      setLoadingModules(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleKey);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: DeepState, moduleKey: DeepKey) => {
    const isLoading = loadingModules.has(moduleKey);
    
    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          생성 중...
        </span>
      );
    }

    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">
            대기 중
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            분석 중...
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
            ✓ 완료
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
            오류
          </span>
        );
    }
  };

  return (
    <div data-testid="deep-root" className="space-y-8">
      {/* 심층 분석 허브 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span>🔍</span>
          <span>심층 분석 허브</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(deep?.modules || {}).map(([moduleKey, status]) => {
            const config = moduleConfig[moduleKey as DeepKey];
            const isLoading = loadingModules.has(moduleKey as DeepKey);
            
            return (
              <div
                key={moduleKey}
                className={`relative rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 ${
                  status === 'ready' ? 'ring-2 ring-green-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{config.title}</h3>
                      <p className="text-xs text-white/70">{config.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(status, moduleKey as DeepKey)}
                </div>

                {status === 'ready' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-white/80">
                      분석이 완료되었습니다. 상세 내용을 확인해보세요.
                    </p>
                    <button className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                      상세 보기
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleModuleClick(moduleKey as DeepKey)}
                    disabled={isLoading}
                    className={`w-full py-2 px-3 rounded-lg text-sm transition-colors ${
                      isLoading
                        ? 'bg-white/5 text-white/50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isLoading ? '생성 중...' : '분석 생성하기'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 내러티브 섹션 */}
      {deep?.narrative && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>심층 분석 내러티브</span>
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80 leading-relaxed">
              {deep.narrative}
            </p>
          </div>
        </div>
      )}

      {/* 차트 리소스 */}
      {deep?.resources?.charts && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>분석 차트</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deep.resources.charts.big5 && (
              <div className="text-center">
                <img 
                  src={deep.resources.charts.big5} 
                  alt="Big5 차트" 
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-white/70 mt-2">Big5 성격 분석</p>
              </div>
            )}
            {deep.resources.charts.inner9 && (
              <div className="text-center">
                <img 
                  src={deep.resources.charts.inner9} 
                  alt="Inner9 차트" 
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-white/70 mt-2">Inner9 내면 지도</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
