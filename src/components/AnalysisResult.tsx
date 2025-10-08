/**
 * InnerMap AI v2 - 영웅 분석 결과 페이지
 * 7개 섹션으로 구성된 영웅 세계관 리포트
 */

'use client';
import { useState } from 'react';
import { generatePDF, generatePrintPDF, generateTextFile } from '@/utils/pdfGenerator';
import HeroCard from './HeroCard';

// v2 섹션 컴포넌트
import HeroReveal from './result/HeroReveal';
import ContinentSection from './result/ContinentSection';
import IdentitySection from './result/IdentitySection';
import StrengthsSection from './result/StrengthsSection';
import ShadowSection from './result/ShadowSection';
import QuestsSection from './result/QuestsSection';
import DeclarationSection from './result/DeclarationSection';

interface TestResults {
  mbti?: string;
  enneagram?: number;
  big5?: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  colors?: Array<{ name: string; hex: string; ability?: string }>;
  birthDate?: string;
  colorPreference?: string;
}

interface AnalysisResultProps {
  testResults: TestResults;
  onReset: () => void;
}

export default function AnalysisResult({ testResults, onReset }: AnalysisResultProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testResults || {})
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        setError(result.error || '분석 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('AI 분석 연결에 실패했습니다.');
      console.error('AI 분석 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      
      const pdfResult = await generatePDF(analysis, testResults);
      
      if (pdfResult.success) {
        console.log('PDF 다운로드 완료:', pdfResult.fileName);
        return;
      }
      
      console.warn('PDF 생성 실패, 텍스트 파일로 대체:', pdfResult.error);
      const textResult = generateTextFile(analysis, testResults);
      
      if (textResult.success) {
        alert('PDF 생성이 어려워 텍스트 파일로 다운로드됩니다.');
      } else {
        alert('파일 다운로드에 실패했습니다: ' + textResult.error);
      }
      
    } catch (error) {
      console.error('다운로드 에러:', error);
      
      const printResult = generatePrintPDF();
      if (printResult.success) {
        alert('다운로드가 어려워 프린트 대화상자를 엽니다. "PDF로 저장" 옵션을 선택하세요.');
      } else {
        alert('다운로드 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 분석 완료 후 렌더링
  if (analysis) {
    const sections = analysis.sections || analysis.openai?.sections || {};
    const combined = analysis.combined || {};
    
    return (
      <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm mb-8">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-300 tracking-wide">Powered by</span>
              <span className="text-sm font-bold holographic-text">InnerMap AI v2</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="holographic-text">영웅 분석 리포트</span>
            </h1>
            <p className="text-xl text-gray-400">당신만의 영웅 이야기가 시작됩니다</p>
          </div>

          {/* 테스트 결과 요약 */}
          <div className="glass-card p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 분석 데이터</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-bold mb-2">MBTI</div>
                <div className="text-2xl font-bold text-white">{testResults?.mbti || 'N/A'}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-sm text-green-400 font-bold mb-2">RETI</div>
                <div className="text-2xl font-bold text-white">유형 {testResults?.enneagram || 'N/A'}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="text-sm text-purple-400 font-bold mb-2">Big5</div>
                <div className="text-sm text-white">
                  {testResults?.big5 ? '완료 ✓' : '미완성'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                <div className="text-sm text-pink-400 font-bold mb-2">색채심리</div>
                <div className="flex justify-center gap-1">
                  {(testResults?.colors || []).slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-white/30"
                      style={{ backgroundColor: color?.hex || '#ccc' }}
                      title={color?.name || `색상 ${index + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 히어로 카드 */}
          {testResults?.mbti && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">🎭 Your Hero</h3>
                <p className="text-gray-400">당신의 영웅을 만나보세요</p>
              </div>
              <div className="flex justify-center">
                <HeroCard 
                  mbtiType={testResults.mbti} 
                  enneagramType={testResults.enneagram ? `type${testResults.enneagram}` : null}
                  colorPreference={testResults.colorPreference}
                />
              </div>
            </div>
          )}

          {/* v2 섹션 컴포넌트 */}
          <div className="space-y-8">
            <HeroReveal content={sections.section0_revelation || ''} />
            <ContinentSection content={sections.section1_continent || ''} />
            <IdentitySection content={sections.section2_identity || ''} />
            <StrengthsSection content={sections.section3_strengths || ''} />
            <ShadowSection content={sections.section4_shadows || ''} />
            <QuestsSection content={sections.section5_quests || ''} />
            <DeclarationSection content={sections.section6_declaration || ''} />
          </div>

          {/* Fallback: 섹션이 없으면 전체 리포트 표시 */}
          {!sections.section0_revelation && combined.fullReport && (
            <div className="glass-card p-10 mt-8">
              <h3 className="text-2xl font-bold text-white mb-6">📋 전체 리포트</h3>
              <div 
                className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: combined.fullReport }}
              />
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="mt-12 sticky bottom-8 z-10">
            <div className="glass-card p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={downloadPDF}
                  disabled={loading}
                  className="neon-button neon-button-green px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  📄 PDF 다운로드
                </button>
                <button
                  onClick={() => generatePrintPDF()}
                  className="neon-button neon-button-blue px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  🖨️ 프린트
                </button>
                <button
                  onClick={() => generateTextFile(analysis, testResults)}
                  className="neon-button neon-button-gray px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  📝 텍스트
                </button>
                <button
                  onClick={onReset}
                  className="neon-button neon-button-purple px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  🔄 다시 테스트
                </button>
              </div>
              
              <div className="text-center mt-4 text-sm text-gray-500">
                분석 완료: {new Date().toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .holographic-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </div>
    );
  }

  // 분석 시작 전 화면
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 100%)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-card p-10 text-center">
          {/* 브랜딩 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/30">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-300">Powered by</span>
              <span className="text-sm font-bold holographic-text">InnerMap AI v2</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            <span className="holographic-text">🧠 AI 영웅 분석</span>
          </h2>
          
          {/* 히어로 카드 미리보기 */}
          {testResults?.mbti && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">🎭 Your Hero</h3>
                <p className="text-gray-400">당신의 영웅을 만나보세요</p>
              </div>
              <div className="flex justify-center">
                <HeroCard 
                  mbtiType={testResults.mbti} 
                  enneagramType={testResults.enneagram ? `type${testResults.enneagram}` : null}
                  colorPreference={testResults.colorPreference}
                />
              </div>
            </div>
          )}
          
          {/* 완료 상태 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className={`p-3 rounded-lg ${testResults?.colors ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
              <div className="text-sm text-gray-300">색채심리</div>
              <div className="font-bold text-2xl">{testResults?.colors ? '✓' : '○'}</div>
            </div>
            <div className={`p-3 rounded-lg ${testResults?.mbti ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
              <div className="text-sm text-gray-300">MBTI</div>
              <div className="font-bold text-2xl">{testResults?.mbti ? '✓' : '○'}</div>
            </div>
            <div className={`p-3 rounded-lg ${testResults?.enneagram ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
              <div className="text-sm text-gray-300">RETI</div>
              <div className="font-bold text-2xl">{testResults?.enneagram ? '✓' : '○'}</div>
            </div>
            <div className={`p-3 rounded-lg ${testResults?.big5 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
              <div className="text-sm text-gray-300">Big5</div>
              <div className="font-bold text-2xl">{testResults?.big5 ? '✓' : '○'}</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">⚠️ {error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 text-sm mt-2 hover:underline"
              >
                닫기
              </button>
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-400 mb-6">
              AI가 당신의 성격을 영웅 세계관으로 종합 분석합니다
            </p>
            <button
              onClick={analyzeWithAI}
              disabled={loading}
              className={`px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                loading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'neon-button neon-button-primary'
              }`}
            >
              {loading ? '🤖 AI 분석 중...' : '🧠 AI 영웅 분석 시작'}
            </button>
          </div>
        </div>

        <style jsx>{`
          .holographic-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </div>
    </div>
  );
}

