'use client';
import { useState } from 'react';
import questionsData from '@/data/questions.json';

export default function MindCard({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflection, setReflection] = useState('');

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionsData.questions.length);
    const question = questionsData.questions[randomIndex];
    setCurrentQuestion(question);
    setIsReflecting(false);
    setReflection('');
  };

  const handleReflection = () => {
    setIsReflecting(true);
  };

  const saveReflection = () => {
    if (onComplete) {
      onComplete({
        question: currentQuestion,
        reflection: reflection,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6 hover:rotate-0 transition-all duration-500 hover-scale">
            <span className="text-3xl text-white">💭</span>
          </div>
          <h2 className="section-title text-gradient-secondary">마음 질문 카드</h2>
          <p className="text-gray-600">
            오늘 나에게 필요한 질문을 받아보세요
          </p>
        </div>
        
        {!currentQuestion ? (
          /* 시작 화면 */
          <div className="text-center">
            <div className="relative mb-8">
              {/* 배경 장식 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl opacity-30 blur-xl"></div>
              </div>
              
              {/* 카드 모형 */}
              <div className="relative w-80 h-48 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                   onClick={getRandomQuestion}>
                <div className="text-center text-white">
                  <div className="text-6xl mb-4 animate-bounce-gentle">?</div>
                  <p className="font-semibold text-lg">클릭해서 질문 뽑기</p>
                </div>
                
                {/* 반짝이는 효과 */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">
              마음의 목소리에 귀 기울일 준비가 되셨나요?
            </p>
            
            <button
              onClick={getRandomQuestion}
              className="btn-primary text-xl px-12 py-4 shadow-xl"
            >
              <span className="mr-2">✨</span>
              질문 뽑기
            </button>
          </div>
        ) : (
          /* 질문 표시 화면 */
          <div className="text-center">
            {/* 질문 카드 */}
            <div className="relative mb-8 animate-fade-in">
              <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-3xl p-8 shadow-2xl transform hover:scale-102 transition-all duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-white text-xl font-medium leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
                
                {/* 장식 요소 */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm">💡</span>
                </div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs">✨</span>
                </div>
              </div>
            </div>
            
            {/* 카테고리 표시 */}
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <span className="mr-1">🏷️</span>
                {currentQuestion.category}
              </span>
            </div>

            {!isReflecting ? (
              /* 액션 버튼들 */
              <div className="space-y-4">
                <button
                  onClick={handleReflection}
                  className="btn-secondary w-full text-lg py-4 shadow-xl"
                >
                  <span className="mr-2">💫</span>
                  마음으로 답해보기
                </button>
                
                <div className="flex gap-4">
                  <button
                    onClick={getRandomQuestion}
                    className="btn-outline flex-1 py-3"
                  >
                    <span className="mr-1">🔄</span>
                    다른 질문
                  </button>
                  
                  <button
                    onClick={saveReflection}
                    className="btn-accent flex-1 py-3"
                  >
                    <span className="mr-1">✅</span>
                    이 질문으로
                  </button>
                </div>
              </div>
            ) : (
              /* 성찰 모드 */
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🤔</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">마음의 소리에 귀 기울여보세요</h3>
                  <p className="text-gray-600">
                    솔직하고 자유롭게 생각을 적어보세요
                  </p>
                </div>
                
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full p-6 border-2 border-yellow-200 rounded-2xl text-lg resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  rows="6"
                  placeholder="이 질문을 보고 어떤 생각이 드나요? 마음에서 올라오는 모든 것을 자유롭게 표현해보세요..."
                />
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setIsReflecting(false);
                      setReflection('');
                    }}
                    className="btn-outline flex-1 py-3"
                  >
                    <span className="mr-1">←</span>
                    돌아가기
                  </button>
                  
                  <button
                    onClick={getRandomQuestion}
                    className="btn-outline flex-1 py-3"
                  >
                    <span className="mr-1">🔄</span>
                    새 질문
                  </button>
                  
                  <button
                    onClick={saveReflection}
                    className="btn-primary flex-1 py-3"
                  >
                    <span className="mr-1">💾</span>
                    저장하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}