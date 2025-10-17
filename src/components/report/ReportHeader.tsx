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
  engineVersion: string;
  createdAt: string;
  finishedAt?: string;
  reportId?: string;
}

export default function ReportHeader({
  heroId,
  heroName,
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

  const [placeholder] = useState(() => ({
    bg: 'bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700'
  }));

  return (
    <div className="rounded-2xl p-8 mb-6 bg-white/70 dark:bg-gray-900/60 shadow-sm border border-white/40 dark:border-white/10 backdrop-blur">
      <div className="flex items-center gap-6">
        {/* Avatar Placeholder (no external image) */}
        <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg ${placeholder.bg}`} />

        {/* Title & Meta */}
        <div className="flex-1">
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {heroName}의 성장 리포트
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              완료
            </span>
          </div>
          <div className="mt-3 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-400 rounded" />

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

