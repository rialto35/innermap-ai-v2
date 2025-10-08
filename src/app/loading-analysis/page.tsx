'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // 15초 후 /result로 이동
    const timer = setTimeout(() => {
      router.push('/result');
    }, 15000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* 애니메이션 */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto">
            {/* 회전하는 원 */}
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* 텍스트 */}
        <h1 className="text-3xl font-bold text-white mb-4">
          AI가 당신을 분석하고 있습니다
        </h1>
        <p className="text-white/70 mb-8">
          MBTI, RETI, Big5 데이터를<br />
          영웅 세계관으로 해석하는 중...
        </p>

        {/* 진행 단계 */}
        <div className="space-y-3 text-left">
          {[
            '성격 유형 분석 중...',
            '대륙 매핑 중...',
            '영웅 타입 생성 중...',
            '리포트 작성 중...'
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-white/60">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" 
                   style={{ animationDelay: `${i * 0.3}s` }}></div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

