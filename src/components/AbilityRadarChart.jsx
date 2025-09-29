'use client';
import { useState, useEffect } from 'react';

// 5개 핵심 능력치 정의
const abilities = {
  "전략": { icon: "🧠", color: "text-blue-600", bg: "bg-blue-100" },
  "창의": { icon: "🎨", color: "text-purple-600", bg: "bg-purple-100" },
  "소통": { icon: "💬", color: "text-green-600", bg: "bg-green-100" },
  "리더십": { icon: "👑", color: "text-orange-600", bg: "bg-orange-100" },
  "공감": { icon: "💝", color: "text-pink-600", bg: "bg-pink-100" }
};

// MBTI별 능력치 점수 계산
function calculateMBTIAbilities(mbtiType) {
  const abilityScores = {
    "INTJ": { 전략: 95, 창의: 80, 소통: 60, 리더십: 85, 공감: 50 },
    "INTP": { 전략: 90, 창의: 95, 소통: 55, 리더십: 60, 공감: 45 },
    "ENTJ": { 전략: 90, 창의: 70, 소통: 80, 리더십: 95, 공감: 60 },
    "ENTP": { 전략: 85, 창의: 90, 소통: 85, 리더십: 80, 공감: 70 },
    "INFJ": { 전략: 80, 창의: 85, 소통: 75, 리더십: 70, 공감: 95 },
    "INFP": { 전략: 60, 창의: 90, 소통: 70, 리더십: 50, 공감: 90 },
    "ENFJ": { 전략: 70, 창의: 75, 소통: 95, 리더십: 90, 공감: 90 },
    "ENFP": { 전략: 75, 창의: 95, 소통: 90, 리더십: 75, 공감: 85 },
    "ISTJ": { 전략: 85, 창의: 60, 소통: 65, 리더십: 70, 공감: 55 },
    "ISFJ": { 전략: 70, 창의: 65, 소통: 80, 리더십: 60, 공감: 85 },
    "ESTJ": { 전략: 80, 창의: 55, 소통: 75, 리더십: 85, 공감: 60 },
    "ESFJ": { 전략: 65, 창의: 60, 소통: 90, 리더십: 80, 공감: 90 },
    "ISTP": { 전략: 80, 창의: 85, 소통: 50, 리더십: 55, 공감: 45 },
    "ISFP": { 전략: 55, 창의: 85, 소통: 70, 리더십: 50, 공감: 85 },
    "ESTP": { 전략: 70, 창의: 80, 소통: 85, 리더십: 80, 공감: 70 },
    "ESFP": { 전략: 60, 창의: 80, 소통: 90, 리더십: 70, 공감: 90 }
  };
  
  return abilityScores[mbtiType] || { 전략: 50, 창의: 50, 소통: 50, 리더십: 50, 공감: 50 };
}

// 에니어그램별 능력치 보너스
function calculateEnneagramBonus(enneagramType) {
  const bonuses = {
    "1": { 전략: 10, 창의: 5, 소통: 5, 리더십: 10, 공감: 5 },
    "2": { 전략: 5, 창의: 5, 소통: 15, 리더십: 10, 공감: 20 },
    "3": { 전략: 15, 창의: 10, 소통: 10, 리더십: 20, 공감: 5 },
    "4": { 전략: 5, 창의: 20, 소통: 10, 리더십: 5, 공감: 15 },
    "5": { 전략: 20, 창의: 15, 소통: 5, 리더십: 5, 공감: 5 },
    "6": { 전략: 10, 창의: 5, 소통: 10, 리더십: 10, 공감: 10 },
    "7": { 전략: 10, 창의: 20, 소통: 15, 리더십: 10, 공감: 10 },
    "8": { 전략: 15, 창의: 10, 소통: 10, 리더십: 20, 공감: 5 },
    "9": { 전략: 5, 창의: 10, 소통: 15, 리더십: 5, 공감: 15 }
  };
  
  return bonuses[enneagramType] || { 전략: 0, 창의: 0, 소통: 0, 리더십: 0, 공감: 0 };
}

