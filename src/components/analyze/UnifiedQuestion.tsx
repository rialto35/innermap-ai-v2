/**
 * Unified Question Component
 * 
 * Slider-based question with keyboard shortcuts
 */

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface UnifiedQuestionProps {
  questionId: string;
  text: string;
  value?: number;
  scale: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function UnifiedQuestion({
  questionId,
  text,
  value,
  scale = 7,
  onChange,
  onNext,
  onPrev
}: UnifiedQuestionProps) {
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys (1-7)
      if (e.key >= '1' && e.key <= String(scale)) {
        const num = parseInt(e.key);
        onChange(num);
        return;
      }
      
      // Arrow keys
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (value) onNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, scale, onChange, onNext, onPrev]);
  
  return (
    <motion.div
      key={questionId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Question Text */}
      <div className="mb-12 text-center">
        <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed">
          {text}
        </p>
      </div>
      
      {/* Slider */}
      <div className="mb-8">
        <input
          type="range"
          min={1}
          max={scale}
          value={value || Math.ceil(scale / 2)}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          aria-label={text}
        />
        
        {/* Value Display */}
        <div className="flex justify-between items-center mt-4 px-2">
          <span className="text-sm text-gray-500">전혀 아니다</span>
          <div className="text-4xl font-bold text-indigo-600">
            {value || '-'}
          </div>
          <span className="text-sm text-gray-500">매우 그렇다</span>
        </div>
      </div>
      
      {/* Scale Labels */}
      <div className="flex justify-between px-2 mb-6">
        {Array.from({ length: scale }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition ${
              value === num
                ? 'bg-indigo-600 text-white scale-110'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label={`${num}점 선택`}
          >
            {num}
          </button>
        ))}
      </div>
      
      {/* Keyboard Hint */}
      <div className="text-center text-xs text-gray-400 mt-8">
        키보드: 1-7 숫자키 | ← → 화살표키
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }
      `}</style>
    </motion.div>
  );
}

