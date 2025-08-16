import React, { useState, useEffect } from 'react';
import { heroMapping } from '../data/heroMapping.js';

const HeroCard = ({ mbtiType, enneagramType }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // MBTI와 에니어그램 조합으로 영웅 키 생성
  const heroKey = enneagramType ? `${mbtiType}_${enneagramType}` : mbtiType;
  const hero = heroMapping[heroKey];
  
  // 임시 기본 히어로 데이터 (이미지가 없을 때 사용)
  const fallbackHero = {
    name: `${mbtiType} 히어로`,
    title: "당신만의 영웅",
    powers: ["개성", "창의성", "잠재력"],
    personality: "당신만의 독특한 성격을 가진 영웅입니다",
    gradient: "from-blue-500 to-purple-600"
  };
  
  const displayHero = hero || fallbackHero;
  
  // 이미지 경로 생성
  const imagePath = `/heroes/${heroKey}.png`;
  
  // 이미지 로딩 처리
  useEffect(() => {
    if (enneagramType) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = imagePath;
    }
  }, [heroKey, imagePath, enneagramType]);
  
  if (!displayHero) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">해당 MBTI 유형의 히어로를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`
        relative overflow-hidden rounded-xl p-6 text-white shadow-2xl
        bg-gradient-to-br ${displayHero.gradient || 'from-blue-500 to-purple-600'}
        transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
        border border-white/20
      `}>
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* 카드 내용 */}
        <div className="relative z-10">
          {/* 히어로 이미지 또는 이모지 */}
          <div className="text-center mb-4">
            {enneagramType && !imageError ? (
              <div className="relative mb-2">
                {!imageLoaded && (
                  <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <div className="text-4xl">🎭</div>
                  </div>
                )}
                                 <img
                   src={imagePath}
                   alt={displayHero.name}
                  className={`w-24 h-24 mx-auto rounded-full object-cover border-2 border-white/30 ${
                    imageLoaded ? 'block' : 'hidden'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="text-6xl mb-2">🎭</div>
            )}
                         <h3 className="text-2xl font-bold mb-1">{displayHero.name}</h3>
            <p className="text-lg opacity-90">{mbtiType}</p>
            {enneagramType && (
              <p className="text-sm opacity-70">에니어그램 {enneagramType.replace('type', '')}</p>
            )}
          </div>
          
          {/* 구분선 */}
          <div className="w-full h-px bg-white/30 mb-4"></div>
          
          {/* 특성들 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold opacity-80 mb-3">핵심 특성</h4>
                         {displayHero.powers.map((power, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">{power}</span>
              </div>
            ))}
          </div>
          
          {/* 성격 설명 */}
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
                         <p className="text-xs opacity-80 italic">{displayHero.personality}</p>
          </div>
          
          {/* 카드 하단 장식 */}
          <div className="absolute bottom-2 right-2 text-xs opacity-50">
            INNERMAP AI
          </div>
        </div>
        
        {/* 카드 테두리 효과 */}
        <div className="absolute inset-0 rounded-xl border-2 border-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default HeroCard;
