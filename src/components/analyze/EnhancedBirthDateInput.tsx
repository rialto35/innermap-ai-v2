'use client';

import { useState } from 'react';
import CustomDateInput from './CustomDateInput';
import { convertSolarToLunar, convertLunarToSolar } from '@/lib/date/lunarConverter';

interface EnhancedBirthDateInputProps {
  onBirthDateChange: (birthDate: string | null) => void;
  onBirthTimeChange?: (time: string | null) => void;
  initialValue?: string;
  initialTime?: string;
}

export default function EnhancedBirthDateInput({ 
  onBirthDateChange, 
  onBirthTimeChange,
  initialValue,
  initialTime
}: EnhancedBirthDateInputProps) {
  const [birthDate, setBirthDate] = useState(initialValue || '');
  const [birthTime, setBirthTime] = useState(initialTime || '');
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [dateType, setDateType] = useState<'solar' | 'lunar'>('solar');
  const [conversionResult, setConversionResult] = useState<any>(null);

  const handleDateChange = (value: string) => {
    setBirthDate(value);
    onBirthDateChange(value || null);
    
    // 변환 결과 초기화
    setConversionResult(null);
  };


  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthTime(value);
    onBirthTimeChange?.(value || null);
  };

  const handleDateTypeChange = (type: 'solar' | 'lunar') => {
    setDateType(type);
    setConversionResult(null);
  };

  const handleConvert = () => {
    if (!birthDate) return;
    
    if (dateType === 'solar') {
      const result = convertSolarToLunar(birthDate);
      setConversionResult(result);
    } else {
      const result = convertLunarToSolar(birthDate);
      setConversionResult(result);
    }
  };

  const applyConversion = () => {
    if (!conversionResult) return;
    
    if (dateType === 'solar' && conversionResult.lunar) {
      setBirthDate(conversionResult.lunar);
      onBirthDateChange(conversionResult.lunar);
      setDateType('lunar');
    } else if (dateType === 'lunar' && conversionResult.solar) {
      setBirthDate(conversionResult.solar);
      onBirthDateChange(conversionResult.solar);
      setDateType('solar');
    }
    setConversionResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 날짜 유형 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          날짜 유형 <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="dateType"
              value="solar"
              checked={dateType === 'solar'}
              onChange={() => handleDateTypeChange('solar')}
              className="mr-2"
            />
            <span className="text-sm">양력 (양력 생년월일을 알고 있음)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="dateType"
              value="lunar"
              checked={dateType === 'lunar'}
              onChange={() => handleDateTypeChange('lunar')}
              className="mr-2"
            />
            <span className="text-sm">음력 (음력 생년월일만 알고 있음)</span>
          </label>
        </div>
      </div>

      {/* 생년월일 입력 */}
      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          {dateType === 'solar' ? '양력' : '음력'} 생년월일 <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          <CustomDateInput
            value={birthDate}
            onChange={handleDateChange}
            placeholder="YYYY-MM-DD"
            required
          />
          <button
            type="button"
            onClick={handleConvert}
            disabled={!birthDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            변환
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {dateType === 'solar' 
            ? '양력 생년월일을 입력하세요' 
            : '음력 생년월일을 입력하세요'}
        </p>
      </div>

      {/* 변환 결과 */}
      {conversionResult && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                {dateType === 'solar' ? '음력 변환 결과' : '양력 변환 결과'}
              </p>
              <p className="text-sm text-blue-700">
                {dateType === 'solar' 
                  ? `음력: ${conversionResult.lunar}` 
                  : `양력: ${conversionResult.solar}`}
              </p>
              <p className="text-xs text-blue-600 mt-1">{conversionResult.note}</p>
            </div>
            <button
              type="button"
              onClick={applyConversion}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              적용
            </button>
          </div>
        </div>
      )}


      {/* 출생시간 입력 (선택사항) */}
      <div className="space-y-2">
        <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700">
          출생시간 <span className="text-gray-400">(선택사항)</span>
        </label>
        <input
          type="time"
          id="birthTime"
          value={birthTime}
          onChange={handleTimeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="p-3 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-800 font-medium mb-1">⏰ 출생시간을 모를 때:</p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• <strong>부모님께 문의:</strong> 가장 정확한 방법입니다</li>
            <li>• <strong>출생증명서 확인:</strong> 병원에서 발급받은 증명서에 기록되어 있음</li>
            <li>• <strong>가족 기록:</strong> 가족들이 기억하는 대략적인 시간</li>
            <li>• <strong>미입력 시:</strong> 정오(12시) 기준으로 계산됩니다</li>
          </ul>
        </div>
      </div>

      {/* 개인정보 처리 동의 */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="privacyConsent"
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="privacyConsent" className="text-sm text-gray-700">
            <span className="text-red-500">*</span> 생년월일 정보 수집 및 이용에 동의합니다
          </label>
        </div>
        
        <button
          type="button"
          onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
        >
          {showPrivacyInfo ? '접기' : '자세히 보기'}
        </button>
        
        {showPrivacyInfo && (
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-2">
            <p><strong>수집 목적:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>사주 기반 운세 분석 및 조언 제공</li>
              <li>개인화된 성장 가이드 생성</li>
              <li>영웅 매칭 및 부족/결정석 추천</li>
            </ul>
            
            <p><strong>수집 항목:</strong> 생년월일 (년/월/일)</p>
            
            <p><strong>보유 기간:</strong> 서비스 이용 기간 동안</p>
            
            <p><strong>처리 방식:</strong> 암호화하여 안전하게 저장</p>
            
            <p className="text-gray-500">
              * 동의하지 않을 경우 운세 서비스를 이용할 수 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
