/**
 * [0] 영웅 공개 섹션
 * 대륙과 영웅 타입을 처음 공개하는 임팩트 있는 섹션
 */

'use client';

interface HeroRevealProps {
  content: string;
}

export default function HeroReveal({ content }: HeroRevealProps) {
  if (!content) return null;

  return (
    <div className="animate-fade-in-up">
      <div className="glass-card holographic-border p-12 text-center space-y-8">
        {/* 섹션 헤더 */}
        <div className="space-y-2">
          <div className="inline-block px-4 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
            <span className="text-purple-300 text-sm font-bold tracking-wider">HERO REVELATION</span>
          </div>
          <h2 className="text-4xl font-bold holographic-text">당신의 영웅</h2>
        </div>

        {/* 영웅 공개 내용 */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div 
            className="text-lg md:text-xl leading-relaxed text-gray-300 whitespace-pre-wrap hero-reveal-content"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                .replace(/^(🏔️|🌸|🍃|🍎|☀️|🌊|🌍|🌙|🌏|🌲|🌌)(.+)$/gm, '<div class="text-3xl mb-4">$1</div><div class="text-2xl font-bold text-purple-300">$2</div>')
                .replace(/^(⚔️|🎭|🌟|⚡|🔮|🎯)(.+)$/gm, '<div class="text-3xl mb-2">$1</div><div class="text-xl font-semibold text-blue-300">$2</div>')
                .replace(/^"(.+)"$/gm, '<div class="text-2xl italic text-yellow-300 mt-6 font-light">"$1"</div>')
            }}
          />
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 max-w-2xl mx-auto pt-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="text-purple-400 text-2xl">✧</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
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
        }

        .hero-reveal-content :global(strong) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}

