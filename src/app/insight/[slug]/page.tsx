import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock 데이터 (실제로는 CMS나 DB에서 가져옴)
const INSIGHT_DATA: Record<string, any> = {
  'what-is-innermap': {
    title: 'InnerMap이란 무엇인가요?',
    date: '2025-10-09',
    readTime: '5분',
    tag: '시작하기',
    thumbnail: '🗺️',
    content: `
# InnerMap AI 소개

InnerMap AI는 AI 기반 심리 분석 플랫폼입니다. 

## 핵심 특징

1. **빠른 분석**: 단 5분만에 완료되는 간편한 검사
2. **정확한 결과**: AI 기반 심리학 프레임워크
3. **아름다운 리포트**: 영웅 세계관으로 표현

## 작동 원리

InnerMap은 다양한 심리학 이론을 통합하여 당신의 성격을 다각도로 분석합니다.

### 분석 프로세스

- 질문 응답 수집
- AI 패턴 분석
- 영웅 유형 매칭
- 맞춤 리포트 생성

이제 당신도 InnerMap으로 내면을 탐험해보세요!
    `
  },
  'understanding-personality': {
    title: '성격 유형의 이해',
    date: '2025-10-08',
    readTime: '8분',
    tag: '내면이론',
    thumbnail: '🎭',
    content: `
# 성격 유형의 이해

성격은 개인을 특징짓는 고유한 사고, 감정, 행동 패턴입니다.

## 주요 성격 이론

### 특성 이론
개인의 성격을 여러 특성의 조합으로 설명합니다.

### 유형 이론
사람들을 특정 유형으로 분류합니다.

## 성격을 이해하는 이유

자신을 이해하면 더 나은 선택을 할 수 있습니다.
    `
  }
}

export default function InsightDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const insight = INSIGHT_DATA[slug]

  if (!insight) {
    notFound()
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로 가기 */}
        <Link
          href="/insight"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로
        </Link>

        {/* 아티클 헤더 */}
        <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12">
          {/* 태그 */}
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium mb-4">
            {insight.tag}
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {insight.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-white/60 mb-8 pb-8 border-b border-white/10">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {insight.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {insight.readTime}
            </span>
          </div>

          {/* 본문 */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-white/90 leading-relaxed space-y-4">
              {insight.content.split('\n').map((line: string, idx: number) => {
                if (line.startsWith('# ')) {
                  return <h1 key={idx} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>
                }
                if (line.startsWith('### ')) {
                  return <h3 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="text-white/80 ml-4">{line.slice(2)}</li>
                }
                if (line.trim() === '') {
                  return <br key={idx} />
                }
                return <p key={idx} className="text-white/80">{line}</p>
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/70 mb-4">
              InnerMap으로 나를 탐험해보세요
            </p>
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform font-medium"
            >
              무료 검사 시작하기 →
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
