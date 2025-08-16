import React from 'react';

const heroData = {
  ENFP: {
    name: '스파이더맨',
    emoji: '🕷️',
    traits: ['자유로운 영웅', '창의적 사고', '공감 능력'],
    gradient: 'from-red-500 to-blue-600'
  },
  INTJ: {
    name: '배트맨',
    emoji: '🦇',
    traits: ['전략적 사고', '독립적 성향', '완벽주의'],
    gradient: 'from-gray-800 to-black'
  },
  ESFJ: {
    name: '슈퍼맨',
    emoji: '🦸‍♂️',
    traits: ['보호자 정신', '동정심', '책임감'],
    gradient: 'from-blue-600 to-red-500'
  },
  ISTP: {
    name: '아이언맨',
    emoji: '🤖',
    traits: ['실용적 천재', '문제 해결', '혁신'],
    gradient: 'from-red-600 to-yellow-500'
  },
  INFP: {
    name: '호크아이',
    emoji: '🏹',
    traits: ['내적 신념', '이상주의', '창의성'],
    gradient: 'from-purple-500 to-blue-600'
  },
  ENTJ: {
    name: '토르',
    emoji: '⚡',
    traits: ['리더십', '결단력', '자신감'],
    gradient: 'from-yellow-400 to-blue-600'
  },
  ISFJ: {
    name: '캡틴 아메리카',
    emoji: '🛡️',
    traits: ['책임감', '충성심', '정의감'],
    gradient: 'from-blue-600 to-red-600'
  },
  ENTP: {
    name: '휴먼 토치',
    emoji: '🔥',
    traits: ['혁신가', '창의성', '즉흥성'],
    gradient: 'from-orange-500 to-red-600'
  },
  ISFP: {
    name: '포이즌 아이비',
    emoji: '🌿',
    traits: ['예술가', '자연 친화', '감수성'],
    gradient: 'from-green-500 to-emerald-600'
  },
  ESTJ: {
    name: '닉 퓨리',
    emoji: '👑',
    traits: ['조직가', '리더십', '실용성'],
    gradient: 'from-gray-600 to-black'
  },
  INFJ: {
    name: '닥터 스트레인지',
    emoji: '🔮',
    traits: ['통찰력', '직관', '이상주의'],
    gradient: 'from-purple-600 to-indigo-800'
  },
  ESTP: {
    name: '데드풀',
    emoji: '💥',
    traits: ['즉흥성', '모험심', '유연성'],
    gradient: 'from-red-500 to-black'
  },
  ISTJ: {
    name: '윈터 솔져',
    emoji: '🗡️',
    traits: ['신뢰성', '체계성', '실용성'],
    gradient: 'from-gray-700 to-slate-800'
  },
  ENFJ: {
    name: '원더우먼',
    emoji: '✨',
    traits: ['영감을 주는 리더', '공감 능력', '이상주의'],
    gradient: 'from-yellow-400 to-red-600'
  },
  INTP: {
    name: '브루스 배너',
    emoji: '🧪',
    traits: ['분석가', '논리적 사고', '지적 호기심'],
    gradient: 'from-green-600 to-gray-700'
  },
  ESFP: {
    name: '하울리 퀸',
    emoji: '🎭',
    traits: ['엔터테이너', '낙관적', '사교성'],
    gradient: 'from-pink-500 to-purple-600'
  }
};

const HeroCard = ({ mbtiType }) => {
  const hero = heroData[mbtiType];
  
  if (!hero) {
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
        bg-gradient-to-br ${hero.gradient}
        transform transition-all duration-300 hover:scale-105 hover:shadow-3xl
        border border-white/20
      `}>
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* 카드 내용 */}
        <div className="relative z-10">
          {/* 히어로 이모지와 이름 */}
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{hero.emoji}</div>
            <h3 className="text-2xl font-bold mb-1">{hero.name}</h3>
            <p className="text-lg opacity-90">{mbtiType}</p>
          </div>
          
          {/* 구분선 */}
          <div className="w-full h-px bg-white/30 mb-4"></div>
          
          {/* 특성들 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold opacity-80 mb-3">핵심 특성</h4>
            {hero.traits.map((trait, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">{trait}</span>
              </div>
            ))}
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
