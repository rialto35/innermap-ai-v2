/**
 * Big5Test 컴포넌트 사용 예시
 * 
 * psychology/page.tsx에서 사용하는 방법:
 */

'use client';
import { useState } from 'react';
import Big5Test from '@/components/Big5Test';
import type { Big5Scores } from '@/lib/calculateBig5';

export default function ExampleUsage() {
  const [big5Result, setBig5Result] = useState<Big5Scores | null>(null);

  const handleBig5Complete = (scores: Big5Scores) => {
    console.log('Big5 검사 완료!', scores);
    setBig5Result(scores);
    
    // 여기서 상위 컴포넌트에 결과 전달하거나
    // API로 저장할 수 있습니다
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Big5 검사 컴포넌트 */}
        <Big5Test onComplete={handleBig5Complete} />
        
        {/* 결과가 있으면 추가 작업 가능 */}
        {big5Result && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Big5 검사가 완료되었습니다! 
              다른 검사도 진행해보세요.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}

/**
 * psychology/page.tsx에 통합하는 방법:
 * 
 * 1. Big5Test import 추가:
 *    import Big5Test from '@/components/Big5Test';
 * 
 * 2. testResults 타입에 big5 추가:
 *    type TestResults = {
 *      mindCard: any;
 *      colors: string[] | null;
 *      mbti: string | null;
 *      enneagram: string | null;
 *      birthDate: string | null;
 *      big5: Big5Scores | null;  // 추가
 *    };
 * 
 * 3. 초기 상태에 big5 추가:
 *    const [testResults, setTestResults] = useState<TestResults>({
 *      mindCard: null,
 *      colors: null,
 *      mbti: null,
 *      enneagram: null,
 *      birthDate: null,
 *      big5: null  // 추가
 *    });
 * 
 * 4. Big5Test 컴포넌트 추가 (상세 테스트 탭 내):
 *    <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
 *      <Big5Test onComplete={(result: any) => updateTestResult('big5', result)} />
 *    </div>
 * 
 * 5. 완료 상태 표시에 Big5 추가:
 *    {
 *      key: 'big5',
 *      icon: '🧬',
 *      title: 'Big5',
 *      completed: testResults.big5,
 *      value: testResults.big5 ? '완료' : ''
 *    }
 */

