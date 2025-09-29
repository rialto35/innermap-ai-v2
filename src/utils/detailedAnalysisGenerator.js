import { detailedMBTIAnalysis, detailedRETIAnalysis, detailedColorAnalysis, heroWorldView } from '../data/detailedAnalysis.js';
import { heroMapping } from '../data/heroMapping.js';

// 영웅 이름 생성 함수
function generateHeroName(mbtiData, retiData, color1Data) {
  const mbtiTitle = mbtiData.koreanName || mbtiData.name;
  const retiTitle = retiData.koreanName || retiData.name;
  const colorTitle = color1Data.koreanName || color1Data.name;
  
  // 조합된 영웅 이름 생성
  const heroNames = [
    `${mbtiTitle}의 ${retiTitle}`,
    `${colorTitle}의 ${mbtiTitle}`,
    `${retiTitle} ${colorTitle}`,
    `${mbtiTitle} ${colorTitle}`,
    `${colorTitle} ${mbtiTitle}`
  ];
  
  return heroNames[0]; // 첫 번째 조합 사용
}

// 고품질 분석 결과 생성 함수
export function generateDetailedAnalysis(userData) {
  const { mbti, reti, colors, name = "사용자" } = userData;
  
  // 기본 데이터 가져오기
  const mbtiData = detailedMBTIAnalysis[mbti] || detailedMBTIAnalysis["INFP"];
  const retiData = detailedRETIAnalysis[reti] || detailedRETIAnalysis["9"];
  const color1Data = detailedColorAnalysis[colors?.[0]?.name] || detailedColorAnalysis["파랑"];
  const color2Data = colors?.[1] ? detailedColorAnalysis[colors[1].name] : null;
  const color3Data = colors?.[2] ? detailedColorAnalysis[colors[2].name] : null;
  
  // 영웅 이름 생성
  const heroName = generateHeroName(mbtiData, retiData, color1Data);
  
  // 영웅 정보 생성
  const heroKey = reti ? `${mbti}_type${reti}` : `${mbti}_type4`;
  const hero = heroMapping[heroKey] || heroMapping["INFP_type9"];
  
  // 1단계: 성격 지형 분석
  const personalityTerrain = generatePersonalityTerrain(heroName, mbtiData, retiData, color1Data, color2Data, color3Data);
  
  // 2단계: MBTI 심층 분석
  const mbtiAnalysis = generateMBTIAnalysis(mbtiData);
  
  // 3단계: RETI 심층 분석
  const retiAnalysis = generateRETIAnalysis(retiData);
  
  // 4단계: 3단계 색채심리 분석
  const colorAnalysis = generateColorAnalysis(color1Data, color2Data, color3Data);
  
  // 5단계: 144영웅 세계관
  const heroWorldViewAnalysis = generateHeroWorldView(hero, mbtiData, retiData);
  
  // 6단계: 종합 분석
  const comprehensiveAnalysis = generateComprehensiveAnalysis(heroName, mbtiData, retiData, color1Data, color2Data, color3Data);
  // console.log('🔍 detailedAnalysisGenerator에서 생성된 comprehensiveAnalysis:', comprehensiveAnalysis);
  
  return {
    personalityTerrain,
    mbtiAnalysis,
    retiAnalysis,
    colorAnalysis,
    heroWorldView: heroWorldViewAnalysis,
    comprehensiveAnalysis,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "3.0",
      analysisType: "상세"
    }
  };
}

