'use client';
import { useState, useEffect } from 'react';

// 12개 대륙별 테마 데이터
const continentThemes = {
  "Light": {
    name: "빛의 대륙",
    gradient: "from-yellow-100 via-amber-50 to-yellow-200",
    border: "border-yellow-300",
    accent: "text-yellow-600",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-100",
    icon: "☀️",
    description: "이상과 원칙이 지배하는 신성한 땅"
  },
  "Water": {
    name: "물의 대륙", 
    gradient: "from-blue-100 via-cyan-50 to-blue-200",
    border: "border-blue-300",
    accent: "text-blue-600",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
    icon: "🌊",
    description: "감정과 직감이 흐르는 신비로운 바다"
  },
  "Wind": {
    name: "바람의 대륙",
    gradient: "from-green-100 via-emerald-50 to-green-200", 
    border: "border-green-300",
    accent: "text-green-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-100",
    icon: "🌪️",
    description: "자유와 변화가 불어오는 열린 하늘"
  },
  "Fire": {
    name: "불의 대륙",
    gradient: "from-red-100 via-orange-50 to-red-200",
    border: "border-red-300", 
    accent: "text-red-600",
    bg: "bg-gradient-to-br from-red-50 to-orange-100",
    icon: "🔥",
    description: "열정과 창의성이 타오르는 용암의 땅"
  },
  "Earth": {
    name: "대지의 대륙",
    gradient: "from-amber-100 via-yellow-50 to-amber-200",
    border: "border-amber-300",
    accent: "text-amber-600", 
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    icon: "🏔️",
    description: "안정과 신뢰가 뿌리내린 견고한 땅"
  },
  "Air": {
    name: "공기의 대륙",
    gradient: "from-sky-100 via-blue-50 to-sky-200",
    border: "border-sky-300",
    accent: "text-sky-600",
    bg: "bg-gradient-to-br from-sky-50 to-blue-100", 
    icon: "☁️",
    description: "지식과 사고가 순환하는 지적 공간"
  },
  "Lightning": {
    name: "번개의 대륙",
    gradient: "from-purple-100 via-violet-50 to-purple-200",
    border: "border-purple-300",
    accent: "text-purple-600",
    bg: "bg-gradient-to-br from-purple-50 to-violet-100",
    icon: "⚡",
    description: "즉흥과 다양성이 번개치는 역동적 공간"
  },
  "Thunder": {
    name: "천둥의 대륙", 
    gradient: "from-indigo-100 via-purple-50 to-indigo-200",
    border: "border-indigo-300",
    accent: "text-indigo-600",
    bg: "bg-gradient-to-br from-indigo-50 to-purple-100",
    icon: "⛈️",
    description: "강력한 의지와 변화가 울리는 위대한 땅"
  },
  "Mist": {
    name: "안개의 대륙",
    gradient: "from-gray-100 via-slate-50 to-gray-200",
    border: "border-gray-300",
    accent: "text-gray-600",
    bg: "bg-gradient-to-br from-gray-50 to-slate-100",
    icon: "🌫️",
    description: "평화와 조화가 감싸는 신비로운 영역"
  },
  "Crystal": {
    name: "수정의 대륙",
    gradient: "from-pink-100 via-rose-50 to-pink-200",
    border: "border-pink-300",
    accent: "text-pink-600",
    bg: "bg-gradient-to-br from-pink-50 to-rose-100",
    icon: "💎",
    description: "순수와 투명함이 빛나는 결정의 땅"
  },
  "Shadow": {
    name: "그림자의 대륙",
    gradient: "from-slate-100 via-gray-50 to-slate-200",
    border: "border-slate-300",
    accent: "text-slate-600",
    bg: "bg-gradient-to-br from-slate-50 to-gray-100",
    icon: "🌑",
    description: "신비와 깊이가 숨겨진 어둠의 영역"
  },
  "Rainbow": {
    name: "무지개의 대륙",
    gradient: "from-rainbow-100 via-rainbow-50 to-rainbow-200",
    border: "border-rainbow-300",
    accent: "text-rainbow-600",
    bg: "bg-gradient-to-br from-rainbow-50 to-rainbow-100",
    icon: "🌈",
    description: "다양성과 조화가 만나는 아름다운 땅"
  },
  "Steel": {
    name: "강철의 대륙",
    gradient: "from-gray-200 via-slate-100 to-gray-300",
    border: "border-gray-400",
    accent: "text-gray-700",
    bg: "bg-gradient-to-br from-gray-100 to-slate-200",
    icon: "⚔️",
    description: "강인함과 전략이 빛나는 금속의 땅"
  }
};

