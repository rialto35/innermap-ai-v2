import React, { useState } from 'react';
import { heroMapping } from '../data/heroMapping.js';
import { backgroundMapping } from '../data/backgroundMapping.js';

const HeroCard = ({ mbtiType, enneagramType, colorPreference }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // MBTI와 에니어그램 조합으로 영웅 키 생성
  const heroKey = enneagramType ? `${mbtiType}_${enneagramType}` : mbtiType;
  const hero = heroMapping[heroKey];
  
  // 임시 기본 히어로 데이터 (이미지가 없을 때 사용)
  const fallbackHero = {
    name: `${mbtiType} Hero`,
    title: "Your Unique Hero",
    powers: ["Individuality", "Creativity", "Potential"],
    personality: "Your unique personality hero with special characteristics",
    element: "Light"
  };
  
  const displayHero = hero || fallbackHero;
  
  // 배경 선택 (색채 선호도가 있으면 사용, 없으면 기본값)
  const backgroundKey = colorPreference || 'blue';
  const background = backgroundMapping[backgroundKey] || backgroundMapping['blue'];
  
  // 이미지 경로
  const imagePath = `/heroes/${heroKey}.png`;
  
  if (!displayHero) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Hero for this MBTI type not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`
        relative overflow-hidden rounded-xl p-6 text-white shadow-2xl
        ${background.gradient}
        transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
        border border-white/20
      `}>
        {/* 배경 효과 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        
        {/* 카드 내용 */}
        <div className="relative z-10">
          {/* 영웅 이미지 */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
              {!imageError ? (
                <img
                  src={imagePath}
                  alt={displayHero.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : null}
              
              {/* 로딩 상태 또는 기본 아이콘 */}
              {(!imageLoaded && !imageError) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* 이미지 로드 실패 시 기본 아이콘 */}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl">⚔️</div>
                </div>
              )}
            </div>
          </div>
          
          {/* 영웅 정보 */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1">{displayHero.name}</h3>
            <p className="text-sm opacity-90 mb-3">{displayHero.title}</p>
            
            {/* 능력 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">POWERS</h4>
              <div className="space-y-1">
                {displayHero.powers.map((power, index) => (
                  <div key={index} className="text-xs bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                    {power}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 성격 설명 */}
            <p className="text-xs opacity-80 italic">{displayHero.personality}</p>
            
            {/* 원소 */}
            <div className="mt-3">
              <span className="text-xs bg-white/20 rounded-full px-2 py-1">
                {displayHero.element}
              </span>
            </div>
          </div>
        </div>
        
        {/* 장식 요소 */}
        <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/30 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border border-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroCard;