export default function AbilityRadarChart({ 
  mbtiType, 
  enneagramType, 
  colorTypes = [],
  size = "medium",
  showLabels = true 
}) {
  const [abilityScores, setAbilityScores] = useState({});
  const [maxScore, setMaxScore] = useState(100);

  useEffect(() => {
    if (mbtiType) {
      const mbtiAbilities = calculateMBTIAbilities(mbtiType);
      const enneagramBonus = calculateEnneagramBonus(enneagramType);
      
      // 색채심리 보너스 (각 색상당 5점씩)
      const colorBonus = colorTypes.length * 5;
      
      const finalScores = {};
      Object.keys(abilities).forEach(ability => {
        const baseScore = mbtiAbilities[ability] || 50;
        const bonus = enneagramBonus[ability] || 0;
        finalScores[ability] = Math.min(baseScore + bonus + colorBonus, 100);
      });
      
      setAbilityScores(finalScores);
      setMaxScore(Math.max(...Object.values(finalScores)));
    }
  }, [mbtiType, enneagramType, colorTypes]);

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64"
  };

  if (Object.keys(abilityScores).length === 0) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 rounded-full`}>
        <span className="text-gray-400">📊</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 레이더 차트 */}
      <div className={`${sizeClasses[size]} mx-auto relative`}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 200 200"
        >
          {/* 배경 원형 그리드 */}
          {[20, 40, 60, 80, 100].map((radius, index) => (
            <circle
              key={index}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* 능력치 축 */}
          {Object.keys(abilities).map((ability, index) => {
            const angle = (index * 72) - 90; // 72도씩 회전 (360/5)
            const x = 100 + 90 * Math.cos(angle * Math.PI / 180);
            const y = 100 + 90 * Math.sin(angle * Math.PI / 180);
            
            return (
              <line
                key={ability}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#d1d5db"
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}
          
          {/* 능력치 데이터 포인트 */}
          {Object.keys(abilities).map((ability, index) => {
            const angle = (index * 72) - 90;
            const score = abilityScores[ability] || 0;
            const radius = (score / 100) * 90;
            const x = 100 + radius * Math.cos(angle * Math.PI / 180);
            const y = 100 + radius * Math.sin(angle * Math.PI / 180);
            
            return (
              <circle
                key={`point-${ability}`}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="drop-shadow-sm"
              />
            );
          })}
          
          {/* 능력치 영역 */}
          <polygon
            points={Object.keys(abilities).map((ability, index) => {
              const angle = (index * 72) - 90;
              const score = abilityScores[ability] || 0;
              const radius = (score / 100) * 90;
              const x = 100 + radius * Math.cos(angle * Math.PI / 180);
              const y = 100 + radius * Math.sin(angle * Math.PI / 180);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* 중심점 */}
          <circle
            cx="100"
            cy="100"
            r="3"
            fill="#1d4ed8"
          />
        </svg>
      </div>

      {/* 능력치 라벨 */}
      {showLabels && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.keys(abilities).map((ability) => {
            const abilityData = abilities[ability];
            const score = abilityScores[ability] || 0;
            
            return (
              <div key={ability} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${abilityData.bg} mb-2`}>
                  <span className="text-xl">{abilityData.icon}</span>
                </div>
                <div className={`text-sm font-medium ${abilityData.color}`}>
                  {ability}
                </div>
                <div className="text-xs text-gray-600">
                  {score}점
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 전체 점수 */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
          <span className="text-lg">⚡</span>
          <span className="font-semibold text-blue-800">
            종합 능력치: {Math.round(Object.values(abilityScores).reduce((a, b) => a + b, 0) / 5)}점
          </span>
        </div>
      </div>
    </div>
  );
}

// 능력치 점수를 가져오는 헬퍼 함수
export function getAbilityScores(mbtiType, enneagramType, colorTypes = []) {
  const mbtiAbilities = calculateMBTIAbilities(mbtiType);
  const enneagramBonus = calculateEnneagramBonus(enneagramType);
  const colorBonus = colorTypes.length * 5;
  
  const finalScores = {};
  Object.keys(abilities).forEach(ability => {
    const baseScore = mbtiAbilities[ability] || 50;
    const bonus = enneagramBonus[ability] || 0;
    finalScores[ability] = Math.min(baseScore + bonus + colorBonus, 100);
  });
  
  return finalScores;
}
