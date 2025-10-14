"use client";
import { useEffect, useRef } from "react";

interface Likert7Props {
  value?: number;
  onChange: (value: number) => void;
  labels?: string[];
}

export default function Likert7({ value, onChange, labels }: Likert7Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const defaultLabels = [
    "전혀 아니다",
    "거의 아니다", 
    "약간 아니다",
    "보통이다",
    "약간 그렇다",
    "대체로 그렇다",
    "매우 그렇다"
  ];

  const displayLabels = labels || defaultLabels;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (value && value > 1) {
            onChange(value - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (value && value < 7) {
            onChange(value + 1);
          }
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
          e.preventDefault();
          onChange(parseInt(e.key));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange]);

  return (
    <div 
      ref={containerRef}
      className="space-y-4"
      role="radiogroup"
      aria-label="7점 척도 선택"
    >
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            type="button"
            className={`
              rounded-xl h-12 px-2 text-sm font-medium transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${value === num 
                ? "bg-black text-white shadow-lg" 
                : "bg-white/10 text-white/80 hover:bg-white/20"
              }
            `}
            onClick={() => onChange(num)}
            aria-checked={value === num}
            role="radio"
            tabIndex={value === num ? 0 : -1}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-xs text-white/60">
        {displayLabels.map((label, i) => (
          <div key={i} className="text-center px-1">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
