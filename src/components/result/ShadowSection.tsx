/**
 * [4] 그림자 영역 섹션
 * 과잉 패턴과 성장 팁을 제시
 */

'use client';

interface ShadowSectionProps {
  content: string;
}

export default function ShadowSection({ content }: ShadowSectionProps) {
  if (!content) return null;

  // 그림자 패턴 파싱 (⚠️ 패턴 + 💡 성장 팁)
  const shadowItems = content.match(/⚠️\s*\*\*(.+?)\*\*\s*\n(.+?)(?=\n💡|$)/gs) || [];
  const tipItems = content.match(/💡\s*\*\*성장 팁:\*\*\s*\n"(.+?)"/g) || [];

  const shadows = shadowItems.map((item, index) => {
    const warningMatch = item.match(/⚠️\s*\*\*(.+?)\*\*\s*\n(.+)/s);
    const tipText = tipItems[index]?.match(/"(.+?)"/)?.[1] || '';
    
    if (warningMatch) {
      return {
        warning: warningMatch[1].trim(),
        description: warningMatch[2].trim().replace(/\n💡.*$/s, ''),
        tip: tipText
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="glass-card p-10">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <span className="text-2xl">🌑</span>
          </div>
          <div>
            <div className="text-orange-400 text-sm font-bold tracking-wider">SHADOW</div>
            <h3 className="text-3xl font-bold text-white">그림자 영역</h3>
          </div>
        </div>

        <div className="text-gray-400 mb-6">
          성장을 위해 인식해야 할 과잉 패턴입니다
        </div>

        {/* 그림자 항목 */}
        <div className="space-y-6">
          {shadows.map((shadow, index) => (
            <div
              key={index}
              className="group"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                animation: 'fadeInLeft 0.6s ease-out both'
              }}
            >
              {/* 경고 패턴 */}
              <div className="p-6 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-orange-300 mb-2">
                      {shadow.warning}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {shadow.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 성장 팁 */}
              {shadow.tip && (
                <div className="pl-12 pr-6">
                  <div className="p-4 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div>
                        <div className="text-sm font-bold text-blue-400 mb-1">성장 팁</div>
                        <p className="text-blue-200 italic leading-relaxed">
                          "{shadow.tip}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fallback: 파싱 실패 시 원본 표시 */}
        {shadows.length === 0 && (
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/⚠️/g, '<span class="text-2xl mr-2">⚠️</span>')
                .replace(/💡/g, '<span class="text-2xl mr-2">💡</span>')
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-orange-300">$1</strong>')
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

