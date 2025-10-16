/**
 * Dashboard Header Component
 */

'use client';

interface DashboardHeaderProps {
  userName?: string;
  lastTestDate?: string;
}

export default function DashboardHeader({ userName, lastTestDate }: DashboardHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900">
        환영합니다, {userName || '사용자'}님 👋
      </h1>
      {lastTestDate && (
        <p className="text-gray-600">
          마지막 검사: {new Date(lastTestDate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      )}
    </div>
  );
}