// MBTI별 영웅 아바타 이모지 조합 (개선된 버전)
const mbtiAvatars = {
  "INTJ": { 
    base: "🏰", element: "⚔️", aura: "✨", 
    title: "전략의 현자", 
    description: "체계적 사고의 마법사",
    specialEffect: "glow-purple"
  },
  "INTP": { 
    base: "🔬", element: "🧠", aura: "💫", 
    title: "지혜의 탐구자", 
    description: "논리의 대가",
    specialEffect: "glow-blue"
  },
  "ENTJ": { 
    base: "👑", element: "⚡", aura: "🌟", 
    title: "리더십의 제왕", 
    description: "카리스마의 지배자",
    specialEffect: "glow-gold"
  },
  "ENTP": { 
    base: "🎭", element: "🔥", aura: "💥", 
    title: "혁신의 연출가", 
    description: "창의성의 화신",
    specialEffect: "glow-orange"
  },
  "INFJ": { 
    base: "🔮", element: "🌙", aura: "✨", 
    title: "직감의 예언자", 
    description: "미래를 보는 현자",
    specialEffect: "glow-silver"
  },
  "INFP": { 
    base: "🦋", element: "🌸", aura: "💖", 
    title: "꿈의 수호자", 
    description: "순수한 영혼의 기사",
    specialEffect: "glow-pink"
  },
  "ENFJ": { 
    base: "🌅", element: "☀️", aura: "🌟", 
    title: "영감의 선도자", 
    description: "희망의 전달자",
    specialEffect: "glow-yellow"
  },
  "ENFP": { 
    base: "🌈", element: "🎨", aura: "💫", 
    title: "열정의 예술가", 
    description: "자유로운 영혼",
    specialEffect: "glow-rainbow"
  },
  "ISTJ": { 
    base: "🏛️", element: "🛡️", aura: "💎", 
    title: "신뢰의 수호자", 
    description: "안정의 기둥",
    specialEffect: "glow-gray"
  },
  "ISFJ": { 
    base: "🏠", element: "🤲", aura: "💝", 
    title: "사랑의 수호자", 
    description: "따뜻한 마음의 기사",
    specialEffect: "glow-green"
  },
  "ESTJ": { 
    base: "🏢", element: "⚖️", aura: "💼", 
    title: "질서의 관리자", 
    description: "효율성의 마스터",
    specialEffect: "glow-blue"
  },
  "ESFJ": { 
    base: "🎪", element: "🎉", aura: "🎊", 
    title: "화합의 연출가", 
    description: "기쁨의 전달자",
    specialEffect: "glow-cyan"
  },
  "ISTP": { 
    base: "🔧", element: "⚙️", aura: "💡", 
    title: "기술의 장인", 
    description: "실용성의 마스터",
    specialEffect: "glow-amber"
  },
  "ISFP": { 
    base: "🎨", element: "🖌️", aura: "🌸", 
    title: "아름다움의 화가", 
    description: "감성의 예술가",
    specialEffect: "glow-rose"
  },
  "ESTP": { 
    base: "🎯", element: "🏃", aura: "⚡", 
    title: "행동의 용사", 
    description: "모험의 탐험가",
    specialEffect: "glow-red"
  },
  "ESFP": { 
    base: "🎪", element: "🎭", aura: "🎊", 
    title: "즐거움의 연예인", 
    description: "웃음의 마법사",
    specialEffect: "glow-violet"
  }
};

