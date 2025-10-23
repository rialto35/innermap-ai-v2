'use client';

import { useState } from 'react';
import CustomDateInput from './CustomDateInput';

interface BirthDateInputProps {
  onBirthDateChange: (birthDate: string | null) => void;
  onBirthLocationChange?: (location: string | null) => void;
  onBirthTimeChange?: (time: string | null) => void;
  initialValue?: string;
  initialLocation?: string;
  initialTime?: string;
}

export default function BirthDateInput({ 
  onBirthDateChange, 
  onBirthLocationChange,
  onBirthTimeChange,
  initialValue,
  initialLocation,
  initialTime
}: BirthDateInputProps) {
  const [birthDate, setBirthDate] = useState(initialValue || '');
  const [birthLocation, setBirthLocation] = useState(initialLocation || '');
  const [birthTime, setBirthTime] = useState(initialTime || '');
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);


  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBirthLocation(value);
    onBirthLocationChange?.(value || null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthTime(value);
    onBirthTimeChange?.(value || null);
  };

  return (
    <div className="space-y-6">
      {/* 생년월일 입력 */}
      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          생년월일 <span className="text-red-500">*</span>
        </label>
        <CustomDateInput
          value={birthDate}
          onChange={(value) => {
            setBirthDate(value);
            onBirthDateChange(value || null);
          }}
          placeholder="YYYY-MM-DD"
          required
        />
        <p className="text-xs text-gray-500">
          정확한 분석과 운세 제공을 위해 필요합니다
        </p>
      </div>

      {/* 출생지역 입력 (선택사항) */}
      <div className="space-y-2">
        <label htmlFor="birthLocation" className="block text-sm font-medium text-gray-700">
          출생지역 <span className="text-gray-400">(선택사항)</span>
        </label>
        <select
          id="birthLocation"
          value={birthLocation}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">지역을 선택하세요 (기본값: 서울)</option>
          <option value="서울">서울특별시</option>
          <option value="부산">부산광역시</option>
          <option value="대구">대구광역시</option>
          <option value="인천">인천광역시</option>
          <option value="광주">광주광역시</option>
          <option value="대전">대전광역시</option>
          <option value="울산">울산광역시</option>
          <option value="세종">세종특별자치시</option>
          <option value="경기">경기도</option>
          <option value="강원">강원도</option>
          <option value="충북">충청북도</option>
          <option value="충남">충청남도</option>
          <option value="전북">전라북도</option>
          <option value="전남">전라남도</option>
          <option value="경북">경상북도</option>
          <option value="경남">경상남도</option>
          <option value="제주">제주특별자치도</option>
        </select>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-1">📍 출생지역이 필요한 이유:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>시간대 보정:</strong> 같은 시간에 태어나도 지역별로 실제 태양시가 다름</li>
            <li>• <strong>정확한 사주:</strong> 서울과 부산은 4분 정도 시간 차이로 사주가 달라질 수 있음</li>
            <li>• <strong>절기 계산:</strong> 24절기 기준이 지역별로 다름</li>
            <li>• <strong>미입력 시:</strong> 서울 기준으로 계산됩니다</li>
          </ul>
        </div>
      </div>

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
