'use client';
import { useState } from 'react';
import mbtiData from '@/data/mbti.json';
import enneagramData from '@/data/enneagram.json';
import colorsData from '@/data/colors.json';

export default function QuickInput({ onComplete }) {
  const [formData, setFormData] = useState({
    birthDate: '',
    mbti: '',
    enneagram: '',
    useCalculatedColor: true
  });

  const [calculatedColor, setCalculatedColor] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // 히어로컬러 계산
  const calculateColorFromBirth = (birthDate) => {
    if (!birthDate) return null;
    
    const dateStr = birthDate.replace(/-/g, '');
    let hash = 0;
    
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const index = Math.abs(hash) % colorsData.colors.length;
    return colorsData.colors[index];
  };

  // 날짜 포맷팅 함수
  const formatDate = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');
    
    // 8자리까지만 허용
    if (numbers.length > 8) return value;
    
    // YYYY-MM-DD 형식으로 포맷팅
    if (numbers.length >= 4) {
      const year = numbers.substring(0, 4);
      const month = numbers.substring(4, 6);
      const day = numbers.substring(6, 8);
      
      if (numbers.length >= 6) {
        return `${year}-${month}-${day}`;
      } else if (numbers.length >= 4) {
        return `${year}-${month}`;
      }
    }
    
    return numbers;
  };

  // 날짜 유효성 검사
  const isValidDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    // 기본 범위 검사
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // 실제 날짜인지 확인
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  const handleBirthDateChange = (e) => {
    const inputValue = e.target.value;
    const formattedDate = formatDate(inputValue);
    
    setFormData(prev => ({ ...prev, birthDate: formattedDate }));
    
    if (formattedDate && formattedDate.length === 10 && isValidDate(formattedDate)) {
      const color = calculateColorFromBirth(formattedDate);
      setCalculatedColor(color);
    } else {
      setCalculatedColor(null);
    }
  };

  const handleSubmit = () => {
    const results = {};
    
    if (formData.mbti) {
      results.mbti = formData.mbti;
    }
    
    if (formData.enneagram) {
      results.enneagram = formData.enneagram;
    }
    
    if (formData.useCalculatedColor && calculatedColor) {
      results.colors = [calculatedColor];
    }
    
    if (formData.birthDate) {
      results.birthDate = formData.birthDate;
    }
    
    setShowResult(true);
    
    if (onComplete) {
      onComplete(results);
    }
  };

  const resetForm = () => {
    setFormData({
      birthDate: '',
      mbti: '',
      enneagram: '',
      useCalculatedColor: true
    });
    setCalculatedColor(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-8 animate-fade-in">
          <div className="text-center">
            {/* 성공 아이콘 */}
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
              <span className="text-3xl text-white">✨</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gradient mb-2">빠른 입력 완료!</h2>
            <p className="text-gray-600 mb-8">입력하신 정보로 AI 분석을 준비했어요</p>
            
            {/* 입력 정보 요약 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center">
                <span className="mr-2">📋</span>
                입력된 정보
              </h3>
              
              <div className="space-y-3">
                {formData.birthDate && (
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="font-medium text-gray-700">🎂 히어로컬러</span>
                    <span className="text-gray-600">{formData.birthDate}</span>
                  </div>
                )}
                
                {formData.mbti && (
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="font-medium text-gray-700">🧠 MBTI</span>
                    <span className="font-bold text-blue-600">{formData.mbti}</span>
                  </div>
                )}
                
                {formData.enneagram && (
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="font-medium text-gray-700">🔢 RETI 검사</span>
                    <span className="font-bold text-emerald-600">유형 {formData.enneagram}</span>
                  </div>
                )}
                
                {calculatedColor && (
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="font-medium text-gray-700">🎨 히어로컬러</span>
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full mr-2 border-2 border-white shadow-md"
                        style={{ backgroundColor: calculatedColor.hex }}
                      ></div>
                      <span className="font-bold text-purple-600">{calculatedColor.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 액션 버튼 */}
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full text-lg py-4 shadow-xl"
              >
                🚀 AI 분석 시작하기
              </button>
              <button
                onClick={resetForm}
                className="btn-outline w-full py-3"
              >
                🔄 다시 입력하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="card p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-2xl text-white">⚡</span>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-3">빠른 입력</h2>
          <p className="text-gray-600 leading-relaxed">
            이미 알고 있는 정보가 있다면<br />
            <span className="font-semibold text-blue-600">빠르게 입력</span>해서 바로 분석받아보세요
          </p>
        </div>

        <div className="space-y-8">
          {/* 히어로컬러 입력 */}
          <div className="relative">
            <label className="block text-lg font-semibold text-gray-300 mb-3 flex items-center">
              <span className="mr-2 text-2xl">🎂</span>
              히어로컬러 확인
            </label>
            <input
              type="text"
              value={formData.birthDate}
              onChange={handleBirthDateChange}
              className="input-field text-lg py-4"
              placeholder="YYYY-MM-DD (예: 1990-01-15)"
              maxLength="10"
            />
            
            {/* 계산된 컬러 표시 */}
            {calculatedColor && (
              <div className="mt-4 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl animate-fade-in">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-gray-600 shadow-lg mr-4 hover-scale"
                    style={{ backgroundColor: calculatedColor.hex }}
                  ></div>
                  <div>
                    <div className="font-bold text-lg text-white">{calculatedColor.name}</div>
                    <div className="text-sm text-gray-400">{calculatedColor.ability}</div>
                    <div className="text-xs text-blue-400 font-medium mt-1">✨ 자동 계산됨</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MBTI 선택 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2 text-2xl">🧠</span>
              MBTI
              <span className="ml-2 text-sm text-gray-500 font-normal">(알고 있다면 선택)</span>
            </label>
            <select
              value={formData.mbti}
              onChange={(e) => setFormData(prev => ({ ...prev, mbti: e.target.value }))}
              className="input-field text-lg py-4 cursor-pointer"
            >
              <option value="">MBTI를 선택하세요</option>
              {Object.entries(mbtiData.types).map(([type, data]) => (
                <option key={type} value={type}>
                  {type} - {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* 에니어그램 선택 */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2 text-2xl">🔢</span>
              에니어그램
              <span className="ml-2 text-sm text-gray-500 font-normal">(알고 있다면 선택)</span>
            </label>
            <select
              value={formData.enneagram}
              onChange={(e) => setFormData(prev => ({ ...prev, enneagram: e.target.value }))}
              className="input-field text-lg py-4 cursor-pointer"
            >
              <option value="">에니어그램을 선택하세요</option>
              {Object.entries(enneagramData.types).map(([type, data]) => (
                <option key={type} value={type}>
                  유형 {type} - {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={!formData.birthDate && !formData.mbti && !formData.enneagram}
              className={`w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform ${
                formData.birthDate || formData.mbti || formData.enneagram
                  ? 'btn-primary shadow-2xl hover:shadow-3xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {formData.birthDate || formData.mbti || formData.enneagram ? (
                <>
                  <span className="mr-2">🚀</span>
                  빠른 분석 시작하기
                </>
              ) : (
                <>
                  <span className="mr-2">💡</span>
                  최소 하나는 입력해주세요
                </>
              )}
            </button>
          </div>

          {/* 하단 안내 */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-600">
              <span className="mr-1">💡</span>
              하나만 입력해도 AI 분석이 가능해요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}