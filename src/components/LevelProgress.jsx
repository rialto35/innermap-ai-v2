'use client';
import { useState, useEffect } from 'react';

// 레벨별 경험치 요구량
const levelExpRequirements = {
  "Novice": { current: 0, max: 100, color: "bg-gray-400" },
  "Apprentice": { current: 100, max: 300, color: "bg-blue-400" },
  "Adept": { current: 300, max: 600, color: "bg-green-400" },
  "Expert": { current: 600, max: 1000, color: "bg-purple-400" },
  "Master": { current: 1000, max: 1500, color: "bg-orange-400" },
  "Grandmaster": { current: 1500, max: 2000, color: "bg-yellow-400" }
};

// 레벨별 특별 효과
const levelEffects = {
  "Novice": { 
    icon: "🌱", 
    title: "새로운 시작", 
    description: "영웅의 여정이 시작됩니다",
    glow: "shadow-green-200"
  },
  "Apprentice": { 
    icon: "📚", 
    title: "학습의 단계", 
    description: "기본기를 다지는 중입니다",
    glow: "shadow-blue-200"
  },
  "Adept": { 
    icon: "⚔️", 
    title: "숙련의 단계", 
    description: "실력을 쌓아가고 있습니다",
    glow: "shadow-green-200"
  },
  "Expert": { 
    icon: "🏆", 
    title: "전문가의 단계", 
    description: "뛰어난 능력을 발휘합니다",
    glow: "shadow-purple-200"
  },
  "Master": { 
    icon: "👑", 
    title: "마스터의 단계", 
    description: "완성된 실력의 소유자입니다",
    glow: "shadow-orange-200"
  },
  "Grandmaster": { 
    icon: "🌟", 
    title: "전설의 단계", 
    description: "전설적인 존재가 되었습니다",
    glow: "shadow-yellow-200"
  }
};

export default function LevelProgress({ 
  level, 
  currentExp = 0, 
  showDetails = true,
  size = "medium" 
}) {
  const [progress, setProgress] = useState(0);
  const [levelData, setLevelData] = useState(null);
  const [effect, setEffect] = useState(null);

  useEffect(() => {
    if (level && levelExpRequirements[level]) {
      const data = levelExpRequirements[level];
      const progressPercent = Math.min((currentExp / data.max) * 100, 100);
      setProgress(progressPercent);
      setLevelData(data);
    }

    if (level && levelEffects[level]) {
      setEffect(levelEffects[level]);
    }
  }, [level, currentExp]);

  const sizeClasses = {
    small: "h-2",
    medium: "h-3", 
    large: "h-4"
  };

  if (!levelData || !effect) {
    return (
      <div className="w-full bg-gray-200 rounded-full">
        <div className="h-3 bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 레벨 정보 */}
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{effect.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-800">{effect.title}</h4>
              <p className="text-sm text-gray-600">{effect.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {currentExp} / {levelData.max} EXP
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(progress)}% 완료
            </div>
          </div>
        </div>
      )}

      {/* 진행바 */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${levelData.color} rounded-full transition-all duration-1000 ease-out ${effect.glow}`}
          style={{ width: `${progress}%` }}
        >
          {/* 그라데이션 효과 */}
          <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* 다음 레벨까지 남은 경험치 */}
      {showDetails && currentExp < levelData.max && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            다음 레벨까지 {levelData.max - currentExp} EXP 필요
          </span>
        </div>
      )}

      {/* 레벨 완료 표시 */}
      {currentExp >= levelData.max && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <span>🎉</span>
            <span>레벨 업 가능!</span>
          </div>
        </div>
      )}
    </div>
  );
}

// 경험치 계산 헬퍼 함수
export function calculateExp(mbtiType, enneagramType, colorTypes) {
  let baseExp = 0;
  
  // MBTI별 기본 경험치
  const mbtiExp = {
    "INTJ": 150, "INTP": 140, "ENTJ": 160, "ENTP": 155,
    "INFJ": 145, "INFP": 135, "ENFJ": 150, "ENFP": 140,
    "ISTJ": 130, "ISFJ": 125, "ESTJ": 135, "ESFJ": 130,
    "ISTP": 120, "ISFP": 115, "ESTP": 125, "ESFP": 120
  };
  
  // 에니어그램별 보너스 경험치
  const enneagramBonus = {
    "1": 20, "2": 15, "3": 25, "4": 18, "5": 22,
    "6": 16, "7": 20, "8": 24, "9": 12
  };
  
  // 색채심리별 추가 경험치
  const colorBonus = colorTypes ? colorTypes.length * 10 : 0;
  
  baseExp = (mbtiExp[mbtiType] || 100) + (enneagramBonus[enneagramType] || 0) + colorBonus;
  
  return Math.min(baseExp, 2000); // 최대 2000 EXP
}

// 현재 레벨 계산 헬퍼 함수
export function calculateCurrentLevel(exp) {
  const levels = Object.keys(levelExpRequirements);
  
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    const requirement = levelExpRequirements[level];
    
    if (exp >= requirement.current) {
      return level;
    }
  }
  
  return "Novice";
}