// 레벨별 시각적 표현
const levelStyles = {
  "Novice": { color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300", koreanName: "견습자" },
  "Apprentice": { color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-300", koreanName: "수습자" },
  "Adept": { color: "text-green-500", bg: "bg-green-100", border: "border-green-300", koreanName: "숙련자" },
  "Expert": { color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-300", koreanName: "전문가" },
  "Master": { color: "text-orange-500", bg: "bg-orange-100", border: "border-orange-300", koreanName: "마스터" },
  "Grandmaster": { color: "text-yellow-500", bg: "bg-yellow-100", border: "border-yellow-300", koreanName: "그랜드마스터" }
};

export default function HeroAvatar({ 
  mbtiType, 
  retiType,
  continent, 
  level, 
  heroName, 
  powers = [], 
  size = "large",
  showDetails = true
}) {
  const [avatarData, setAvatarData] = useState({
    base: "🎭", 
    element: "⚔️", 
    aura: "✨", 
    title: "기본 영웅", 
    description: "영웅 데이터 로딩 중",
    specialEffect: "glow-gray"
  });
  const [continentTheme, setContinentTheme] = useState({
    name: "기본 대륙",
    gradient: "from-gray-100 via-slate-50 to-gray-200",
    border: "border-gray-300",
    accent: "text-gray-600",
    bg: "bg-gradient-to-br from-gray-50 to-slate-100",
    icon: "🌍",
    description: "기본 영역"
  });
  const [levelStyle, setLevelStyle] = useState(null);

  useEffect(() => {
    // MBTI 아바타 데이터 설정 (기본값 포함)
    if (mbtiType && mbtiAvatars[mbtiType]) {
      setAvatarData(mbtiAvatars[mbtiType]);
    } else {
      // 기본 아바타 데이터 설정
      setAvatarData({
        base: "🎭", 
        element: "⚔️", 
        aura: "✨", 
        title: "기본 영웅", 
        description: "영웅 데이터 로딩 중",
        specialEffect: "glow-gray"
      });
    }

    // 대륙 테마 설정 (기본값 포함)
    if (continent && continentThemes[continent]) {
      setContinentTheme(continentThemes[continent]);
    } else {
      // 기본 대륙 테마 설정
      setContinentTheme({
        name: "기본 대륙",
        gradient: "from-gray-100 via-slate-50 to-gray-200",
        border: "border-gray-300",
        accent: "text-gray-600",
        bg: "bg-gradient-to-br from-gray-50 to-slate-100",
        icon: "🌍",
        description: "기본 영역"
      });
    }

    // 레벨 스타일 설정
    if (level && levelStyles[level]) {
      setLevelStyle(levelStyles[level]);
    }
  }, [mbtiType, continent, level]);

  const sizeClasses = {
    small: "w-16 h-16 text-2xl",
    medium: "w-24 h-24 text-3xl", 
    large: "w-32 h-32 text-4xl",
    xlarge: "w-40 h-40 text-5xl"
  };

  // avatarData와 continentTheme이 항상 설정되므로 로딩 조건 제거

  // 안전한 기본값 설정
  const safeContinentTheme = continentTheme || {
    name: "기본 대륙",
    gradient: "from-gray-100 via-slate-50 to-gray-200",
    border: "border-gray-300",
    accent: "text-gray-600",
    bg: "bg-gradient-to-br from-gray-50 to-slate-100",
    icon: "🌍",
    description: "기본 영역"
  };

  const safeAvatarData = avatarData || {
    base: "🎭", 
    element: "⚔️", 
    aura: "✨", 
    title: "기본 영웅", 
    description: "영웅 데이터 로딩 중",
    specialEffect: "glow-gray"
  };

  return (
    <div className="relative" suppressHydrationWarning={true}>
      {/* 영웅 아바타 */}
      <div className={`${sizeClasses[size]} rounded-full ${safeContinentTheme.bg} ${safeContinentTheme.border} border-4 flex items-center justify-center relative overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300`}>
        {/* 배경 그라데이션 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${safeContinentTheme.gradient} opacity-60`}></div>
        
        {/* 특수 효과 배경 */}
        <div className={`absolute inset-0 rounded-full ${safeAvatarData.specialEffect === 'glow-purple' ? 'bg-purple-500/20' : 
          safeAvatarData.specialEffect === 'glow-blue' ? 'bg-blue-500/20' :
          safeAvatarData.specialEffect === 'glow-gold' ? 'bg-yellow-500/20' :
          safeAvatarData.specialEffect === 'glow-orange' ? 'bg-orange-500/20' :
          safeAvatarData.specialEffect === 'glow-silver' ? 'bg-gray-500/20' :
          safeAvatarData.specialEffect === 'glow-pink' ? 'bg-pink-500/20' :
          safeAvatarData.specialEffect === 'glow-yellow' ? 'bg-yellow-400/20' :
          safeAvatarData.specialEffect === 'glow-rainbow' ? 'bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20' :
          safeAvatarData.specialEffect === 'glow-gray' ? 'bg-gray-400/20' :
          safeAvatarData.specialEffect === 'glow-green' ? 'bg-green-500/20' :
          safeAvatarData.specialEffect === 'glow-cyan' ? 'bg-cyan-500/20' :
          safeAvatarData.specialEffect === 'glow-amber' ? 'bg-amber-500/20' :
          safeAvatarData.specialEffect === 'glow-rose' ? 'bg-rose-500/20' :
          safeAvatarData.specialEffect === 'glow-red' ? 'bg-red-500/20' :
          safeAvatarData.specialEffect === 'glow-violet' ? 'bg-violet-500/20' : 'bg-gray-500/20'
        } animate-pulse`}></div>
        
        {/* 히어로 이미지 - 강제 표시 */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <img 
            src={`/heroes/${mbtiType}_type${retiType || '4'}.png`}
            alt={`${mbtiType} 영웅`}
            className="w-full h-full rounded-full object-cover"
            style={{display: 'block'}}
            onError={(e) => {
              if (typeof window !== 'undefined') {
                console.error('이미지 로딩 실패:', `/heroes/${mbtiType}_type${retiType || '4'}.png`);
              }
              e.target.style.display = 'none';
              // 폴백 이모지 표시
              const fallback = e.target.nextElementSibling;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
            onLoad={() => {
              if (typeof window !== 'undefined') {
                console.log('이미지 로딩 성공:', `/heroes/${mbtiType}_type${retiType || '4'}.png`);
              }
            }}
          />
          
          {/* 기본 이모지 (이미지 실패시 폴백) */}
          <div className="flex flex-col items-center justify-center" style={{display: 'none'}}>
            <div className="text-4xl mb-1 drop-shadow-lg" style={{fontSize: '2.5rem'}}>
              {avatarData?.base || '🎭'}
            </div>
            <div className="text-2xl drop-shadow-md" style={{fontSize: '1.5rem'}}>
              {avatarData?.element || '⚔️'}
            </div>
            <div className="text-lg drop-shadow-sm" style={{fontSize: '1rem'}}>
              {avatarData?.aura || '✨'}
            </div>
          </div>
        </div>
        
        {/* 오라 효과 */}
        <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse"></div>
        
        {/* 레벨 배지 */}
        {levelStyle && (
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${levelStyle.bg} ${levelStyle.border} border-2 rounded-full flex items-center justify-center shadow-lg animate-bounce`}>
            <span className={`text-sm font-bold ${levelStyle.color}`}>
              {level?.charAt(0) || 'N'}
            </span>
          </div>
        )}
      </div>

      {/* 상세 정보 */}
      {showDetails && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{heroName || safeAvatarData.title || 'Unknown Hero'}</h3>
          <p className="text-sm text-gray-600 mb-2">{safeAvatarData.description}</p>
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${safeContinentTheme.bg} ${safeContinentTheme.border} border mb-2`}>
            <span className="text-lg">{safeContinentTheme.icon}</span>
            <span className={`text-sm font-medium ${safeContinentTheme.accent}`}>
              {safeContinentTheme.name}
            </span>
          </div>
          
          {level && levelStyle && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${levelStyle.bg} ${levelStyle.border} border text-xs font-medium ${levelStyle.color} mt-2`}>
              <span>⭐</span>
              <span>{levelStyle.koreanName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// 대륙별 테마를 가져오는 헬퍼 함수
export function getContinentTheme(continent) {
  return continentThemes[continent] || continentThemes["Light"];
}

// 레벨별 스타일을 가져오는 헬퍼 함수  
export function getLevelStyle(level) {
  return levelStyles[level] || levelStyles["Novice"];
}
