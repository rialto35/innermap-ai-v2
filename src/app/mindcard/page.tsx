'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MindCardPage() {
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  
  const mindCards = [
    "오늘 나에게 가장 필요한 것은 무엇인가요?",
    "지금 이 순간 나의 진짜 감정은 무엇인가요?",
    "나를 가장 행복하게 만드는 것은 무엇인가요?",
    "오늘 하루 동안 나에게 가장 큰 도전은 무엇인가요?",
    "지금 이 순간 나에게 가장 필요한 조언은 무엇인가요?",
    "오늘 나에게 가장 중요한 사람은 누구인가요?",
    "지금 이 순간 나의 가장 큰 걱정은 무엇인가요?",
    "오늘 하루 동안 나에게 가장 필요한 용기는 무엇인가요?",
    "지금 이 순간 나에게 가장 필요한 인내는 무엇인가요?",
    "오늘 하루 동안 나에게 가장 필요한 감사는 무엇인가요?",
    "지금 이 순간 나에게 가장 필요한 용서는 무엇인가요?",
    "오늘 하루 동안 나에게 가장 필요한 사랑은 무엇인가요?",
    "지금 이 순간 나에게 가장 필요한 믿음은 무엇인가요?",
    "오늘 하루 동안 나에게 가장 필요한 희망은 무엇인가요?",
    "지금 이 순간 나에게 가장 필요한 평화는 무엇인가요?"
  ];
  
  const drawCard = () => {
    const randomCard = mindCards[Math.floor(Math.random() * mindCards.length)];
    setCurrentCard(randomCard);
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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* PromptCore 브랜딩 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-full border border-white/30 backdrop-blur-sm shadow-lg">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-white tracking-wide">PromptCore</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="holographic-text">💭 마음 카드</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg mx-auto">
            오늘 나에게 필요한 심리적 통찰을 받아보세요
          </p>
          
          {currentCard ? (
            <div className="glass-card p-8 rounded-2xl mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4">오늘의 질문</h2>
              <p className="text-xl text-white/90 leading-relaxed">{currentCard}</p>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-2xl mb-8">
              <p className="text-white/70 text-lg">카드를 뽑아서 오늘의 질문을 받아보세요</p>
            </div>
          )}
          
          <div className="space-y-4">
            <button 
              onClick={drawCard}
              className="neon-button px-8 py-4 rounded-lg font-bold text-lg"
            >
              {currentCard ? '새 카드 뽑기' : '카드 뽑기'}
            </button>
            
            <div className="mt-8">
              <Link href="/">
                <button className="btn-outline px-6 py-3 rounded-lg font-medium">
                  🏠 홈으로 돌아가기
                </button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
