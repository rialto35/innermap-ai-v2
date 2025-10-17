/**
 * ReportHeader
 * 
 * 리포트 헤더 컴포넌트
 * - 영웅 이미지, 이름
 * - 엔진 버전, 생성 일시
 * 
 * @version v1.1.0
 */

'use client';

import Image from 'next/image';

interface ReportHeaderProps {
  heroId: string;
  heroName: string;
  engineVersion: string;
  createdAt: string;
  finishedAt?: string;
}

export default function ReportHeader({
  heroId,
  heroName,
  engineVersion,
  createdAt,
  finishedAt
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

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-8 mb-6">
      <div className="flex items-center gap-6">
        {/* Hero Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
          <Image
            src={`/heroes/hero-${heroId}.png`}
            alt={heroName}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder
              (e.target as HTMLImageElement).src = '/heroes/default.png';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {heroName}의 성장 리포트
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md font-mono text-xs">
                {engineVersion}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>생성일: {formatDate(createdAt)}</span>
            </div>
            {finishedAt && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>완료: {formatDate(finishedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

