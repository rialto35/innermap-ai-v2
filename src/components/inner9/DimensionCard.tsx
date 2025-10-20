import { useState } from 'react';
import { INNER9_DESCRIPTIONS, type Inner9Key } from '@/constants/inner9';

interface DimensionCardProps {
  dimensionKey: string;
  label: string;
  value: number;
}

export default function DimensionCard({ dimensionKey, label, value }: DimensionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const description = INNER9_DESCRIPTIONS[dimensionKey as Inner9Key];
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: "매우 높음", color: "text-green-400" };
    if (score >= 65) return { text: "높음", color: "text-green-300" };
    if (score >= 45) return { text: "보통", color: "text-yellow-300" };
    if (score >= 30) return { text: "낮음", color: "text-orange-300" };
    return { text: "매우 낮음", color: "text-red-300" };
  };

  const scoreInfo = getScoreLabel(value);
  const progressWidth = Math.max(10, Math.min(100, value));

  return (
    <div 
      className="relative rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 메인 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/90">{label}</span>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 opacity-60" />
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-violet-300">{Math.round(value)}</span>
          <span className={`text-xs ml-1 ${scoreInfo.color}`}>{scoreInfo.text}</span>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* 간단한 설명 */}
      <p className="text-xs text-white/60 leading-relaxed">
        {description?.oneLine || `${label} 영역의 현재 상태를 보여줍니다.`}
      </p>

      {/* 호버 시 상세 정보 */}
      {isHovered && description && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl z-10">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">{description.label}</h4>
              <p className="text-xs text-white/80 leading-relaxed">{description.oneLine}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-green-300 font-medium">높을 때:</span>
                <p className="text-white/70 mt-1">{description.high}</p>
              </div>
              <div>
                <span className="text-orange-300 font-medium">낮을 때:</span>
                <p className="text-white/70 mt-1">{description.low}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <span className="text-blue-300 font-medium text-xs">💡 팁:</span>
              <p className="text-white/70 text-xs mt-1">{description.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
