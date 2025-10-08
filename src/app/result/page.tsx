'use client';

import Link from 'next/link';

export default function ResultPage() {
  // 실제로는 API에서 받아올 데이터
  const result = {
    continent: '터콰이즈 대륙',
    continentEmoji: '🏔️',
    heroType: '전략적 탐험가',
    heroEmoji: '⚔️',
    definition: '당신은 가능성의 탐험가입니다'
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 영웅 공개 */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
            <span className="text-purple-300 text-sm font-bold tracking-wider">HERO REVELATION</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            당신의 영웅
          </h1>

          {/* 대륙 카드 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-12 mb-6">
            <div className="text-6xl mb-4">{result.continentEmoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{result.continent}</h2>
            <p className="text-white/70 mb-8">독립의 물결이 흐르는 고원</p>
            
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8"></div>
            
            <div className="text-5xl mb-4">{result.heroEmoji}</div>
            <h3 className="text-2xl font-bold text-purple-300 mb-4">{result.heroType}</h3>
            <p className="text-xl italic text-yellow-300">"{result.definition}"</p>
          </div>

          {/* CTA */}
          <Link 
            href="/report"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-lg font-semibold transition"
          >
            📋 전체 리포트 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

