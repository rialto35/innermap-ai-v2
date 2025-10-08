'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();
  const [status, setStatus] = useState('분석 시작...');

  useEffect(() => {
    const analyze = async () => {
      try {
        // 로컬스토리지에서 데이터 로드
        const birthDate = JSON.parse(localStorage.getItem('birthDate') || '{}');
        const testAnswers = JSON.parse(localStorage.getItem('testAnswers') || '{}');
        const testMode = localStorage.getItem('testMode') || 'simple';
        const testProgress = JSON.parse(localStorage.getItem('testProgress') || '{}');

        // 1. 점수 계산
        setStatus('점수 계산 중...');
        const scoreRes = await fetch('/api/test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: testAnswers,
            questions: testProgress.questions,
            birth: { 
              y: parseInt(birthDate.year), 
              m: parseInt(birthDate.month), 
              d: parseInt(birthDate.day) 
            },
            mode: testMode
          })
        });

        const scoreData = await scoreRes.json();
        
        if (scoreData.success) {
          localStorage.setItem('testScores', JSON.stringify(scoreData.scores));
          localStorage.setItem('testMetadata', JSON.stringify(scoreData.metadata));
        }

        // 2. AI 분석 호출 (기존 /api/analyze)
        setStatus('AI 분석 중...');
        // TODO: 기존 analyze API와 연동
        
        // 3초 대기 후 결과로 이동
        setTimeout(() => {
          router.push('/result');
        }, 3000);

      } catch (error) {
        console.error('분석 에러:', error);
        setTimeout(() => {
          router.push('/result');
        }, 2000);
      }
    };

    analyze();
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
        <p className="text-indigo-400 text-sm mb-8">{status}</p>

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

