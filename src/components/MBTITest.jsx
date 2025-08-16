'use client';
import { useState } from 'react';
import mbtiData from '@/data/mbti.json';

export default function MBTITest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const questions = mbtiData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (agree) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: agree ? currentQuestion.weight : -currentQuestion.weight
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    questions.forEach(q => {
      const answer = finalAnswers[q.id] || 0;
      scores[q.type] += answer;
    });

    const mbtiType = 
      (scores.EI > 0 ? 'E' : 'I') +
      (scores.SN > 0 ? 'S' : 'N') +
      (scores.TF > 0 ? 'T' : 'F') +
      (scores.JP > 0 ? 'J' : 'P');

    setAnswers({ ...finalAnswers, result: mbtiType, scores });
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
  };

  if (showResult) {
    const result = mbtiData.types[answers.result];
    const scores = answers.scores;
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧠 MBTI 결과</h2>
        
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-4">
            <h3 className="text-3xl font-bold mb-2">{answers.result}</h3>
            <h4 className="text-xl mb-2">{result.name}</h4>
            <p className="text-lg">{result.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">에너지 방향</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm">내향형 (I)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${50 + (scores.EI * 2)}%`, marginLeft: scores.EI < 0 ? '0%' : 'auto' }}
                ></div>
              </div>
              <span className="text-sm">외향형 (E)</span>
            </div>
            <p className="text-center text-sm mt-1 font-semibold">{scores.EI > 0 ? 'E' : 'I'}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">정보 수집</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm">직관형 (N)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${50 + (scores.SN * 2)}%`, marginLeft: scores.SN < 0 ? '0%' : 'auto' }}
                ></div>
              </div>
              <span className="text-sm">현실형 (S)</span>
            </div>
            <p className="text-center text-sm mt-1 font-semibold">{scores.SN > 0 ? 'S' : 'N'}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">의사 결정</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm">감정형 (F)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${50 + (scores.TF * 2)}%`, marginLeft: scores.TF < 0 ? '0%' : 'auto' }}
                ></div>
              </div>
              <span className="text-sm">사고형 (T)</span>
            </div>
            <p className="text-center text-sm mt-1 font-semibold">{scores.TF > 0 ? 'T' : 'F'}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">생활 패턴</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm">인식형 (P)</span>
              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${50 + (scores.JP * 2)}%`, marginLeft: scores.JP < 0 ? '0%' : 'auto' }}
                ></div>
              </div>
              <span className="text-sm">판단형 (J)</span>
            </div>
            <p className="text-center text-sm mt-1 font-semibold">{scores.JP > 0 ? 'J' : 'P'}</p>
          </div>
        </div>

        <button
          onClick={resetTest}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          다시 테스트하기
        </button>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 MBTI 성격유형 테스트</h2>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-4">
              총 20개의 질문을 통해 당신의 성격유형을 분석합니다.
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 각 질문에 솔직하게 답해주세요</li>
              <li>• 첫 번째 직감을 따라 선택하세요</li>
              <li>• 소요시간: 약 3-5분</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            테스트 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">MBTI 테스트</h2>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center">
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-800 leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleAnswer(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg transition-colors text-left"
          >
            ✓ 그렇다
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg transition-colors text-left"
          >
            ✗ 아니다
          </button>
        </div>
      </div>
    </div>
  );
}