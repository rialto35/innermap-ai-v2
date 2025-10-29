/**
 * DeepAnalysis Component
 * 13단계 통합 리포트 + 12개 실용 카드
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DeepAnalysisProps {
  heroData?: any;
  reportData?: any;
}

export default function DeepAnalysis({ heroData, reportData }: DeepAnalysisProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (heroData?.hasTestResult) {
      loadReport();
    } else {
      setLoading(false);
    }
  }, [heroData]);

  async function loadReport() {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache
      const assessmentId = heroData?.assessmentId;
      if (assessmentId) {
        const cached = await fetch(`/api/analysis/deep-report/cached?assessmentId=${assessmentId}`);
        if (cached.ok) {
          const data = await cached.json();
          setReport(data.report);
          setLoading(false);
          return;
        }
      }

      // Generate new report
      await generateReport();
    } catch (err) {
      console.error('Error loading report:', err);
      setError(err instanceof Error ? err.message : 'Failed to load report');
      setLoading(false);
    }
  }

  async function generateReport() {
    try {
      setGenerating(true);
      setProgress(0);
      setError(null);

      const response = await fetch('/api/analysis/deep-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.chunk) {
              fullText += data.chunk;
              setProgress(prev => Math.min(prev + 1, 13));
            }
            
            if (data.done) {
              // Parse the complete JSON response
              try {
                let jsonText = data.fullText || fullText;
                
                console.log('🔍 [DeepAnalysis] Raw response length:', jsonText.length);
                console.log('🔍 [DeepAnalysis] First 500 chars:', jsonText.substring(0, 500));
                
                // Remove markdown code blocks if present
                jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
                jsonText = jsonText.trim();
                
                // Check if response starts with valid JSON
                if (!jsonText.startsWith('{')) {
                  console.error('❌ [DeepAnalysis] Response is not JSON! First 200 chars:', jsonText.substring(0, 200));
                  throw new Error('AI returned non-JSON response. This usually means the prompt is too complex or token limit exceeded.');
                }
                
                const parsed = JSON.parse(jsonText);
                
                // Validate structure
                if (!parsed.sections || !Array.isArray(parsed.sections)) {
                  throw new Error('Invalid report structure: missing sections array');
                }
                
                console.log('✅ [DeepAnalysis] Report parsed successfully:', parsed.sections.length, 'sections');
                setReport(parsed);
                
                // Save to database
                await fetch('/api/analysis/deep-report/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    assessmentId: heroData?.assessmentId,
                    reportSections: parsed.sections,
                    practicalCards: parsed.practicalCards || [],
                    tokenCount: fullText.length,
                  }),
                });
              } catch (parseError) {
                console.error('❌ [DeepAnalysis] Failed to parse report:', parseError);
                console.error('❌ [DeepAnalysis] Raw text (first 500):', (data.fullText || fullText).substring(0, 500));
                setError('리포트 파싱에 실패했습니다. 다시 시도해주세요.');
              }
            }
            
            if (data.error) {
              throw new Error(data.error);
            }
          }
        }
      }

      setGenerating(false);
      setLoading(false);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      setGenerating(false);
      setLoading(false);
    }
  }

  // No test result
  if (!heroData?.hasTestResult) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">심층 분석</h3>
          <p className="text-white/60 text-sm mb-6">
            새로운 분석을 시작하면 AI 기반 심층 분석이 제공됩니다
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm">
            <span className="animate-pulse">●</span>
            <span>분석 대기 중</span>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || generating) {
    return <LoadingState progress={progress} generating={generating} />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={generateReport} />;
  }

  // Report display
  if (!report) {
    return <ErrorState error="리포트를 불러올 수 없습니다" onRetry={loadReport} />;
  }

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <ReportHeader onRegenerate={generateReport} generatedAt={report.generatedAt} />
      
      {/* 13-Step Report Sections */}
      {report.sections && report.sections.map((section: any) => (
        <ReportSection key={section.id} section={section} />
      ))}
      
      {/* 12 Practical Cards */}
      {report.practicalCards && report.practicalCards.length > 0 && (
        <PracticalCards cards={report.practicalCards} />
      )}
    </div>
  );
}

