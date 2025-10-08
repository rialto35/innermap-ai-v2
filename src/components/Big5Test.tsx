'use client';
import { useState } from 'react';
import big5Data from '@/data/big5.json';
import { calculateBig5Scores, getScoreLevel, Big5Scores, Big5Answers } from '@/lib/calculateBig5';

interface Big5TestProps {
  onComplete?: (scores: Big5Scores) => void;
}

export default function Big5Test({ onComplete }: Big5TestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Big5Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [scores, setScores] = useState<Big5Scores | null>(null);

  const questions = big5Data.questions;
  const traits = big5Data.traits;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (score: number) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: score
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 검사 완료 - 점수 계산
      const calculatedScores = calculateBig5Scores(newAnswers, questions);
      setScores(calculatedScores);
      setShowResult(true);
      
      if (onComplete) {
        onComplete(calculatedScores);
      }
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
    setTestStarted(false);
    setScores(null);
  };

  const startTest = () => {
    setTestStarted(true);
  };

  // 결과 화면
  if (showResult && scores) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧬 Big5 성격 검사 결과</h2>
        
        <div className="space-y-6 mb-8">
          {(Object.keys(scores) as Array<keyof Big5Scores>).map((trait) => {
            const score = scores[trait];
            const traitInfo = traits[trait];
            const level = getScoreLevel(score);
            
            return (
              <div key={trait} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{traitInfo.name}</h3>
                    <p className="text-sm text-gray-600">{traitInfo.nameEn}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{score}점</div>
                    <div className="text-sm text-gray-500">{level}</div>
                  </div>
                </div>
                
                {/* 진행바 */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                
                {/* 설명 */}
                <p className="text-sm text-gray-700">
                  {score >= 60 ? traitInfo.high : score <= 40 ? traitInfo.low : traitInfo.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 종합 분석 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-3">📊 종합 분석</h3>
          <p className="text-lg leading-relaxed">
            {generateSummary(scores, traits)}
          </p>
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

  // 시작 화면
  if (!testStarted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🧬 Big5 성격 검사</h2>
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-4">
              10개의 질문으로 당신의 5가지 핵심 성격 특성을 분석합니다.
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 개방성 (Openness): 새로운 경험에 대한 개방성</li>
              <li>• 성실성 (Conscientiousness): 목표 지향성과 조직력</li>
              <li>• 외향성 (Extraversion): 사회적 에너지와 활동성</li>
              <li>• 친화성 (Agreeableness): 타인에 대한 배려</li>
              <li>• 신경성 (Neuroticism): 정서적 안정성</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-sm text-gray-600">
                각 문항에 솔직하게 답해주세요 • 소요시간: 약 2-3분
              </p>
            </div>
          </div>
          <button
            onClick={startTest}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105"
          >
            테스트 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 검사 진행 화면
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Big5 성격 검사</h2>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {currentQuestion.question}
          </p>
        </div>

        {/* 5점 척도 버튼 */}
        <div className="space-y-3">
          {[
            { score: 5, label: '매우 그렇다', color: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' },
            { score: 4, label: '그렇다', color: 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700' },
            { score: 3, label: '보통이다', color: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700' },
            { score: 2, label: '아니다', color: 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700' },
            { score: 1, label: '전혀 아니다', color: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' },
          ].map(({ score, label, color }) => (
            <button
              key={score}
              onClick={() => handleAnswer(score)}
              className={`w-full bg-gradient-to-r ${color} text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105 font-medium text-left flex justify-between items-center`}
            >
              <span>{label}</span>
              <span className="text-sm opacity-75">{score}점</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 종합 분석 텍스트 생성
function generateSummary(
  scores: Big5Scores,
  traits: typeof big5Data.traits
): string {
  const highTraits: string[] = [];
  const lowTraits: string[] = [];

  (Object.keys(scores) as Array<keyof Big5Scores>).forEach((trait) => {
    const score = scores[trait];
    const traitInfo = traits[trait];
    
    if (score >= 70) {
      highTraits.push(traitInfo.name);
    } else if (score <= 30) {
      lowTraits.push(traitInfo.name);
    }
  });

  let summary = "당신의 성격 특성을 분석한 결과, ";

  if (highTraits.length > 0) {
    summary += `${highTraits.join(', ')}이 높아 `;
    highTraits.forEach((trait) => {
      const traitKey = Object.keys(traits).find(
        (key) => traits[key as keyof Big5Scores].name === trait
      ) as keyof Big5Scores;
      summary += `${traits[traitKey].high.toLowerCase().replace(/습니다$/, '')}, `;
    });
  }

  if (lowTraits.length > 0) {
    summary += `${lowTraits.join(', ')}은 낮아 `;
    lowTraits.forEach((trait) => {
      const traitKey = Object.keys(traits).find(
        (key) => traits[key as keyof Big5Scores].name === trait
      ) as keyof Big5Scores;
      summary += `${traits[traitKey].low.toLowerCase().replace(/습니다$/, '')}, `;
    });
  }

  if (highTraits.length === 0 && lowTraits.length === 0) {
    return "모든 성격 특성이 균형잡혀 있어, 상황에 따라 유연하게 대처할 수 있는 능력이 뛰어납니다.";
  }

  return summary.replace(/, $/, '는 모습을 보입니다.');
}

