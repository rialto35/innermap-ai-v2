/**
 * ReportHeader
 * 
 * 리포트 헤더 컴포넌트 (프로 심리 리포트 스타일)
 * - 심플 아바타(플레이스홀더)
 * - 타이틀/메타 정보 그리드
 * 
 * @version v1.2.0
 */

'use client';

import { useState } from 'react';

interface ReportHeaderProps {
  heroId: string;
  heroName: string;
  heroTribe?: string;
  engineVersion: string;
  createdAt: string;
  finishedAt?: string;
  reportId?: string;
}

// Tribe 컬러 맵핑
const getTribeColors = (tribe?: string): { bg: string; accent: string; text: string } => {
  const colorMap: Record<string, { bg: string; accent: string; text: string }> = {
    Fire: { bg: 'from-red-400 to-orange-500', accent: 'from-red-500 to-orange-600', text: 'text-red-700 dark:text-red-300' },
    Water: { bg: 'from-blue-400 to-cyan-500', accent: 'from-blue-500 to-cyan-600', text: 'text-blue-700 dark:text-blue-300' },
    Earth: { bg: 'from-green-400 to-emerald-500', accent: 'from-green-500 to-emerald-600', text: 'text-green-700 dark:text-green-300' },
    Air: { bg: 'from-purple-400 to-indigo-500', accent: 'from-purple-500 to-indigo-600', text: 'text-purple-700 dark:text-purple-300' },
    Logic: { bg: 'from-indigo-400 to-blue-500', accent: 'from-indigo-500 to-blue-600', text: 'text-indigo-700 dark:text-indigo-300' },
    Emotion: { bg: 'from-pink-400 to-rose-500', accent: 'from-pink-500 to-rose-600', text: 'text-pink-700 dark:text-pink-300' },
  };
  return colorMap[tribe || 'Water'] || colorMap.Water;
};

export default function ReportHeader({
  heroId,
  heroName,
  heroTribe,
  engineVersion,
  createdAt,
  finishedAt,
  reportId
}: ReportHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const colors = getTribeColors(heroTribe);

  return (
    <div className="rounded-2xl p-8 mb-6 bg-white/70 dark:bg-gray-900/60 shadow-sm border border-white/40 dark:border-white/10 backdrop-blur">
      <div className="flex items-center gap-6">
        {/* Avatar with Tribe colors */}
        <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
          <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {heroName.charAt(0)}
          </span>
        </div>

        {/* Title & Meta */}
        <div className="flex-1">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {heroName}의 성장 리포트
              </h1>
              {heroTribe && (
                <p className={`mt-1 text-sm font-semibold ${colors.text}`}>
                  {heroTribe} 부족
                </p>
              )}
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              완료
            </span>
          </div>
          <div className={`mt-3 h-1 w-24 bg-gradient-to-r ${colors.accent} rounded`} />

          {/* Meta grid */}
          <dl className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">생성일</dt>
              <dd className="font-medium">{formatDate(createdAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">완료</dt>
              <dd className="font-medium">{finishedAt ? formatDate(finishedAt) : '-'}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">리포트 ID</dt>
              <dd className="font-medium">{reportId || '-'}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">버전</dt>
              <dd className="font-medium">{engineVersion}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