// Loading State Component
function LoadingState({ progress, generating }: { progress: number; generating: boolean }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🔍
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">
          {generating ? '심층 분석 생성 중...' : '리포트 불러오는 중...'}
        </h3>
        {generating && (
          <>
            <div className="mb-4">
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-violet-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / 13) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/60 text-sm">
                {progress} / 13 단계 완료
              </p>
            </div>
            <p className="text-white/40 text-xs">
              AI가 당신의 내면을 깊이 분석하고 있습니다...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">오류가 발생했습니다</h3>
        <p className="text-white/60 text-sm mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

// Report Header Component
function ReportHeader({ onRegenerate, generatedAt }: { onRegenerate: () => void; generatedAt?: string }) {
  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">🌈</div>
            <h3 className="text-2xl font-bold text-white">innerMap 13단계 통합 리포트</h3>
          </div>
          <p className="text-white/60 text-sm">
            AI 기반 심층 심리 분석을 통한 당신의 내면 탐구
          </p>
          {generatedAt && (
            <p className="text-white/40 text-xs mt-2">
              생성일: {new Date(generatedAt).toLocaleString('ko-KR')}
            </p>
          )}
        </div>
        <button
          onClick={onRegenerate}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-lg transition text-sm"
        >
          🔄 재생성
        </button>
      </div>
    </div>
  );
}

// Report Section Component
function ReportSection({ section }: { section: any }) {
  // Special rendering for Word Cloud (step 13)
  if (section.id === 13 && section.keywords && Array.isArray(section.keywords)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="text-3xl sm:text-4xl">{section.icon}</div>
          <div>
            <div className="text-xs text-white/40 mb-1">{section.id}단계</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{section.title}</h3>
          </div>
        </div>
        
        {/* Word Cloud Display */}
        <div className="flex flex-wrap gap-3 justify-center">
          {section.keywords.map((keyword: any, index: number) => {
            const size = keyword.weight >= 8 ? 'text-3xl' : keyword.weight >= 6 ? 'text-2xl' : 'text-xl';
            const opacity = keyword.weight >= 8 ? 'opacity-100' : keyword.weight >= 6 ? 'opacity-80' : 'opacity-60';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${opacity}`}
                style={{
                  borderColor: keyword.color || '#8B5CF6',
                  backgroundColor: `${keyword.color || '#8B5CF6'}20`,
                }}
                title={keyword.source}
              >
                <span className={size}>{keyword.emoji}</span>
                <span className={`${size} font-bold text-white`}>{keyword.word}</span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Source Legend */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/40 text-sm text-center">
            💡 각 키워드는 MBTI, Big5, Inner9, Tribe, Stone 분석에서 도출되었습니다
          </p>
        </div>
      </motion.div>
    );
  }
  
  // Default rendering for other sections
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl sm:text-4xl">{section.icon}</div>
        <div>
          <div className="text-xs text-white/40 mb-1">{section.id}단계</div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{section.title}</h3>
        </div>
      </div>
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
          {section.content}
        </div>
      </div>
    </motion.div>
  );
}

// Practical Cards Component
function PracticalCards({ cards }: { cards: any[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">🎴 실용 분석 카드</h3>
        <p className="text-white/60 text-sm">
          실생활에 바로 적용 가능한 12가지 분석
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <PracticalCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

// Individual Practical Card
function PracticalCard({ card }: { card: any }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{card.icon}</div>
        <h4 className="text-lg font-semibold text-white flex-1">{card.title}</h4>
        <div className="text-white/40">
          {expanded ? '▼' : '▶'}
        </div>
      </div>
      
      <p className="text-white/70 text-sm mb-3">{card.insight}</p>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 pt-3 border-t border-white/10"
        >
          {card.details && card.details.length > 0 && (
            <div>
              <p className="text-white/60 text-xs font-medium mb-2">세부 사항:</p>
              <ul className="space-y-1">
                {card.details.map((detail: string, idx: number) => (
                  <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {card.actionItems && card.actionItems.length > 0 && (
            <div>
              <p className="text-white/60 text-xs font-medium mb-2">실천 방법:</p>
              <ul className="space-y-1">
                {card.actionItems.map((action: string, idx: number) => (
                  <li key={idx} className="text-emerald-300 text-sm flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
