'use client';
import { useState } from 'react';
import Big5Test from '@/components/Big5Test';
import type { Big5Scores } from '@/lib/calculateBig5';

export default function TestBig5Page() {
  const [result, setResult] = useState<Big5Scores | null>(null);

  const handleComplete = (scores: Big5Scores) => {
    console.log('🎯 Big5 검사 완료!', scores);
    setResult(scores);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="animated-background"></div>
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🧬 Big5 성격 검사 테스트
            </h1>
            <p className="text-lg text-white/70">
              v1 스타일을 계승한 새로운 TypeScript 컴포넌트
            </p>
          </div>

          {/* Big5 테스트 컴포넌트 */}
          <Big5Test onComplete={handleComplete} />

          {/* 결과 미리보기 (개발용) */}
          {result && (
            <div className="max-w-3xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  🔍 개발자 콘솔 (결과 미리보기)
                </h3>
                <pre className="bg-black/30 rounded-lg p-4 overflow-auto text-sm text-green-400 font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
                <p className="text-white/60 text-sm mt-2">
                  💡 이 데이터를 psychology/page.tsx의 testResults에 저장하면 됩니다!
                </p>
              </div>
            </div>
          )}

          {/* 사용 가이드 */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                📚 통합 가이드
              </h3>
              <div className="space-y-3 text-white/80 text-sm">
                <p>✅ Big5Test 컴포넌트가 성공적으로 생성되었습니다!</p>
                <p>🔹 파일 위치:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code className="bg-black/30 px-2 py-1 rounded">src/components/Big5Test.tsx</code></li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">src/data/big5.json</code></li>
                  <li><code className="bg-black/30 px-2 py-1 rounded">src/lib/calculateBig5.ts</code></li>
                </ul>
                <p>🔹 psychology/page.tsx에 통합하려면:</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Big5Test import 추가</li>
                  <li>testResults 타입에 big5 추가</li>
                  <li>초기 상태에 big5: null 추가</li>
                  <li>상세 테스트 탭에 Big5Test 컴포넌트 추가</li>
                  <li>진행 상황 표시에 Big5 항목 추가</li>
                </ol>
                <p className="mt-4">
                  📖 자세한 내용은 <code className="bg-black/30 px-2 py-1 rounded">src/components/Big5Test.README.md</code>를 참고하세요!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

