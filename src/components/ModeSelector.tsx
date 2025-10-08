'use client';

import { TestMode } from '@/types/question';

interface ModeSelectorProps {
  onSelect: (mode: TestMode) => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">검사 방식을 선택해주세요</h2>
        <p className="text-white/70">
          두 검사 모두 동일한 통합 분석을 제공합니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 간단검사 */}
        <button
          onClick={() => onSelect('simple')}
          className="group rounded-2xl border-2 border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 p-8 text-left transition-all hover:scale-105 hover:border-white/40"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-white">간단검사</h3>
          </div>
          
          <p className="text-white/80 mb-4 leading-relaxed">
            빠르게 전체를 파악하고 싶다면.<br />
            한 번에 끝나는 통합 검사로 핵심만 뽑아드립니다.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-green-400">✓</span>
              <span>예상 소요 시간: 5-7분</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-green-400">✓</span>
              <span>문항 수: 적음</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-green-400">✓</span>
              <span>일상 적용 중심</span>
            </div>
          </div>

          <div className="inline-block px-4 py-2 bg-white/10 rounded-lg text-white/90 text-sm font-semibold group-hover:bg-white/20 transition">
            시작하기 →
          </div>
        </button>

        {/* 심층검사 */}
        <button
          onClick={() => onSelect('deep')}
          className="group rounded-2xl border-2 border-white/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 p-8 text-left transition-all hover:scale-105 hover:border-white/40"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-white">심층검사</h3>
          </div>
          
          <p className="text-white/80 mb-4 leading-relaxed">
            더 깊은 해석과 정밀 추천이 필요하다면.<br />
            동일한 통합 검사에 더 많은 문항으로 정확도를 높입니다.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-purple-400">✓</span>
              <span>예상 소요 시간: 12-15분</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-purple-400">✓</span>
              <span>문항 수: 많음</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span className="text-purple-400">✓</span>
              <span>정밀 인사이트 제공</span>
            </div>
          </div>

          <div className="inline-block px-4 py-2 bg-white/10 rounded-lg text-white/90 text-sm font-semibold group-hover:bg-white/20 transition">
            시작하기 →
          </div>
        </button>
      </div>

      {/* 안내 툴팁 */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <p className="text-white/60 text-sm leading-relaxed">
          💡 문항은 심리 프레임(MBTI·RETI·Big5)에서 균형 있게 추출됩니다.<br />
          사용자에게는 하나의 검사로 보이며, 내부적으로 통합 분석됩니다.
        </p>
      </div>
    </div>
  );
}

