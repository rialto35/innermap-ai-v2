'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<string, number>>({});
  
  const totalSteps = 4;

  // 샘플 MBTI 질문 3개
  const mbtiQuestions = [
    { id: 'q1', text: '파티에서 당신은?', options: ['사람들과 어울리는 걸 즐긴다', '조용히 몇 명과만 이야기한다'] },
    { id: 'q2', text: '문제 해결 시', options: ['논리적으로 분석한다', '감정을 고려한다'] },
    { id: 'q3', text: '계획을 세울 때', options: ['미리 철저히 준비한다', '상황에 맞춰 유연하게 대처한다'] },
  ];

  const handleBirthSubmit = () => {
    if (birthDate.year && birthDate.month && birthDate.day) {
      // 로컬스토리지 저장
      localStorage.setItem('birthDate', JSON.stringify(birthDate));
      setStep(1);
    }
  };

  const handleMBTIAnswer = (id: string, value: number) => {
    setMbtiAnswers({ ...mbtiAnswers, [id]: value });
  };

  const handleMBTISubmit = () => {
    if (Object.keys(mbtiAnswers).length === mbtiQuestions.length) {
      localStorage.setItem('mbtiAnswers', JSON.stringify(mbtiAnswers));
      router.push('/loading');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar step={step + 1} total={totalSteps} />
        </div>

        {/* Step 0: 생년월일 */}
        {step === 0 && (
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

        {/* Step 1: MBTI */}
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-4">MBTI 간단 검사</h1>
            {mbtiQuestions.map((q) => (
              <QuestionCard key={q.id} q={q} onAnswer={handleMBTIAnswer} />
            ))}
            <button
              onClick={handleMBTISubmit}
              disabled={Object.keys(mbtiAnswers).length !== mbtiQuestions.length}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              분석 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