// 1단계: 성격 지형 분석 생성
function generatePersonalityTerrain(name, mbtiData, retiData, color1Data, color2Data, color3Data) {
  const color2Text = color2Data ? ` + ${color2Data.koreanName}(${color2Data.ability})` : "";
  const color3Text = color3Data ? ` + ${color3Data.koreanName}(${color3Data.ability})` : "";
  
  return {
    title: "🎭 성격 지형 분석",
    content: `${name}은 MBTI ${mbtiData.koreanName}, RETI ${retiData.koreanName}, 그리고 3단계 색채심리 ${color1Data.koreanName}(${color1Data.ability})${color2Text}${color3Text}을 가진 영웅입니다.\n\n* ${mbtiData.koreanName}는 ${mbtiData.detailedDescription}\n* RETI ${retiData.koreanName}는 "${retiData.name}"로 불리며, ${retiData.detailedDescription}\n* 선천 색채 ${color1Data.koreanName}는 ${color1Data.detailedDescription}\n* ${color2Data ? `후천 색채 ${color2Data.koreanName}는 ${color2Data.detailedDescription}` : ""}\n* ${color3Data ? `소망 색채 ${color3Data.koreanName}는 ${color3Data.detailedDescription}` : ""}\n\n👉 종합적으로 ${name}은 "${mbtiData.coreTraits[0]} + ${retiData.coreTraits[0]} + ${color1Data.ability} + ${color2Data ? color2Data.ability : '균형'}"이라는 네 가지 키워드를 중심으로 살아가는 영웅입니다.`,
    summary: `${mbtiData.koreanName} + ${retiData.koreanName} + ${color1Data.koreanName}${color2Text}${color3Text}`
  };
}

// 2단계: MBTI 심층 분석 생성
function generateMBTIAnalysis(mbtiData) {
  return {
    title: "🧠 MBTI 심층 분석",
    content: `${mbtiData.koreanName}는 ${mbtiData.detailedDescription}`,
    details: {
      현재상황: mbtiData.detailedDescription,
      강점: mbtiData.strengths,
      개선점: mbtiData.challenges,
      성장방향: mbtiData.growthAreas,
      관계패턴: mbtiData.relationships,
      적성직업: mbtiData.careerPaths,
      세계관: mbtiData.worldView
    }
  };
}

// 3단계: RETI 심층 분석 생성
function generateRETIAnalysis(retiData) {
  return {
    title: "🔢 RETI 심층 분석",
    content: `${retiData.koreanName}는 ${retiData.detailedDescription}`,
    details: {
      현재상황: retiData.detailedDescription,
      강점: retiData.strengths,
      개선점: retiData.challenges,
      성장방향: retiData.growthAreas,
      핵심욕구: retiData.coreDesire,
      핵심두려움: retiData.coreFear,
      핵심동기: retiData.coreMotivation,
      통합방향: retiData.integration,
      퇴보방향: retiData.disintegration,
      세계관: retiData.worldView
    }
  };
}

// 4단계: 3단계 색채심리 분석 생성
function generateColorAnalysis(color1Data, color2Data, color3Data) {
  const color1Analysis = {
    title: `🎨 선천 색채 - ${color1Data.koreanName}`,
    content: `* 선천 색채 ${color1Data.koreanName}은 ${color1Data.detailedDescription}`,
    details: {
      심리적의미: color1Data.psychologicalMeaning,
      특징: color1Data.characteristics,
      강점: color1Data.strengths,
      개선점: color1Data.challenges,
      가이던스: color1Data.guidance,
      원소: color1Data.element,
      세계관: color1Data.worldView
    }
  };
  
  if (color2Data) {
    const color2Analysis = {
      title: `🌱 후천 색채 - ${color2Data.koreanName}`,
      content: `* 후천 색채 ${color2Data.koreanName}은 ${color2Data.detailedDescription}`,
      details: {
        심리적의미: color2Data.psychologicalMeaning,
        특징: color2Data.characteristics,
        강점: color2Data.strengths,
        개선점: color2Data.challenges,
        가이던스: color2Data.guidance,
        원소: color2Data.element,
        세계관: color2Data.worldView
      }
    };
    
    if (color3Data) {
      const color3Analysis = {
        title: `✨ 소망 색채 - ${color3Data.koreanName}`,
        content: `* 소망 색채 ${color3Data.koreanName}은 ${color3Data.detailedDescription}`,
        details: {
          심리적의미: color3Data.psychologicalMeaning,
          특징: color3Data.characteristics,
          강점: color3Data.strengths,
          개선점: color3Data.challenges,
          가이던스: color3Data.guidance,
          원소: color3Data.element,
          세계관: color3Data.worldView
        }
      };
      
      return [color1Analysis, color2Analysis, color3Analysis];
    }
    
    return [color1Analysis, color2Analysis];
  }
  
  return [color1Analysis];
}

