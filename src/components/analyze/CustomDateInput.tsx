'use client';

import { useState, useEffect } from 'react';

interface CustomDateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CustomDateInput({ 
  value, 
  onChange, 
  placeholder = "YYYY-MM-DD",
  required = false 
}: CustomDateInputProps) {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);

  // value prop이 변경되면 displayValue 업데이트
  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const formatDate = (input: string) => {
    // 숫자만 추출
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    
    // 8자리 초과 시 앞의 8자리만 사용
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  };

  const validateDate = (dateString: string) => {
    if (!dateString) return true;
    
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    const minDate = new Date(1900, 0, 1);
    
    return date instanceof Date && 
           !isNaN(date.getTime()) && 
           date >= minDate && 
           date <= today;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatDate(input);
    
    setDisplayValue(formatted);
    
    const valid = validateDate(formatted);
    setIsValid(valid);
    
    // 유효한 날짜일 때만 부모 컴포넌트에 전달
    if (valid && formatted.length === 10) {
      onChange(formatted);
    } else if (formatted.length === 0) {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 이벤트 전파 방지 - 상위 컴포넌트로 키보드 이벤트가 전달되지 않도록
    e.stopPropagation();
    
    // 백스페이스, 삭제, 화살표 키, 탭은 허용
    if ([8, 9, 27, 46, 37, 38, 39, 40].includes(e.keyCode)) {
      return;
    }
    
    // 숫자만 허용
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const pasted = e.clipboardData.getData('text');
    const formatted = formatDate(pasted);
    setDisplayValue(formatted);
    
    const valid = validateDate(formatted);
    setIsValid(valid);
    
    if (valid && formatted.length === 10) {
      onChange(formatted);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 포커스 시 이벤트 전파 방지
    e.stopPropagation();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 블러 시 이벤트 전파 방지
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 bg-white text-gray-800 ${
          !isValid && displayValue ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        maxLength={10}
        autoComplete="off"
        data-testid="birth-date-input"
        tabIndex={0}
      />
      {!isValid && displayValue && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">
          올바른 날짜를 입력해주세요 (YYYY-MM-DD)
        </p>
      )}
    </div>
  );
}
