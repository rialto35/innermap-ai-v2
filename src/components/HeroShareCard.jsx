'use client';
import { useState, useRef } from 'react';
import { getContinentTheme } from './HeroAvatar';
import { calculateExp, calculateCurrentLevel } from './LevelProgress';
import { getAbilityScores } from './AbilityRadarChart';

export default function HeroShareCard({ 
  mbtiType, 
  enneagramType, 
  colorTypes = [],
  heroName,
  powers = [],
  onShare 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef(null);

  // 영웅 데이터 계산
  const continent = mbtiType ? getContinentFromMBTI(mbtiType) : "Light";
  const continentTheme = getContinentTheme(continent);
  const level = calculateCurrentLevel(calculateExp(mbtiType, enneagramType, colorTypes));
  const abilityScores = getAbilityScores(mbtiType, enneagramType, colorTypes);

  // MBTI별 대륙 매핑
  function getContinentFromMBTI(mbti) {
    const mapping = {
      "INTJ": "Light", "INTP": "Air", "ENTJ": "Thunder", "ENTP": "Lightning",
      "INFJ": "Mist", "INFP": "Water", "ENFJ": "Fire", "ENFP": "Rainbow",
      "ISTJ": "Earth", "ISFJ": "Crystal", "ESTJ": "Thunder", "ESFJ": "Fire",
      "ISTP": "Shadow", "ISFP": "Water", "ESTP": "Lightning", "ESFP": "Rainbow"
    };
    return mapping[mbti] || "Light";
  }

  // 카드 이미지 생성
  const generateCardImage = async () => {
    setIsGenerating(true);
    
    try {
      // HTML2Canvas를 사용하여 카드 이미지 생성
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      // Canvas를 Blob으로 변환
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 0.95);
      });
    } catch (error) {
      console.error('카드 이미지 생성 실패:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // 공유 기능
  const handleShare = async () => {
    if (onShare) {
      const imageBlob = await generateCardImage();
      onShare(imageBlob, {
        mbtiType,
        enneagramType,
        heroName,
        continent,
        level,
        abilityScores
      });
    }
  };

  // 다운로드 기능
  const handleDownload = async () => {
    const imageBlob = await generateCardImage();
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hero-card-${mbtiType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 공유용 카드 */}
      <div 
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl ${continentTheme.bg} ${continentTheme.border} border-4 shadow-2xl`}
        style={{ 
          aspectRatio: '4/5',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* 배경 그라데이션 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${continentTheme.gradient} opacity-90`}></div>
        
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-4 right-4 text-6xl drop-shadow-lg">{continentTheme.icon}</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-60 drop-shadow-lg">{continentTheme.icon}</div>
        </div>
        
        {/* 카드 내용 */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* 헤더 */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎭</div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 mb-2">
              <h2 className="text-2xl font-black text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>InnerMap AI</h2>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <p className="text-white font-bold text-sm" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>144영웅 세계관</p>
            </div>
          </div>
          
          {/* 영웅 아바타 */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-black/40 rounded-full border-4 border-white/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
              <span className="text-4xl">{getHeroEmoji(mbtiType)}</span>
            </div>
          </div>
          
          {/* 영웅 정보 */}
          <div className="text-center mb-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 mb-2">
              <h3 className="text-xl font-black text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                {heroName || `${mbtiType} Hero`}
              </h3>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/30`}>
              <span className="text-lg">{continentTheme.icon}</span>
              <span className="text-white font-bold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>{continentTheme.name}</span>
            </div>
          </div>
          
          {/* 레벨 정보 */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/30`}>
              <span className="text-lg">⭐</span>
              <span className="text-white font-black" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>{level}</span>
            </div>
          </div>
          
          {/* 능력치 요약 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2 w-full">
              {Object.entries(abilityScores).slice(0, 4).map(([ability, score]) => (
                <div key={ability} className="bg-black/50 rounded-lg p-2 backdrop-blur-sm border border-white/30 shadow-lg">
                  <div className="text-white text-xs font-bold text-center" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{ability}</div>
                  <div className="text-white text-lg font-black text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{score}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 하단 정보 */}
          <div className="text-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <div className="text-white font-bold text-xs" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                {new Date().toLocaleDateString('ko-KR')} 생성
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isGenerating ? '생성 중...' : '📥 다운로드'}
        </button>
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isGenerating ? '생성 중...' : '📤 공유'}
        </button>
      </div>
    </div>
  );
}

// MBTI별 영웅 이모지
function getHeroEmoji(mbtiType) {
  const emojis = {
    "INTJ": "🏰", "INTP": "🔬", "ENTJ": "👑", "ENTP": "🎭",
    "INFJ": "🔮", "INFP": "🦋", "ENFJ": "🌅", "ENFP": "🌈",
    "ISTJ": "🏛️", "ISFJ": "🏠", "ESTJ": "🏢", "ESFJ": "🎪",
    "ISTP": "🔧", "ISFP": "🎨", "ESTP": "🎯", "ESFP": "🎪"
  };
  return emojis[mbtiType] || "🎭";
}

// Web Share API 지원 확인
export function canUseWebShare() {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

// 네이티브 공유 기능
export async function shareHeroCard(imageBlob, heroData) {
  if (canUseWebShare()) {
    try {
      const file = new File([imageBlob], `hero-card-${heroData.mbtiType}.png`, {
        type: 'image/png'
      });
      
      await navigator.share({
        title: `내 영웅: ${heroData.heroName}`,
        text: `${heroData.mbtiType} 영웅으로 ${heroData.continent}에서 활동 중!`,
        files: [file]
      });
    } catch (error) {
      console.error('공유 실패:', error);
    }
  } else {
    // 폴백: 클립보드에 복사
    await navigator.clipboard.writeText(
      `내 영웅: ${heroData.heroName} (${heroData.mbtiType}) - ${heroData.continent} 대륙의 ${heroData.level}`
    );
    alert('영웅 정보가 클립보드에 복사되었습니다!');
  }
}
