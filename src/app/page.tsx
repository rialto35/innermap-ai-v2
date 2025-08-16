'use client';
import { useState } from 'react';
import MindCard from '@/components/MindCard';
import ColorSelector from '@/components/ColorSelector';
import MBTITest from '@/components/MBTITest';
import EnneagramTest from '@/components/EnneagramTest';
import AnalysisResult from '@/components/AnalysisResult';
import QuickInput from '@/components/QuickInput';

// 타입 정의
type TestResults = {
  mindCard: any;
  colors: string[] | null;
  mbti: string | null;
  enneagram: string | null;
  birthDate: string | null;
};

type TestType = keyof TestResults;

export default function Home() {
  const [testResults, setTestResults] = useState<TestResults>({
    mindCard: null,
    colors: null,
    mbti: null,
    enneagram: null,
    birthDate: null
  });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');

  const updateTestResult = (testType: TestType, result: any) => {
    setTestResults(prev => ({
      ...prev,
      [testType]: result
    }));
  };

  const resetAllTests = () => {
    setTestResults({
      mindCard: null,
      colors: null,
      mbti: null,
      enneagram: null,
      birthDate: null
    });
    setShowAnalysis(false);
    setActiveTab('quick');
  };

  const checkAllCompleted = () => {
    return (testResults.colors && testResults.colors.length >= 1) || 
           testResults.mbti || testResults.enneagram || testResults.birthDate;
  };

  const handleQuickInputComplete = (quickResults: Partial<TestResults>) => {
    setTestResults(prev => ({
      ...prev,
      ...quickResults
    }));
    
    setTimeout(() => {
      setShowAnalysis(true);
    }, 1000);
  };

  // 결과 분석 페이지 표시
  if (showAnalysis || checkAllCompleted()) {
    return (
      <main className="min-h-screen py-8 animate-fade-in">
        <div className="container mx-auto px-4">
          <AnalysisResult 
            testResults={testResults} 
            onReset={resetAllTests}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 섹션 - 우주 테마 */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative">
            {/* PromptCore 브랜딩 */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full border border-white/20 backdrop-blur-sm">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-300 tracking-wide">PromptCore</span>
              </div>
            </div>
            
            {/* 메인 타이틀 */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="text-gradient">🧠 InnerMap AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-6 font-medium">
                AI가 분석하는 당신의 성격과 심리 프로필
              </p>
              
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                MBTI, RETI 검사, 색채심리를 통해 더 깊이 있는 자아를 발견하세요
              </p>
              
              {/* 미니멀 장식 요소 */}
              <div className="flex justify-center mt-12 space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-gentle"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 - 미니멀 다크 테마 */}
        <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="card p-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('quick')}
                className={`relative py-6 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  activeTab === 'quick'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-102'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-102'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-3 text-2xl">⚡</span>
                  빠른 입력
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('detailed')}
                className={`relative py-6 px-8 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  activeTab === 'detailed'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-102'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-102'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-3 text-2xl">📋</span>
                  상세 테스트
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 빠른 입력 탭 */}
        {activeTab === 'quick' && (
          <div className="space-y-8 animate-fade-in">
            <QuickInput onComplete={handleQuickInputComplete} />
            
            {/* 미니멀 안내 메시지 */}
            <div className="max-w-4xl mx-auto">
              <div className="card-soft p-8">
                <div className="text-center mb-8">
                  <h3 className="section-title text-gradient-secondary">💡 빠른 입력 가이드</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover-lift">
                    <div className="text-4xl mb-4">🎂</div>
                    <h4 className="font-bold text-white mb-3">히어로컬러</h4>
                    <p className="text-sm text-gray-400">
                      입력하면 색채심리가<br />자동으로 계산됩니다
                    </p>
                  </div>
                  
                  <div className="text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover-lift">
                    <div className="text-4xl mb-4">🧠</div>
                    <h4 className="font-bold text-white mb-3">MBTI & RETI 검사</h4>
                    <p className="text-sm text-gray-400">
                      이미 아신다면<br />바로 선택하세요
                    </p>
                  </div>
                  
                  <div className="text-center p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover-lift">
                    <div className="text-4xl mb-4">⚡</div>
                    <h4 className="font-bold text-white mb-3">즉시 분석</h4>
                    <p className="text-sm text-gray-400">
                      하나만 입력해도<br />AI 분석이 가능합니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상세 테스트 탭 */}
        {activeTab === 'detailed' && (
          <div className="animate-fade-in">
            {/* 미니멀 진행 상황 표시 */}
            <div className="max-w-5xl mx-auto card p-8 mb-16">
              <h3 className="section-title text-gradient">📊 테스트 진행 상황</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    key: 'colors',
                    icon: '🎨',
                    title: '컬러심리',
                    completed: testResults.colors && testResults.colors.length >= 1,
                    value: testResults.colors && testResults.colors.length >= 1 ? '완료' : ''
                  },
                  {
                    key: 'mbti',
                    icon: '🧠',
                    title: 'MBTI',
                    completed: testResults.mbti,
                    value: testResults.mbti || ''
                  },
                  {
                    key: 'enneagram',
                    icon: '🔢',
                    title: '에니어그램',
                    completed: testResults.enneagram,
                    value: testResults.enneagram ? `유형 ${testResults.enneagram}` : ''
                  },
                  {
                    key: 'mindCard',
                    icon: '💭',
                    title: '마음카드',
                    completed: testResults.mindCard,
                    value: '선택사항'
                  }
                ].map((test, index) => (
                  <div
                    key={test.key}
                    className={`text-center p-6 rounded-2xl transition-all duration-300 transform hover:scale-102 border ${
                      test.completed
                        ? 'bg-green-900/20 border-green-700 text-green-400 shadow-lg'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className={`text-4xl mb-3 ${test.completed ? 'animate-bounce-gentle' : ''}`}>
                      {test.completed ? '✓' : test.icon}
                    </div>
                    <div className="font-bold text-lg mb-1">{test.title}</div>
                    <div className="text-sm">{test.value}</div>
                  </div>
                ))}
              </div>
              
              {checkAllCompleted() && (
                <div className="text-center mt-8 animate-bounce-gentle">
                  <button
                    onClick={() => setShowAnalysis(true)}
                    className="btn-primary text-xl px-12 py-4 shadow-lg"
                  >
                    🤖 AI 종합 분석 시작하기
                  </button>
                </div>
              )}
            </div>

            {/* 테스트 컴포넌트들 */}
            <div className="space-y-12">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <MindCard onComplete={(result: any) => updateTestResult('mindCard', result)} />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <ColorSelector onComplete={(result: any) => updateTestResult('colors', result)} />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <MBTITest />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <EnneagramTest />
              </div>
            </div>

            {/* 미니멀 하단 안내 */}
            <div className="text-center mt-20">
              <div className="card-soft p-8 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">
                  🌟 완벽한 분석을 위한 팁
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  모든 테스트를 완료하면 더욱 정확하고 개인화된 분석 결과를 받아보실 수 있습니다. 
                  각 테스트는 당신의 다른 면을 분석하여 종합적인 성격 프로필을 만들어냅니다.
                </p>
              </div>
            </div>
            
            {/* PromptCore 푸터 */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/30 border border-cyan-400/20 rounded-full backdrop-blur-sm">
                <div className="w-6 h-6">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 rounded-sm"></div>
                </div>
                <span className="text-sm text-cyan-300">Powered by</span>
                <a 
                  href="https://promptcore.co.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                >
                  PromptCore
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

