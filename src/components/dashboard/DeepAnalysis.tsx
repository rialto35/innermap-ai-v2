/**
 * DeepAnalysis Component
 * 심층 분석 탭 콘텐츠
 */

'use client';


interface DeepAnalysisProps {
  heroData?: any;
  reportData?: any;
}

export default function DeepAnalysis({ heroData, reportData }: DeepAnalysisProps) {
  // 심층 분석 데이터가 없으면 기본 분석 정보 표시
  if (!heroData?.analysisText && !heroData?.hasTestResult) {
    return (
      <div className="space-y-6">
        {/* Coming Soon Banner */}
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">심층 분석</h3>
          <p className="text-white/60 text-sm mb-6">
            새로운 분석을 시작하면 AI 기반 심층 분석이 제공됩니다
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm">
            <span className="animate-pulse">●</span>
            <span>분석 대기 중</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🔍</div>
          <h3 className="text-2xl font-bold text-white">심층 분석</h3>
        </div>
        <p className="text-white/60 text-sm">
          AI 기반 심리 분석을 통한 상세한 내면 탐구
        </p>
      </div>

      {/* 리포트 기반 상세 분석 */}
      {reportData?.summary_md && (
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📊</div>
            <h3 className="text-xl font-bold text-white">AI 분석 리포트</h3>
          </div>
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-white/90 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: reportData.summary_md
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-emerald-200">$1</em>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
        </div>
      )}

      {/* Big5 분석 */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🧬</div>
          <h3 className="text-xl font-bold text-white">Big5 성격 분석</h3>
        </div>
        <p className="text-white/60 text-sm mb-4">5가지 핵심 성격 차원의 상세 분석</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroData.big5 && Object.entries(heroData.big5).map(([key, value]) => {
            const score = Math.round(Number(value as number)); // 이미 0-100 범위
            const getScoreColor = (score: number) => {
              if (score >= 80) return 'text-emerald-300';
              if (score >= 60) return 'text-blue-300';
              if (score >= 40) return 'text-yellow-300';
              return 'text-red-300';
            };
            const getScoreLabel = (key: string, score: number) => {
              const labels: Record<string, { high: string; low: string }> = {
                O: { high: '개방적', low: '전통적' },
                C: { high: '성실함', low: '유연함' },
                E: { high: '외향적', low: '내향적' },
                A: { high: '협조적', low: '경쟁적' },
                N: { high: '민감함', low: '안정적' }
              };
              return score >= 50 ? labels[key]?.high : labels[key]?.low;
            };
            
            return (
              <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/90 font-medium">{key}</span>
                  <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-emerald-400' :
                      score >= 60 ? 'bg-blue-400' :
                      score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="text-xs text-white/60">
                  {getScoreLabel(key, score)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MBTI 분석 */}
      {heroData.mbti && (
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🧠</div>
            <h3 className="text-xl font-bold text-white">MBTI 성격 유형</h3>
          </div>
          <p className="text-white/60 text-sm mb-4">16가지 성격 유형 중 당신의 유형</p>
          <div className="flex items-center gap-6">
            <div className="text-5xl font-bold text-purple-300">{heroData.mbti.type}</div>
            <div className="flex-1">
              {typeof heroData.mbti.confidence === 'object' ? (
                <div className="space-y-3">
                  <p className="text-white/80 text-sm font-medium">세부 신뢰도:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(heroData.mbti.confidence).map(([key, value]) => {
                      const confidence = Math.round(value as number * 100);
                      return (
                        <div key={key} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white/70 text-xs">{key.toUpperCase()}:</span>
                            <span className="text-purple-300 font-bold text-sm">{confidence}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1">
                            <div 
                              className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/80 text-sm mb-2">전체 신뢰도</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-purple-300">{heroData.mbti.confidence}%</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${heroData.mbti.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RETI 분석 */}
      {(heroData.reti || heroData.world?.reti) && (
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🔢</div>
            <h3 className="text-xl font-bold text-white">RETI 동기 분석</h3>
          </div>
          <p className="text-white/60 text-sm mb-4">9가지 동기 유형 중 당신의 주요 동기</p>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 font-medium">주요 동기</span>
                <span className="text-orange-300 font-bold text-lg">
                  R{heroData.reti?.type || heroData.world?.reti || '1'}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="text-xs text-white/60 mt-2">
                {heroData.reti?.type === 'R1' || heroData.world?.reti === 1 ? '개혁가 - 완벽을 추구하는 원칙주의자' :
                 heroData.reti?.type === 'R2' || heroData.world?.reti === 2 ? '조력가 - 타인을 돕는 것에서 보람을 느끼는 사람' :
                 heroData.reti?.type === 'R3' || heroData.world?.reti === 3 ? '성취자 - 목표 달성과 성공을 추구하는 사람' :
                 heroData.reti?.type === 'R4' || heroData.world?.reti === 4 ? '예술가 - 독특함과 진정성을 추구하는 개인주의자' :
                 heroData.reti?.type === 'R5' || heroData.world?.reti === 5 ? '관찰자 - 지식과 이해를 추구하는 사색가' :
                 heroData.reti?.type === 'R6' || heroData.world?.reti === 6 ? '충성가 - 안정과 신뢰를 중시하는 사람' :
                 heroData.reti?.type === 'R7' || heroData.world?.reti === 7 ? '열정가 - 즐거움과 새로운 경험을 추구하는 사람' :
                 heroData.reti?.type === 'R8' || heroData.world?.reti === 8 ? '도전가 - 힘과 통제력을 추구하는 리더' :
                 heroData.reti?.type === 'R9' || heroData.world?.reti === 9 ? '평화주의자 - 조화와 평온을 추구하는 중재자' :
                 '동기 유형'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inner9 분석 */}
      {heroData.inner9 && (() => {
        // Convert Inner9 data from { axes: [...], labels: [...] } to Record<string, number>
        const inner9Data = heroData.inner9 as any;
        const inner9Scores: Record<string, number> = {};
        
        if (inner9Data.axes && inner9Data.labels) {
          const labelMap: Record<string, string> = {
            'creation': '창조',
            'balance': '균형',
            'intuition': '직관',
            'analysis': '분석',
            'harmony': '조화',
            'drive': '추진력',
            'reflection': '성찰',
            'empathy': '공감',
            'discipline': '절제'
          };
          
          for (let i = 0; i < inner9Data.labels.length; i++) {
            const label = inner9Data.labels[i].toLowerCase();
            const koreanLabel = labelMap[label] || label;
            inner9Scores[koreanLabel] = inner9Data.axes[i];
          }
        }
        
        return (
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🧭</div>
              <h3 className="text-xl font-bold text-white">Inner9 내면 분석</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">9가지 내면 차원의 상세 분석</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(inner9Scores).map(([key, value]) => {
                const score = Math.round(value as number);
                const getScoreColor = (score: number) => {
                  if (score >= 80) return 'text-emerald-300';
                  if (score >= 60) return 'text-cyan-300';
                  if (score >= 40) return 'text-yellow-300';
                  return 'text-red-300';
                };
                const getScoreBg = (score: number) => {
                  if (score >= 80) return 'bg-emerald-400';
                  if (score >= 60) return 'bg-cyan-400';
                  if (score >= 40) return 'bg-yellow-400';
                  return 'bg-red-400';
                };
                
                return (
                  <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/90 font-medium">{key}</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getScoreBg(score)}`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-white/60">
                      {score >= 80 ? '매우 높음' : 
                       score >= 60 ? '높음' : 
                       score >= 40 ? '보통' : '낮음'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Preview Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: '🧠',
            title: '인지 패턴 분석',
            description: '사고 방식과 의사결정 패턴을 분석합니다',
            status: 'coming-soon',
          },
          {
            icon: '💬',
            title: '대화 스타일 분석',
            description: '커뮤니케이션 스타일과 선호도를 파악합니다',
            status: 'coming-soon',
          },
          {
            icon: '🎯',
            title: '목표 달성 전략',
            description: '당신에게 맞는 목표 달성 방법을 제안합니다',
            status: 'coming-soon',
          },
          {
            icon: '🤝',
            title: '관계 역학 분석',
            description: '대인 관계 패턴과 개선 방향을 제시합니다',
            status: 'coming-soon',
          },
          {
            icon: '⚡',
            title: '에너지 관리',
            description: '에너지 소비 패턴과 회복 전략을 분석합니다',
            status: 'coming-soon',
          },
          {
            icon: '🌱',
            title: '성장 로드맵',
            description: '개인화된 성장 경로를 제안합니다',
            status: 'coming-soon',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
            <p className="text-sm text-white/60 mb-4">{feature.description}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>준비 중</span>
            </div>
          </div>
        ))}
      </div>

      {/* Beta Access CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h4 className="text-lg font-semibold text-white mb-2">베타 테스터 모집</h4>
        <p className="text-sm text-white/60 mb-4">
          심층 분석 기능의 베타 테스터로 참여하시면 우선 체험 기회를 드립니다
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-xl hover:scale-105 transition">
          베타 신청하기
        </button>
      </div>
    </div>
  );
}

