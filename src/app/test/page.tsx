'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ProgressBar';
import { ModeSelector } from '@/components/ModeSelector';
import { Question, TestMode } from '@/types/question';

export default function TestPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'birth' | 'mode' | 'test'>('birth');
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
  const [mode, setMode] = useState<TestMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // 모드 선택 시 문항 로드
  const handleModeSelect = async (selectedMode: TestMode) => {
    setMode(selectedMode);
    
    try {
      const res = await fetch('/api/test/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode })
      });
      
      const data = await res.json();
      if (data.success) {
        setQuestions(data.plan.questions);
        setStage('test');
      }
    } catch (error) {
      console.error('문항 로드 실패:', error);
    }
  };

  const handleBirthSubmit = () => {
    if (birthDate.year && birthDate.month && birthDate.day) {
      localStorage.setItem('birthDate', JSON.stringify(birthDate));
      setStage('mode');
    }
  };

  const handleAnswer = (value: number) => {
    const currentQ = questions[currentQuestion];
    setAnswers({ ...answers, [currentQ.id]: value });
    
    // 마지막 문항이면 제출
    if (currentQuestion === questions.length - 1) {
      handleSubmit({ ...answers, [currentQ.id]: value });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async (finalAnswers: Record<string, number>) => {
    // 로컬스토리지에 저장
    localStorage.setItem('testAnswers', JSON.stringify(finalAnswers));
    localStorage.setItem('testMode', mode || 'simple');
    
    // 로딩 페이지로 이동
    router.push('/loading-analysis');
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Stage 1: 생년월일 */}
        {stage === 'birth' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-4">생년월일을 입력해주세요</h1>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">년</label>
                  <input
                    type="number"
                    placeholder="1990"
                    value={birthDate.year}
                    onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">월</label>
                  <input
                    type="number"
                    placeholder="01"
                    value={birthDate.month}
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">일</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={birthDate.day}
                    onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
              <button
                onClick={handleBirthSubmit}
                disabled={!birthDate.year || !birthDate.month || !birthDate.day}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: 모드 선택 */}
        {stage === 'mode' && (
          <ModeSelector onSelect={handleModeSelect} />
        )}

        {/* Stage 3: 통합 문항 */}
        {stage === 'test' && currentQ && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <ProgressBar step={currentQuestion + 1} total={questions.length} />
            </div>

            {/* 질문 카드 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 text-white">
              <p className="mb-6 text-xl leading-relaxed">{currentQ.text}</p>

              {/* 5점 척도 */}
              {currentQ.scale === '5' && (
                <div className="grid grid-cols-5 gap-3">
                  {['전혀 아니다', '아니다', '보통', '그렇다', '매우 그렇다'].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i + 1)}
                      className="rounded-xl px-3 py-4 min-h-[60px] bg-white/10 hover:bg-indigo-500/30 text-center text-sm transition-all hover:scale-105"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* 7점 척도 */}
              {currentQ.scale === '7' && (
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className="rounded-xl px-3 py-4 min-h-[60px] bg-white/10 hover:bg-indigo-500/30 text-center transition-all hover:scale-105"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {/* 2지선다 */}
              {currentQ.scale === '2' && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="rounded-xl px-4 py-4 min-h-[60px] bg-white/10 hover:bg-white/20 text-left transition-all hover:scale-105"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 일시 저장 */}
            <div className="flex justify-between items-center text-white/60 text-sm">
              <button
                onClick={() => {
                  localStorage.setItem('testProgress', JSON.stringify({
                    mode,
                    currentQuestion,
                    answers,
                    questions
                  }));
                }}
                className="hover:text-white transition"
              >
                💾 일시 저장
              </button>
              <span>{currentQuestion + 1} / {questions.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