// 5단계: 144영웅 세계관 분석 생성
function generateHeroWorldView(hero, mbtiData, retiData) {
  const continent = heroWorldView.continents[hero.element] || "미지의 대륙";
  const level = "숙련자"; // 기본 레벨
  const powers = hero.powers.slice(0, 3); // 최대 3개 능력
  
  return {
    title: "144영웅 세계관",
    content: `당신의 영웅 '${hero.name}'은 ${continent}에서 ${level}로서 활동하며, ${powers.join(', ')}의 능력을 가지고 있습니다.`,
    details: {
      영웅이름: hero.name,
      직함: hero.title,
      대륙: continent,
      레벨: level,
      능력: powers,
      원소: hero.element,
      성격: hero.personality,
      특별한힘: hero.powers,
      세계관설명: heroWorldView.continents[hero.element] || "신비로운 땅"
    }
  };
}

// 6단계: 종합 분석 생성
function generateComprehensiveAnalysis(name, mbtiData, retiData, color1Data, color2Data, color3Data) {
  try {
    // 안전한 데이터 처리 (완전한 옵셔널 체이닝)
    const mbtiTrait = Array.isArray(mbtiData?.coreTraits) ? mbtiData.coreTraits[0] : (mbtiData?.koreanName || mbtiData?.name || '기본 MBTI');
    const retiTrait = Array.isArray(retiData?.coreTraits) ? retiData.coreTraits[0] : (retiData?.koreanName || retiData?.name || '기본 RETI');
    const colorTrait = color1Data?.koreanName ? color1Data.koreanName.split(' ')[0] : (color1Data?.name || '기본 색상');
    const color2Trait = color2Data ? (color2Data?.koreanName ? color2Data.koreanName.split(' ')[0] : color2Data?.name) : "균형";
  
  // 핵심 키워드 추출
  const keywords = [
    mbtiTrait,
    retiTrait,
    colorTrait,
    color2Trait
  ];
  
  // 핵심 정체성 (안전한 객체 접근)
  const coreIdentity = `${mbtiData?.koreanName || mbtiData?.name || '기본 MBTI'} + ${retiData?.koreanName || retiData?.name || '기본 RETI'} + ${color1Data?.koreanName || color1Data?.name || '기본 색상'}`;
  
  // 생활 철학 (안전한 객체 접근)
  const lifePhilosophy = `${mbtiData?.worldView || '기본 세계관'}과 ${retiData?.worldView || '기본 세계관'}, 그리고 ${color1Data?.worldView || '기본 세계관'}을 바탕으로 한 통합적 삶의 철학`;
  
  // 관계 패턴 (안전한 처리)
  const relationshipPattern = `${mbtiData?.relationships || ''} ${Array.isArray(retiData?.coreTraits) && retiData.coreTraits.includes('관계지향') ? '그리고 타인과의 깊은 연결을 중시합니다.' : ''}`;
  
  // 성장 과제 (안전한 배열 처리)
  const growthTasks = [
    ...(Array.isArray(mbtiData?.growthAreas) ? mbtiData.growthAreas.slice(0, 2) : []),
    ...(Array.isArray(retiData?.challenges) ? retiData.challenges.slice(0, 2) : []),
    ...(Array.isArray(color1Data?.challenges) ? color1Data.challenges.slice(0, 1) : [])
  ];
  
  // 추천 활동 (안전한 배열 처리)
  const recommendedActivities = [
    ...(Array.isArray(mbtiData?.careerPaths) ? mbtiData.careerPaths.slice(0, 2) : []),
    `${retiData?.name || retiData?.koreanName || '기본 RETI'} 성장을 위한 활동`,
    `${color1Data?.name || color1Data?.koreanName || '기본 색상'} 색상과 관련된 활동`
  ];
  
  return {
    title: "종합 성격 분석",
    content: `👉 종합적으로 ${name}은 "${keywords.join(' + ')}"이라는 네 가지 키워드를 중심으로 살아가는 영웅입니다.`,
    details: {
      핵심정체성: coreIdentity,
      생활철학: lifePhilosophy,
      관계패턴: relationshipPattern,
      성장과제: growthTasks,
      추천활동: recommendedActivities,
      핵심키워드: keywords,
      종합평가: `${mbtiData?.koreanName || mbtiData?.name || '기본 MBTI'}의 ${retiData?.koreanName || retiData?.name || '기본 RETI'}적 특성과 ${color1Data?.koreanName || color1Data?.name || '기본 색상'}의 감성을 가진 독특한 개성의 소유자입니다.`
    }
  };
  } catch (error) {
    console.error('종합분석 생성 에러:', error);
    // 에러 발생 시 기본값 반환
    return {
      title: "종합 성격 분석",
      content: `👉 ${name}은 독특하고 소중한 개성을 가진 영웅입니다.`,
      details: {
        핵심정체성: "개성 있는 영웅",
        생활철학: "자기 이해와 성장을 통한 발전",
        관계패턴: "타인과의 조화로운 관계 추구",
        성장과제: ["지속적인 자기 탐구", "개인적 발전"],
        추천활동: ["자기 성찰", "새로운 경험"],
        핵심키워드: ["개성", "성장", "조화", "발전"],
        종합평가: "무한한 가능성을 가진 소중한 영웅입니다."
      }
    };
  }
}

