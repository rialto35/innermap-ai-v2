/**
 * [6] 영웅의 선언 섹션
 * 최종 마무리 메시지와 영웅 선언
 */

'use client';

interface DeclarationSectionProps {
  content: string;
}

export default function DeclarationSection({ content }: DeclarationSectionProps) {
  if (!content) return null;

  // 영웅 타입 추출 (예: "터콰이즈 대륙에서 온 전략적 탐험가")
  const heroTypeMatch = content.match(/\*\*"(.+?)"\*\*/);
  const heroType = heroTypeMatch?.[1] || '';
  
  // 나머지 메시지
  const message = content
    .replace(/당신은 결국,?\s*/, '')
    .replace(/\*\*"(.+?)"\*\*/, '')
    .trim();

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
      <div className="glass-card p-12 text-center space-y-8 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
        {/* 섹션 헤더 */}
        <div className="space-y-2">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-4">
            <span className="text-purple-300 text-sm font-bold tracking-wider">DECLARATION</span>
          </div>
          <h2 className="text-4xl font-bold holographic-text">영웅의 선언</h2>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="text-purple-400 text-2xl">✧</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        {/* 메인 선언 */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-xl text-gray-400 font-light">
            당신은 결국,
          </div>
          
          {heroType && (
            <div className="relative">
              {/* 배경 글로우 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl"></div>
              
              {/* 영웅 타입 */}
              <div className="relative py-8 px-6">
                <div className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    &ldquo;{heroType}&rdquo;
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 마무리 메시지 */}
          {message && (
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-3">
              {message.split('\n').map((line, index) => (
                <p 
                  key={index}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${0.7 + index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* 하단 장식 */}
        <div className="pt-8">
          <div className="flex justify-center gap-3">
            {['⭐', '✨', '🌟', '✨', '⭐'].map((star, index) => (
              <span
                key={index}
                className="text-2xl opacity-50 hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  animationDelay: `${0.8 + index * 0.1}s`,
                  animation: 'twinkle 2s infinite'
                }}
              >
                {star}
              </span>
            ))}
          </div>
        </div>

        {/* 최종 구분선 */}
        <div className="pt-6">
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .holographic-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

