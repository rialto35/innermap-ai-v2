'use client';

import Link from 'next/link'
import ActionBar from '@/components/ActionBar'

export default function ResultPage() {
  // Mock 데이터 (나중에 API에서 가져오기)
  const result = {
    hero: '가능성의 탐험가',
    continent: '터콰이즈 대륙',
    emoji: '🏔️',
    tagline: '"당신은 10개의 문을 열고 3개를 완성하는 사람입니다"',
    mbti: 'ENTP',
    reti: '유형 7',
    big5: {
      O: 85,
      C: 45,
      E: 70,
      A: 60,
      N: 35
    },
    colors: ['#40E0D0', '#87CEEB', '#9370DB']
  }

  return (
    <div className="min-h-screen px-4 py-12 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* 영웅 공개 카드 */}
        <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-12">
          {/* 이모지 */}
          <div className="text-8xl mb-6 animate-bounce">
            {result.emoji}
          </div>

          {/* 대륙 */}
          <div className="text-purple-400 text-sm font-medium mb-2">
            {result.continent}
          </div>

          {/* 영웅 타입 */}
          <h1 className="text-5xl font-bold text-white mb-6">
            {result.hero}
          </h1>

          {/* 한 줄 정의 */}
          <p className="text-2xl text-white/80 italic mb-12 leading-relaxed">
            {result.tagline}
          </p>

          {/* CTA 버튼 */}
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform font-medium text-lg"
          >
            전체 리포트 보기
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 미리보기 섹션 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            리포트 미리보기
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PreviewCard 
              icon="💪"
              title="당신의 강점"
              description="3가지 핵심 역량"
            />
            <PreviewCard 
              icon="🎯"
              title="성장 퀘스트"
              description="이번 달 실천 과제"
            />
            <PreviewCard 
              icon="✨"
              title="영웅의 선언"
              description="당신만의 사명"
            />
          </div>
        </div>

        {/* 데이터 박스 (숨김 처리 - 참고용) */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 opacity-30">
          <h3 className="text-white font-bold mb-4 text-sm">분석 데이터 (내부용)</h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-white/50">
            <div>MBTI: {result.mbti}</div>
            <div>RETI: {result.reti}</div>
            <div>Big5-O: {result.big5.O}</div>
            <div>Big5-C: {result.big5.C}</div>
          </div>
        </div>
      </div>

      <ActionBar />
    </div>
  )
}

function PreviewCard({ icon, title, description }: { 
  icon: string
  title: string
  description: string 
}) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/15 transition">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-white font-bold mb-1">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  )
}

