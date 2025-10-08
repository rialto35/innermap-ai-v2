/**
 * [3] 영웅의 강점 섹션
 * 3가지 주요 강점을 이모지와 함께 설명
 */

'use client';

interface StrengthsSectionProps {
  content: string;
}

export default function StrengthsSection({ content }: StrengthsSectionProps) {
  if (!content) return null;

  // 강점 항목 파싱 (패턴: **1. 강점명 이모지**)
  const strengthItems = content.match(/\*\*\d+\.\s*(.+?)\s*([^\s]+)\*\*\s*\n([^\*]+)/g) || [];
  
  const strengths = strengthItems.map(item => {
    const match = item.match(/\*\*\d+\.\s*(.+?)\s*([^\s]+)\*\*\s*\n(.+)/s);
    if (match) {
      return {
        title: match[1].trim(),
        emoji: match[2].trim(),
        description: match[3].trim()
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="glass-card p-10">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <div className="text-green-400 text-sm font-bold tracking-wider">STRENGTHS</div>
            <h3 className="text-3xl font-bold text-white">영웅의 강점</h3>
          </div>
        </div>

        {/* 강점 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strengths.map((strength, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                animation: 'slideInUp 0.6s ease-out both'
              }}
            >
              {/* 배경 그라데이션 효과 */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* 컨텐츠 */}
              <div className="relative z-10">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {strength.emoji}
                </div>
                <h4 className="text-xl font-bold text-green-300 mb-3">
                  {strength.title}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {strength.description}
                </p>
              </div>

              {/* 장식 라인 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/0 via-green-500/50 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Fallback: 파싱 실패 시 원본 표시 */}
        {strengths.length === 0 && (
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-green-300">$1</strong>')
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

