/**
 * [5] 성장 퀘스트 섹션
 * 이번 달 실천 과제 + 장기 방향
 */

'use client';

interface QuestsSectionProps {
  content: string;
}

export default function QuestsSection({ content }: QuestsSectionProps) {
  if (!content) return null;

  // Quest 항목 파싱
  const questMatches = content.match(/\*\*Quest \d+:\s*(.+?)\*\*\s*\n→\s*(.+?)(?=\n|$)/g) || [];
  const quests = questMatches.map(item => {
    const match = item.match(/\*\*Quest \d+:\s*(.+?)\*\*\s*\n→\s*(.+)/);
    if (match) {
      return {
        title: match[1].trim(),
        action: match[2].trim()
      };
    }
    return null;
  }).filter(Boolean);

  // 추천 예시 파싱
  const recommendMatch = content.match(/→\s*추천:\s*(.+)/);
  const recommendation = recommendMatch?.[1] || '';

  // 장기 방향 파싱
  const careerMatch = content.match(/커리어:\s*(.+)/);
  const booksMatch = content.match(/추천 도서:\s*(.+)/);
  const coreTaskMatch = content.match(/핵심 과제:\s*(.+)/);

  const longTerm = {
    career: careerMatch?.[1] || '',
    books: booksMatch?.[1] || '',
    coreTask: coreTaskMatch?.[1] || ''
  };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="glass-card p-10">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <div className="text-yellow-400 text-sm font-bold tracking-wider">QUESTS</div>
            <h3 className="text-3xl font-bold text-white">성장 퀘스트</h3>
          </div>
        </div>

        {/* 이번 달 실천 과제 */}
        <div className="mb-10">
          <h4 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-2">
            <span>🎯</span>
            <span>이번 달 실천 과제</span>
          </h4>
          
          <div className="space-y-4">
            {quests.map((quest, index) => (
              <div
                key={index}
                className="group relative p-5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInRight 0.6s ease-out both'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                    <span className="text-yellow-300 font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-yellow-200 mb-2">
                      {quest.title}
                    </h5>
                    <p className="text-gray-300 leading-relaxed">
                      {quest.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendation && (
            <div className="mt-4 pl-12">
              <div className="p-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
                <span className="text-blue-300">
                  <strong>추천:</strong> {recommendation}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 장기 방향 */}
        {(longTerm.career || longTerm.books || longTerm.coreTask) && (
          <div className="pt-8 border-t border-gray-700/50">
            <h4 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <span>📚</span>
              <span>장기 방향</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {longTerm.career && (
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="text-sm font-bold text-purple-400 mb-2">💼 커리어</div>
                  <p className="text-gray-300">{longTerm.career}</p>
                </div>
              )}
              
              {longTerm.books && (
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                  <div className="text-sm font-bold text-pink-400 mb-2">📖 추천 도서</div>
                  <p className="text-gray-300">{longTerm.books}</p>
                </div>
              )}
              
              {longTerm.coreTask && (
                <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                  <div className="text-sm font-bold text-indigo-400 mb-2">🎯 핵심 과제</div>
                  <p className="text-gray-300">{longTerm.coreTask}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fallback: 파싱 실패 시 원본 표시 */}
        {quests.length === 0 && (
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/🎯/g, '<span class="text-2xl mr-2">🎯</span>')
                .replace(/📚/g, '<span class="text-2xl mr-2">📚</span>')
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-yellow-300">$1</strong>')
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
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

