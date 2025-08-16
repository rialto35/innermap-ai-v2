import React, { useState, useRef } from 'react';
import { heroMapping } from '../data/heroMapping.js';
import { backgroundMapping } from '../data/backgroundMapping.js';
import { heroKoreanNames } from '../data/heroKoreanNames.js';
import { backgroundKoreanDescriptions } from '../data/backgroundKoreanDescriptions.js';

const HeroCard = ({ mbtiType, enneagramType, colorPreference }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const cardRef = useRef(null);

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
  
  // 한글 데이터 가져오기
  const koreanHero = heroKoreanNames[heroKey] || {
    koreanName: `${mbtiType} 영웅`,
    koreanTitle: "당신만의 영웅",
    koreanPowers: ["개성", "창의성", "잠재력"],
    koreanPersonality: "특별한 특성을 가진 당신만의 성격 영웅"
  };
  
  // 배경 선택 (색채 선호도가 있으면 사용, 없으면 기본값)
  const backgroundKey = colorPreference || 'blue';
  const background = backgroundMapping[backgroundKey] || backgroundMapping['blue'];
  const koreanBackground = backgroundKoreanDescriptions[backgroundKey] || backgroundKoreanDescriptions['blue'];
  
  // 이미지 경로
  const imagePath = `/heroes/${heroKey}.png`;

  // 텍스트 복사 함수
  const copyToClipboard = async () => {
    try {
      const heroText = `
🎭 내 영웅: ${koreanHero.koreanName}
🏆 직함: ${koreanHero.koreanTitle}
⚡ 능력: ${koreanHero.koreanPowers.join(', ')}
💫 성격: ${koreanHero.koreanPersonality}
🌍 원소: ${displayHero.element}
🎨 배경: ${koreanBackground.koreanElement} - ${koreanBackground.koreanScene}
🌅 배경 설명: ${koreanBackground.koreanDescription}
      `.trim();
      
      await navigator.clipboard.writeText(heroText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 이미지 저장 함수
  const saveAsImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${displayHero.name}_hero_card.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('이미지 저장 실패:', err);
    }
  };
  
  if (!displayHero) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Hero for this MBTI type not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        ref={cardRef}
        className={`
          relative overflow-hidden rounded-xl p-6 text-white shadow-2xl
          ${background.gradient}
          transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
          border border-white/20
        `}
      >
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
            <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{koreanHero.koreanName}</h3>
            <p className="text-sm opacity-90 mb-3 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">{koreanHero.koreanTitle}</p>
            
            {/* 능력 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-90 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">능력</h4>
              <div className="space-y-1">
                {koreanHero.koreanPowers.map((power, index) => (
                  <div key={index} className="text-xs bg-black/40 rounded-full px-3 py-1 backdrop-blur-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] font-medium">
                    {power}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 성격 설명 */}
            <p className="text-xs opacity-90 italic text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">{koreanHero.koreanPersonality}</p>
            
            {/* 원소 */}
            <div className="mt-3">
              <span className="text-xs bg-black/50 rounded-full px-2 py-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] font-semibold">
                {displayHero.element}
              </span>
            </div>
            
            {/* 배경 설명 */}
            <div className="mt-4 p-3 bg-black/50 rounded-lg backdrop-blur-sm border border-white/20">
              <h4 className="text-xs font-semibold mb-1 opacity-90 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">🌅 배경 환경</h4>
              <p className="text-xs opacity-90 leading-relaxed text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] font-medium">
                {koreanBackground.koreanDescription}
              </p>
            </div>
          </div>
        </div>
        
        {/* 장식 요소 */}
        <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/30 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border border-white/20 rounded-full"></div>
      </div>
      
             {/* 액션 버튼들 */}
       <div className="flex gap-2 mt-4 justify-center">
         <button
           onClick={copyToClipboard}
           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
             copySuccess 
               ? 'bg-green-500 text-white' 
               : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
           }`}
         >
           {copySuccess ? '✅ 복사됨!' : '📋 결과 복사'}
         </button>
         
         <button
           onClick={saveAsImage}
           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
             saveSuccess 
               ? 'bg-green-500 text-white' 
               : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105'
           }`}
         >
           {saveSuccess ? '✅ 저장됨!' : '💾 이미지 저장'}
         </button>
       </div>
       
       {/* PromptCore 브랜딩 */}
       <div className="flex justify-center mt-6">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-black/30 to-gray-800/30 rounded-xl border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
           <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
           <span className="text-xs text-white/80 font-medium tracking-wide">Powered by</span>
           <span className="text-xs text-blue-300 font-bold">PromptCore</span>
         </div>
       </div>
    </div>
  );
};

export default HeroCard;
