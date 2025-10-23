'use client';

import { useState } from 'react';
import CustomDateInput from './CustomDateInput';
import { convertSolarToLunar, convertLunarToSolar } from '@/lib/date/lunarConverter';

interface CompactBirthDateInputProps {
  onBirthDateChange: (birthDate: string | null) => void;
  onBirthTimeChange?: (time: string | null) => void;
  initialValue?: string;
  initialTime?: string;
}

export default function CompactBirthDateInput({ 
  onBirthDateChange, 
  onBirthTimeChange,
  initialValue,
  initialTime
}: CompactBirthDateInputProps) {
  const [birthDate, setBirthDate] = useState(initialValue || '');
  const [birthTime, setBirthTime] = useState(initialTime || '');
  const [dateType, setDateType] = useState<'solar' | 'lunar'>('solar');
  const [conversionResult, setConversionResult] = useState<any>(null);

  const handleDateChange = (value: string) => {
    setBirthDate(value);
    onBirthDateChange(value || null);
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
    <div className="space-y-4">
      {/* 날짜 유형 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          날짜 유형 <span className="text-red-400">*</span>
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="dateType"
              value="solar"
              checked={dateType === 'solar'}
              onChange={() => handleDateTypeChange('solar')}
              className="mr-2 text-purple-500"
            />
            <span className="text-sm text-white">양력</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="dateType"
              value="lunar"
              checked={dateType === 'lunar'}
              onChange={() => handleDateTypeChange('lunar')}
              className="mr-2 text-purple-500"
            />
            <span className="text-sm text-white">음력</span>
          </label>
        </div>
      </div>

      {/* 생년월일 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {dateType === 'solar' ? '양력' : '음력'} 생년월일 <span className="text-red-400">*</span>
        </label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <CustomDateInput
              value={birthDate}
              onChange={handleDateChange}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleConvert}
            disabled={!birthDate}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            변환
          </button>
        </div>
      </div>

      {/* 변환 결과 */}
      {conversionResult && (
        <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-200 mb-1">
                {dateType === 'solar' ? '음력 변환 결과' : '양력 변환 결과'}
              </p>
              <p className="text-sm text-purple-100">
                {dateType === 'solar' 
                  ? `음력: ${conversionResult.lunar}` 
                  : `양력: ${conversionResult.solar}`}
              </p>
              <p className="text-xs text-purple-300 mt-1">{conversionResult.note}</p>
            </div>
            <button
              type="button"
              onClick={applyConversion}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
            >
              적용
            </button>
          </div>
        </div>
      )}

      {/* 출생시간 입력 */}
      <div className="space-y-2">
        <label htmlFor="birthTime" className="block text-sm font-medium text-white">
          출생시간 <span className="text-gray-400">(선택)</span>
        </label>
        <input
          type="time"
          id="birthTime"
          value={birthTime}
          onChange={handleTimeChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        />
        <p className="text-xs text-white/60">
          모를 경우 정오(12시) 기준으로 계산됩니다
        </p>
      </div>
    </div>
  );
}
