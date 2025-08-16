'use client';
import { useState } from 'react';
import enneagramData from '@/data/enneagram.json';

export default function EnneagramTest() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const questions = enneagramData.questions;

  const handleAnswer = (questionId, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const calculateResult = () => {
    const scores = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
    
    questions.forEach(q => {
      const answer = answers[q.id] || 0;
      if (answer > 0) {
        scores[q.type] += answer;
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const resultType = Object.keys(scores).find(key => scores[key] === maxScore);
    
    setAnswers({ ...answers, result: resultType, scores });
    setShowResult(true);
  };

  const resetTest = () => {
    setAnswers({});
    setShowResult(false);
    setTestStarted(false);
  };

  if (showResult) {
    const result = enneagramData.types[answers.result];
    const scores = answers.scores;
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔢 에니어그램 결과</h2>
        
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-4">
            <h3 className="text-3xl font-bold mb-2">유형 {answers.result}</h3>
            <h4 className="text-xl mb-2">{result.name}</h4>
            <h5 className="text-lg mb-2">{result.title}</h5>
            <p className="text-sm">{result.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">핵심 감정</h4>
            <p className="text-gray-700">{result.core}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">기본 욕구</h4>
            <p className="text-gray-700">{result.desire}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">기본 두려움</h4>
            <p className="text-gray-700">{result.fear}</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-gray-800 mb-2">📊 상위 3개 유형</h4>
          <div className="space-y-2">
            {sortedTypes.map(([type, score], index) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm">
                  {index + 1}위: 유형 {type} - {enneagramData.types[type].name}
                </span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(score / Math.max(...Object.values(scores))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{score}점</span>
              </div>
            ))}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔢 에니어그램 테스트</h2>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-4">
              27개 문항으로 당신의 핵심 동기와 성격 패턴을 분석합니다.
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 각 문항을 읽고 1-5점으로 평가해주세요</li>
              <li>• 1점: 전혀 아님 ~ 5점: 매우 그럼</li>
              <li>• 소요시간: 약 5-7분</li>
            </ul>
          </div>
          <button
            onClick={() => setTestStarted(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            테스트 시작하기
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">에니어그램 테스트</h2>
          <span className="text-sm text-gray-500">
            {answeredCount} / {totalQuestions}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 mb-3">
              {index + 1}. {question.question}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">전혀 아님</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleAnswer(question.id, score)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      answers[question.id] === score
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500">매우 그럼</span>
            </div>
          </div>
        ))}
      </div>

      {answeredCount === totalQuestions && (
        <div className="text-center mt-6">
          <button
            onClick={calculateResult}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            결과 보기
          </button>
        </div>
      )}
    </div>
  );
}