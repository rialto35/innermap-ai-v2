/**
 * [2] 영웅의 정체성 섹션
 * MBTI, 에니어그램, Big5를 결합한 핵심 정체성 설명 (800자)
 */

'use client';

interface IdentitySectionProps {
  content: string;
}

export default function IdentitySection({ content }: IdentitySectionProps) {
  if (!content) return null;

  // 키워드와 대표 문장 분리
  const keywordsMatch = content.match(/\*\*핵심 키워드:\*\*\s*\n(#.+)/);
  const quoteMatch = content.match(/\*\*대표 문장:\*\*\s*\n"(.+)"/);
  
  const keywords = keywordsMatch?.[1]?.split(/\s+/).filter(k => k.startsWith('#')) || [];
  const quote = quoteMatch?.[1] || '';
  
  // 메인 컨텐츠에서 키워드와 대표 문장 제거
  const mainContent = content
    .replace(/\*\*핵심 키워드:\*\*[\s\S]*?(?=\*\*대표 문장|\n\n|$)/, '')
    .replace(/\*\*대표 문장:\*\*[\s\S]*$/, '')
    .trim();

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass-card p-10">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <span className="text-2xl">⚔️</span>
          </div>
          <div>
            <div className="text-purple-400 text-sm font-bold tracking-wider">IDENTITY</div>
            <h3 className="text-3xl font-bold text-white">영웅의 정체성</h3>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-8 identity-content"
          dangerouslySetInnerHTML={{ 
            __html: mainContent
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-purple-300 font-bold">$1</strong>')
              .replace(/당신은 (.+?)입니다/g, '당신은 <span class="text-purple-400 font-bold text-xl">$1입니다</span>')
          }}
        />

        {/* 핵심 키워드 */}
        {keywords.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-purple-400 mb-4">핵심 키워드</h4>
            <div className="flex flex-wrap gap-3">
              {keywords.map((keyword, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeIn 0.5s ease-out both'
                  }}
                >
                  <span className="text-purple-300 font-medium">{keyword}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 대표 문장 */}
        {quote && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 rounded-r-lg">
            <div className="text-sm text-purple-400 font-bold mb-2">대표 문장</div>
            <p className="text-xl italic text-purple-200 leading-relaxed">&ldquo;{quote}&rdquo;</p>
          </div>
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        .identity-content :global(p) {
          color: #d1d5db;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .identity-content :global(strong) {
          color: #c084fc;
        }
      `}</style>
    </div>
  );
}

