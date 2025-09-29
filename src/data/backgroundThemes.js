export const backgroundThemes = {
  // 빨간색 계열
  red: {
    gradient: "linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #ef4444 100%)",
    environment: "화산과 용암",
    description: "열정과 역동성을 상징하는 화산 환경",
    emoji: "🌋"
  },
  
  // 파란색 계열  
  blue: {
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)",
    environment: "깊은 바다", 
    description: "평온과 신뢰를 상징하는 바다 환경",
    emoji: "🌊"
  },
  
  // 초록색 계열
  green: {
    gradient: "linear-gradient(135deg, #047857 0%, #10b981 50%, #22c55e 100%)",
    environment: "신비한 숲",
    description: "자연과 치유를 상징하는 숲 환경", 
    emoji: "🌲"
  },
  
  // 보라색 계열
  purple: {
    gradient: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a855f7 100%)",
    environment: "신비한 우주",
    description: "신비와 직관을 상징하는 우주 환경",
    emoji: "🌌"
  },
  
  // 주황색 계열
  orange: {
    gradient: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)",
    environment: "황금 사막", 
    description: "활력과 창의성을 상징하는 사막 환경",
    emoji: "🏜️"
  },
  
  // 노란색 계열
  yellow: {
    gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #facc15 100%)",
    environment: "밝은 초원",
    description: "희망과 기쁨을 상징하는 초원 환경", 
    emoji: "🌻"
  },
  
  // 분홍색 계열
  pink: {
    gradient: "linear-gradient(135deg, #be185d 0%, #ec4899 50%, #f472b6 100%)",
    environment: "벚꽃 정원",
    description: "사랑과 따뜻함을 상징하는 정원 환경",
    emoji: "🌸"
  },
  
  // 터콰이즈 계열
  turquoise: {
    gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)",
    environment: "열대 바다",
    description: "자유와 독립을 상징하는 열대 바다 환경",
    emoji: "🏝️"
  },
  
  // 인디고 계열
  indigo: {
    gradient: "linear-gradient(135deg, #3730a3 0%, #6366f1 50%, #8b5cf6 100%)",
    environment: "밤하늘",
    description: "이해와 지혜를 상징하는 밤하늘 환경",
    emoji: "🌙"
  },
  
  // 마젠타 계열
  magenta: {
    gradient: "linear-gradient(135deg, #a21caf 0%, #c026d3 50%, #e879f9 100%)",
    environment: "신비한 정원",
    description: "포용과 사랑을 상징하는 신비한 정원 환경",
    emoji: "🌺"
  },
  
  // 블루그린 계열
  bluegreen: {
    gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #2dd4bf 100%)",
    environment: "평화로운 호수",
    description: "균형과 평화를 상징하는 호수 환경",
    emoji: "🏞️"
  },
  
  // 레드오렌지 계열
  redorange: {
    gradient: "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ea580c 100%)",
    environment: "용암 지대",
    description: "개혁과 변화를 상징하는 용암 지대 환경",
    emoji: "🔥"
  },
  
  // 옐로우그린 계열
  yellowgreen: {
    gradient: "linear-gradient(135deg, #65a30d 0%, #84cc16 50%, #a3e635 100%)",
    environment: "신선한 초원",
    description: "관찰과 친화를 상징하는 신선한 초원 환경",
    emoji: "🌱"
  },
  
  // 회색/검은색 계열 (기본값)
  default: {
    gradient: "linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)", 
    environment: "고요한 산맥",
    description: "균형과 지혜를 상징하는 산맥 환경",
    emoji: "⛰️"
  }
};

