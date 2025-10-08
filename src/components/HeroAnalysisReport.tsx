/**
 * Hero Analysis Report Component
 * 
 * 영웅 분석 결과를 보기 좋게 표시하는 컴포넌트
 */

'use client';
import { useState } from 'react';
import type { HeroAnalysisResult } from '@/lib/prompts/systemPrompt';

interface HeroAnalysisReportProps {
  result: HeroAnalysisResult;
  onReset?: () => void;
}

export default function HeroAnalysisReport({ result, onReset }: HeroAnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'full'>('visual');

  return (
    <div className="max-w-4xl mx-auto">
      {/* 탭 선택 */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'visual'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          📊 비주얼 보기
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'full'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          📄 전체 리포트
        </button>
      </div>

      {/* 비주얼 탭 */}
      {activeTab === 'visual' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* 섹션 0: 영웅 공개 */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section0_revelation} />
            </div>
          </div>

          {/* 섹션 1: 대륙의 기운 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              🏔️ 대륙의 기운
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section1_continent} />
            </div>
          </div>

          {/* 섹션 2: 영웅의 정체성 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              ⚔️ 영웅의 정체성
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section2_identity} />
            </div>
          </div>

          {/* 섹션 3: 영웅의 강점 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              ✨ 영웅의 강점
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section3_strengths} />
            </div>
          </div>

          {/* 섹션 4: 그림자 영역 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              ⚠️ 그림자 영역
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section4_shadows} />
            </div>
          </div>

          {/* 섹션 5: 성장 퀘스트 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              🎯 성장 퀘스트
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section5_quests} />
            </div>
          </div>

          {/* 섹션 6: 영웅의 선언 */}
          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              🌟 영웅의 선언
            </h3>
            <div className="prose prose-invert max-w-none">
              <MarkdownText text={result.section6_declaration} />
            </div>
          </div>

        </div>
      )}

      {/* 전체 리포트 탭 */}
      {activeTab === 'full' && (
        <div className="glass-card p-8 rounded-2xl animate-fade-in">
          <div className="prose prose-invert max-w-none">
            <MarkdownText text={result.fullReport} />
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => {
            const blob = new Blob([result.fullReport], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hero-analysis-${Date.now()}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          📄 Markdown 다운로드
        </button>
        
        {onReset && (
          <button
            onClick={onReset}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            🔄 다시 분석하기
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * 간단한 Markdown 텍스트 렌더링 컴포넌트
 */
function MarkdownText({ text }: { text: string }) {
  // 간단한 마크다운 변환
  const renderLine = (line: string, index: number) => {
    // 볼드체 (**text**)
    if (line.includes('**')) {
      const parts = line.split('**');
      return (
        <p key={index} className="mb-2 text-white/90">
          {parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part
          )}
        </p>
      );
    }
    
    // 리스트 (✓, -, →)
    if (line.match(/^[✓\-→•]/)) {
      return (
        <li key={index} className="ml-4 mb-1 text-white/80">
          {line.replace(/^[✓\-→•]\s*/, '')}
        </li>
      );
    }
    
    // 헤더 (###)
    if (line.startsWith('###')) {
      return (
        <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">
          {line.replace(/^###\s*/, '')}
        </h3>
      );
    }
    
    // 해시태그 (#keyword)
    if (line.includes('#') && !line.startsWith('#')) {
      return (
        <p key={index} className="mb-2">
          {line.split(' ').map((word, i) => 
            word.startsWith('#') ? (
              <span key={i} className="text-blue-400 mr-2">{word}</span>
            ) : (
              <span key={i} className="text-white/90 mr-1">{word}</span>
            )
          )}
        </p>
      );
    }
    
    // 구분선
    if (line.match(/^━+$/)) {
      return <hr key={index} className="my-4 border-white/20" />;
    }
    
    // 일반 텍스트
    if (line.trim()) {
      return <p key={index} className="mb-2 text-white/90">{line}</p>;
    }
    
    return null;
  };

  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, index) => renderLine(line, index))}
    </div>
  );
}

