/**
 * Unified Question Component
 * 
 * Slider-based question with keyboard shortcuts
 * Updated for dark theme (/test/* pages)
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
  onNext?: () => void; // Optional - auto-advance in state
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
        if (value && onNext) onNext();
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
        <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
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
          className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gradient-to-r
            [&::-webkit-slider-thumb]:from-violet-500
            [&::-webkit-slider-thumb]:to-cyan-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-violet-500/50
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gradient-to-r
            [&::-moz-range-thumb]:from-violet-500
            [&::-moz-range-thumb]:to-cyan-500
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:shadow-violet-500/50"
          style={{
            background: value
              ? `linear-gradient(to right, 
                  rgb(139, 92, 246) 0%, 
                  rgb(34, 211, 238) ${((value - 1) / (scale - 1)) * 100}%, 
                  rgba(255, 255, 255, 0.1) ${((value - 1) / (scale - 1)) * 100}%, 
                  rgba(255, 255, 255, 0.1) 100%)`
              : undefined,
          }}
        />
      </div>
      
      {/* Scale Labels */}
      <div className="flex justify-between mb-8 px-2">
        {Array.from({ length: scale }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              font-semibold text-lg transition-all
              ${
                value === num
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white scale-110 shadow-lg shadow-violet-500/50'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>
      
      {/* Text Labels */}
      <div className="flex justify-between text-sm text-white/60 px-2">
        <span>전혀 아니다</span>
        <span>보통이다</span>
        <span>매우 그렇다</span>
      </div>
      
      {/* Current Value Display */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30">
            <span className="text-white/70 text-sm">선택한 값: </span>
            <span className="text-white font-bold text-lg">{value}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