// 색상에서 테마 찾기 함수
export function getBackgroundTheme(userColor) {
  if (!userColor || !userColor.hex) {
    return backgroundThemes.default;
  }
  
  const hex = userColor.hex.toLowerCase();
  const colorName = userColor.name?.toLowerCase() || '';
  const colorId = userColor.id?.toLowerCase() || '';
  
  // 색상 ID 기반 매핑 (가장 정확함)
  if (colorId === 'red') {
    return backgroundThemes.red;
  } else if (colorId === 'blue') {
    return backgroundThemes.blue;
  } else if (colorId === 'green') {
    return backgroundThemes.green;
  } else if (colorId === 'purple') {
    return backgroundThemes.purple;
  } else if (colorId === 'orange') {
    return backgroundThemes.orange;
  } else if (colorId === 'yellow') {
    return backgroundThemes.yellow;
  } else if (colorId === 'turquoise') {
    return backgroundThemes.turquoise;
  } else if (colorId === 'indigo') {
    return backgroundThemes.indigo;
  } else if (colorId === 'magenta') {
    return backgroundThemes.magenta;
  } else if (colorId === 'bluegreen') {
    return backgroundThemes.bluegreen;
  } else if (colorId === 'redorange') {
    return backgroundThemes.redorange;
  } else if (colorId === 'yellowgreen') {
    return backgroundThemes.yellowgreen;
  }
  
  // HEX 코드 기반 매핑 (fallback)
  if (hex.includes('ff0000') || hex.includes('red')) {
    return backgroundThemes.red;
  } else if (hex.includes('0000ff') || hex.includes('blue')) {
    return backgroundThemes.blue;
  } else if (hex.includes('008000') || hex.includes('green')) {
    return backgroundThemes.green;
  } else if (hex.includes('800080') || hex.includes('purple')) {
    return backgroundThemes.purple;
  } else if (hex.includes('ffa500') || hex.includes('orange')) {
    return backgroundThemes.orange;
  } else if (hex.includes('ffff00') || hex.includes('yellow')) {
    return backgroundThemes.yellow;
  } else if (hex.includes('40e0d0') || hex.includes('turquoise')) {
    return backgroundThemes.turquoise;
  } else if (hex.includes('4b0082') || hex.includes('indigo')) {
    return backgroundThemes.indigo;
  } else if (hex.includes('ff00ff') || hex.includes('magenta')) {
    return backgroundThemes.magenta;
  } else if (hex.includes('008b8b') || hex.includes('bluegreen')) {
    return backgroundThemes.bluegreen;
  } else if (hex.includes('ff4500') || hex.includes('redorange')) {
    return backgroundThemes.redorange;
  } else if (hex.includes('adff2f') || hex.includes('yellowgreen')) {
    return backgroundThemes.yellowgreen;
  }
  
  // 이름 기반 매핑 (마지막 fallback)
  if (colorName.includes('red') || colorName.includes('레드')) {
    return backgroundThemes.red;
  } else if (colorName.includes('blue') || colorName.includes('블루')) {
    return backgroundThemes.blue;
  } else if (colorName.includes('green') || colorName.includes('그린')) {
    return backgroundThemes.green;
  } else if (colorName.includes('purple') || colorName.includes('퍼플')) {
    return backgroundThemes.purple;
  } else if (colorName.includes('orange') || colorName.includes('오렌지')) {
    return backgroundThemes.orange;
  } else if (colorName.includes('yellow') || colorName.includes('옐로우')) {
    return backgroundThemes.yellow;
  } else if (colorName.includes('turquoise') || colorName.includes('터콰이즈')) {
    return backgroundThemes.turquoise;
  } else if (colorName.includes('indigo') || colorName.includes('인디고')) {
    return backgroundThemes.indigo;
  } else if (colorName.includes('magenta') || colorName.includes('마젠타')) {
    return backgroundThemes.magenta;
  } else if (colorName.includes('bluegreen') || colorName.includes('블루그린')) {
    return backgroundThemes.bluegreen;
  } else if (colorName.includes('redorange') || colorName.includes('레드오렌지')) {
    return backgroundThemes.redorange;
  } else if (colorName.includes('yellowgreen') || colorName.includes('옐로우그린')) {
    return backgroundThemes.yellowgreen;
  }
  
  return backgroundThemes.default;
}
