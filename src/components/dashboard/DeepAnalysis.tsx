/**
 * DeepAnalysis Component
 * 심층 분석 탭 콘텐츠
 */

'use client';

export default function DeepAnalysis() {
  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-white mb-2">심층 분석</h3>
        <p className="text-white/60 text-sm mb-6">
          AI 기반 심층 분석 기능이 곧 제공됩니다
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm">
          <span className="animate-pulse">●</span>
          <span>개발 중</span>
        </div>
      </div>

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

