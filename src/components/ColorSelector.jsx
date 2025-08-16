'use client';
import { useState } from 'react';
import colorsData from '@/data/colors.json';

export default function ColorSelector({ onComplete }) {
  const [selectedColors, setSelectedColors] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);

  const handleColorSelect = (color) => {
    if (selectedColors.length < 3 && !selectedColors.find(c => c.id === color.id)) {
      const newSelection = [...selectedColors, color];
      setSelectedColors(newSelection);
      
      if (newSelection.length === 3) {
        setTimeout(() => {
          setShowResult(true);
          if (onComplete) {
            onComplete(newSelection);
          }
        }, 800);
      }
    }
  };

  const resetSelection = () => {
    setSelectedColors([]);
    setShowResult(false);
  };

  const getAnalysis = () => {
    if (selectedColors.length !== 3) return null;
    
    const primaryColor = selectedColors[0];
    const abilities = selectedColors.map(c => c.ability).join(', ');
    
    return {
      primary: primaryColor,
      abilities: abilities,
      summary: `당신의 핵심 성향은 ${primaryColor.ability}이며, ${abilities}의 조합을 가지고 있습니다.`
    };
  };

  if (showResult) {
    const analysis = getAnalysis();
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
              <span className="text-3xl text-white">🎨</span>
            </div>
            <h2 className="section-title text-gradient">색채심리 분석 결과</h2>
            <p className="text-gray-600">당신이 선택한 색상으로 알아본 마음의 언어</p>
          </div>
          
          <div className="space-y-8">
            {/* 선택한 컬러 표시 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
              <h3 className="section-subtitle text-center text-gradient-secondary mb-6">
                <span className="mr-2">✨</span>
                선택한 컬러
              </h3>
              <div className="flex justify-center gap-6 mb-6">
                {selectedColors.map((color, index) => (
                  <div key={color.id} className="text-center hover-lift">
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-3xl border-4 border-white shadow-2xl mx-auto mb-3 hover-scale"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <p className="font-bold text-gray-800 text-lg">{color.name}</p>
                    <p className="text-sm text-gray-600">{color.ability}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 성향 분석 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                <span className="mr-2">🎯</span>
                주요 성향: {analysis.primary.name} ({analysis.primary.ability})
              </h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed text-center">
                {analysis.primary.description}
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="font-bold text-emerald-700 mb-4 text-lg flex items-center">
                    <span className="mr-2">🌟</span>
                    긍정적 특성
                  </h4>
                  <div className="space-y-2">
                    {analysis.primary.positives.slice(0, 5).map((trait, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="font-bold text-orange-700 mb-4 text-lg flex items-center">
                    <span className="mr-2">🚀</span>
                    개선 포인트
                  </h4>
                  <div className="space-y-2">
                    {analysis.primary.negatives.slice(0, 4).map((trait, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 성장 가이드 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 border border-yellow-200">
              <h4 className="font-bold text-gray-800 mb-4 text-xl text-center flex items-center justify-center">
                <span className="mr-2">💡</span>
                성장 가이드
              </h4>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {analysis.primary.guidance}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={resetSelection}
              className="btn-outline px-8 py-3"
            >
              <span className="mr-2">🔄</span>
              다시 선택하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 hover:rotate-0 transition-all duration-500">
            <span className="text-3xl text-white">🎨</span>
          </div>
          <h2 className="section-title text-gradient">컬러심리 분석</h2>
          <p className="text-gray-600 text-lg mb-4">
            직감적으로 끌리는 색상 <span className="font-bold text-purple-600">3개</span>를 순서대로 선택하세요
          </p>
          
          {/* 진행 상황 */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  selectedColors.length >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110' 
                    : selectedColors.length === step - 1
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300 animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {selectedColors.length >= step ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    selectedColors.length >= step ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-500">
            ({selectedColors.length}/3) {selectedColors.length === 0 ? '첫 번째 색상을 선택해주세요' : 
            selectedColors.length === 1 ? '두 번째 색상을 선택해주세요' :
            selectedColors.length === 2 ? '마지막 색상을 선택해주세요' : '완료!'}
          </p>
        </div>

        {/* 컬러 그리드 */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
          {colorsData.colors.map((color) => {
            const isSelected = selectedColors.find(c => c.id === color.id);
            const selectionOrder = selectedColors.findIndex(c => c.id === color.id) + 1;
            const isDisabled = selectedColors.length >= 3 && !isSelected;
            
            return (
              <div
                key={color.id}
                className={`relative cursor-pointer transform transition-all duration-300 ${
                  isSelected ? 'scale-110 z-10' : isDisabled ? 'opacity-40 scale-95' : 'hover:scale-110 hover:z-10'
                }`}
                onClick={() => !isDisabled && handleColorSelect(color)}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                <div className="relative">
                  {/* 컬러 원 */}
                  <div
                    className={`w-20 h-20 lg:w-24 lg:h-24 rounded-3xl border-4 mx-auto transition-all duration-300 shadow-lg hover:shadow-2xl ${
                      isSelected ? 'border-white shadow-2xl' : 'border-gray-200 hover:border-white'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* 선택 순서 표시 */}
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-bounce-gentle">
                        {selectionOrder}
                      </div>
                    )}
                    
                    {/* 호버 효과 */}
                    {hoveredColor?.id === color.id && !isSelected && (
                      <div className="absolute inset-0 bg-white/20 rounded-3xl flex items-center justify-center">
                        <span className="text-white text-2xl">+</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 컬러 정보 */}
                <div className="text-center mt-3">
                  <p className="font-bold text-gray-800 text-sm">{color.name}</p>
                  <p className="text-xs text-gray-600">{color.ability}</p>
                </div>
                
                {/* 호버 시 상세 정보 */}
                {hoveredColor?.id === color.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-xl z-20 w-48 animate-fade-in">
                    <p className="font-semibold">{color.element}</p>
                    <p className="text-gray-200 mt-1">{color.description}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        {selectedColors.length > 0 && (
          <div className="text-center animate-fade-in">
            <button
              onClick={resetSelection}
              className="btn-outline px-6 py-3"
            >
              <span className="mr-2">🔄</span>
              선택 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}