// 간단한 분석 결과 생성 (API 키 없을 때 사용)
export function generateSimpleAnalysis(userData) {
  const { mbti, reti, colors, name = "사용자" } = userData;
  
  return {
    personalityTerrain: {
      title: "1단계. 성격 지형 분석",
      content: `${name}은 MBTI ${mbti || '미완성'}, RETI ${reti || '미완성'}번, 그리고 색채심리 ${colors?.[0]?.name || '미완성'}을 가진 영웅입니다.`,
      summary: "기본 성격 분석이 완료되었습니다."
    },
    mbtiAnalysis: {
      title: "MBTI 기본 분석",
      content: "MBTI는 개인의 성격 유형을 16가지로 분류하는 심리학적 도구입니다.",
      details: {
        현재상황: "성격 유형에 따른 기본적인 특성을 보여줍니다.",
        강점: ["분석 완료", "개인적 특성 파악"],
        개선점: ["더 자세한 정보 필요"],
        성장방향: ["지속적인 자기 이해"]
      }
    },
    retiAnalysis: {
      title: "RETI 기본 분석",
      content: "RETI는 9가지 성격 유형으로 인간의 내면을 분석하는 도구입니다.",
      details: {
        핵심욕구: "자기 이해와 성장",
        핵심두려움: "정체성 혼란",
        성장방향: "지속적인 자기 탐구"
      }
    },
    colorAnalysis: [{
      title: "색채심리 기본 분석",
      content: "색채심리는 색상 선호도를 통해 개인의 심리적 특성을 분석합니다.",
      details: {
        심리적의미: "색상 선호도는 개인의 감정과 성향을 반영합니다.",
        특징: ["색상에 대한 기본적 선호"],
        가이던스: "자신의 색상 선호도를 이해하고 활용하세요."
      }
    }],
    heroWorldView: {
      title: "144영웅 세계관",
      content: "당신만의 고유한 영웅이 기다리고 있습니다.",
      details: {
        영웅이름: "당신의 영웅",
        직함: "특별한 존재",
        능력: ["잠재력", "가능성", "성장"],
        세계관설명: "무한한 가능성의 세계"
      }
    },
    comprehensiveAnalysis: {
      title: "종합 성격 분석",
      content: `👉 ${name} 님은 독특하고 소중한 개성을 가진 분입니다.`,
      details: {
        핵심정체성: "개성 있는 개인",
        생활철학: "자기 이해와 성장",
        성장과제: ["지속적인 자기 탐구", "개인적 발전"],
        추천활동: ["자기 성찰", "새로운 경험"],
        종합평가: "무한한 가능성을 가진 소중한 존재입니다."
      }
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0",
      analysisType: "간단"
    }
  };
}
