/**
 * [1] 대륙의 기운 섹션
 * 사용자가 태어난 대륙의 특성과 고유 능력 설명
 */

'use client';

interface ContinentSectionProps {
  content: string;
}

export default function ContinentSection({ content }: ContinentSectionProps) {
  if (!content) return null;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="glass-card p-10">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <div className="text-blue-400 text-sm font-bold tracking-wider">CONTINENT</div>
            <h3 className="text-3xl font-bold text-white">대륙의 기운</h3>
          </div>
        </div>

        {/* 대륙 내용 */}
        <div 
          className="prose prose-invert prose-lg max-w-none continent-content"
          dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-blue-300 font-bold">$1</strong>')
              .replace(/^✓\s+(.+)$/gm, '<div class="flex items-start gap-3 my-2"><span class="text-green-400 text-xl mt-1">✓</span><span class="text-gray-300">$1</span></div>')
              .replace(/당신이 태어난 (.+?)은/g, '당신이 태어난 <span class="text-blue-400 font-bold">$1</span>은')
              .replace(/당신은 (.+?)의 자질/g, '당신은 <span class="text-purple-400 font-bold">$1</span>의 자질')
          }}
        />

        {/* 장식 요소 */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-blue-400/30"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animation: 'pulse 2s infinite'
                }}
              ></div>
            ))}
          </div>
        </div>
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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        .continent-content :global(p) {
          color: #d1d5db;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .continent-content :global(strong) {
          color: #93c5fd;
        }
      `}</style>
    </div>
  );
}

