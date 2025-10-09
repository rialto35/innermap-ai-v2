'use client'

import { useState } from 'react'
import Link from 'next/link'
import TagFilter from '@/components/TagFilter'

// Mock 데이터
const INSIGHTS = [
  {
    slug: 'what-is-innermap',
    title: 'InnerMap이란 무엇인가요?',
    description: 'AI 기반 심리 분석 플랫폼의 핵심 원리를 알아보세요',
    tag: '시작하기',
    date: '2025-10-09',
    readTime: '5분',
    thumbnail: '🗺️'
  },
  {
    slug: 'understanding-personality',
    title: '성격 유형의 이해',
    description: '다양한 성격 이론과 그 특징을 살펴봅니다',
    tag: '내면이론',
    date: '2025-10-08',
    readTime: '8분',
    thumbnail: '🎭'
  },
  {
    slug: 'building-relationships',
    title: '건강한 관계 맺기',
    description: '타인과 깊이 있는 관계를 형성하는 방법',
    tag: '관계',
    date: '2025-10-07',
    readTime: '6분',
    thumbnail: '🤝'
  },
  {
    slug: 'emotional-intelligence',
    title: '감정 지능 키우기',
    description: '자신과 타인의 감정을 이해하고 조절하는 법',
    tag: '감정',
    date: '2025-10-06',
    readTime: '7분',
    thumbnail: '💭'
  },
  {
    slug: 'personal-growth',
    title: '지속 가능한 성장',
    description: '작은 습관으로 큰 변화를 만드는 방법',
    tag: '성장',
    date: '2025-10-05',
    readTime: '10분',
    thumbnail: '🌱'
  },
  {
    slug: 'ai-psychology',
    title: 'AI와 심리학의 만남',
    description: '인공지능이 심리 분석을 어떻게 돕는지 알아봅니다',
    tag: '기술',
    date: '2025-10-04',
    readTime: '12분',
    thumbnail: '🤖'
  },
]

const TAGS = ['전체', '시작하기', '내면이론', '관계', '감정', '성장', '기술']

export default function InsightPage() {
  const [activeTag, setActiveTag] = useState('전체')
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

  const filteredInsights = INSIGHTS.filter(
    insight => activeTag === '전체' || insight.tag === activeTag
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            인사이트 허브
          </h1>
          <p className="text-white/70 text-lg">
            내면 탐험을 위한 지식과 인사이트
          </p>
        </div>

        {/* 필터 & 정렬 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <TagFilter 
            tags={TAGS}
            onTagChange={setActiveTag}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>

        {/* 인사이트 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((insight) => (
            <Link
              key={insight.slug}
              href={`/insight/${insight.slug}`}
              className="group block"
            >
              <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-2xl h-full">
                {/* 썸네일 */}
                <div className="text-5xl mb-4">{insight.thumbnail}</div>

                {/* 태그 */}
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium mb-3">
                  {insight.tag}
                </div>

                {/* 제목 */}
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                  {insight.title}
                </h2>

                {/* 설명 */}
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {insight.description}
                </p>

                {/* 메타 정보 */}
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {insight.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {insight.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* 결과 없음 */}
        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              해당 카테고리의 글이 아직 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
