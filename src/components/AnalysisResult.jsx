'use client';
import { useState } from 'react';
import { generatePDF, generatePrintPDF, generateTextFile } from '@/utils/pdfGenerator';
import HeroCard from './HeroCard';

export default function AnalysisResult({ testResults, onReset }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasAllResults = true; // 임시로 항상 true

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
      
      // 1차 시도: 이미지 기반 PDF (한글 지원)
      const pdfResult = await generatePDF(analysis, testResults);
      
      if (pdfResult.success) {
        console.log('PDF 다운로드 완료:', pdfResult.fileName);
        return;
      }
      
      // 2차 시도: 텍스트 파일 (확실한 대안)
      console.warn('PDF 생성 실패, 텍스트 파일로 대체:', pdfResult.error);
      const textResult = generateTextFile(analysis, testResults);
      
      if (textResult.success) {
        alert('PDF 생성이 어려워 텍스트 파일로 다운로드됩니다.');
      } else {
        alert('파일 다운로드에 실패했습니다: ' + textResult.error);
      }
      
    } catch (error) {
      console.error('다운로드 에러:', error);
      
      // 최종 fallback: 브라우저 프린트
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

  if (analysis) {
    const { combined } = analysis;
    
    // 안전한 데이터 처리
    const safeData = {
      title: combined?.title || "성격 분석 결과",
      summary: combined?.summary || "분석이 완료되었습니다.",
      strengths: Array.isArray(combined?.strengths) ? combined.strengths : [],
      growth_areas: Array.isArray(combined?.growth_areas) ? combined.growth_areas : [],
      daily_practices: Array.isArray(combined?.daily_practices) ? combined.daily_practices : [],
      final_advice: combined?.final_advice || "당신만의 독특함을 발휘하세요!"
    };
    
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 m-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">🧠 InnerMap AI 종합 분석</h2>
          <p className="text-gray-600">AI가 분석한 당신의 성격 프로필입니다</p>
        </div>

        {/* 요약 섹션 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-3">{safeData.title}</h3>
          <p className="text-lg leading-relaxed">{safeData.summary}</p>
        </div>

        {/* 테스트 결과 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-800 mb-2">MBTI</h4>
            <p className="text-2xl font-bold text-blue-600">{testResults?.mbti || 'N/A'}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-800 mb-2">에니어그램</h4>
            <p className="text-2xl font-bold text-green-600">유형 {testResults?.enneagram || 'N/A'}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-800 mb-2">주요 컬러</h4>
            <div className="flex justify-center space-x-1">
              {(testResults?.colors || []).slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color?.hex || '#ccc' }}
                  title={color?.name || `색상 ${index + 1}`}
                ></div>
              ))}
              {(!testResults?.colors || testResults.colors.length === 0) && (
                <div className="text-gray-400 text-sm">선택된 컬러 없음</div>
              )}
            </div>
          </div>
        </div>

        {/* 히어로 카드 - AI 분석 완료 후에도 표시 */}
        {testResults?.mbti && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🎭 당신의 히어로</h3>
              <p className="text-gray-600">MBTI 유형에 따른 당신만의 히어로를 만나보세요!</p>
            </div>
            <div className="flex justify-center">
              <HeroCard 
                mbtiType={testResults.mbti} 
                enneagramType={testResults.enneagram ? `type${testResults.enneagram}` : null} 
              />
            </div>
          </div>
        )}

        {/* 강점 */}
        {safeData.strengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">✨ 당신의 강점</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {safeData.strengths.map((strength, index) => (
                <div key={index} className="bg-white rounded p-3 text-center">
                  <span className="text-green-700 font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 성장 영역 */}
        {safeData.growth_areas.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">🚀 성장 포인트</h4>
            <ul className="space-y-2">
              {safeData.growth_areas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 일상 실천법 */}
        {safeData.daily_practices.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">💡 일상 실천법</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safeData.daily_practices.map((practice, index) => (
                <div key={index} className="flex items-center bg-white rounded p-3">
                  <span className="text-blue-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 최종 조언 */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-3">🎯 마지막 한 마디</h4>
          <p className="text-gray-700 text-lg italic">"{safeData.final_advice}"</p>
        </div>

   {/* 액션 버튼 */}
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <button
    onClick={downloadPDF}
    disabled={loading}
    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
  >
    📄 PDF 다운로드
  </button>
  <button
    onClick={() => generatePrintPDF()}
    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
  >
    🖨️ 프린트
  </button>
  <button
    onClick={() => generateTextFile(analysis, testResults)}
    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
  >
    📝 텍스트
  </button>
  <button
    onClick={onReset}
    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
  >
    🔄 다시 테스트
  </button>
</div>
        {/* 타임스탬프 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          분석 완료: {new Date().toLocaleString('ko-KR')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 m-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI 종합 분석</h2>
        
        {/* MBTI가 있으면 히어로 카드 표시 */}
        {testResults?.mbti && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🎭 당신의 히어로</h3>
              <p className="text-gray-600">MBTI 유형에 따른 당신만의 히어로를 만나보세요!</p>
            </div>
            <div className="flex justify-center">
              <HeroCard 
                mbtiType={testResults.mbti} 
                enneagramType={testResults.enneagram ? `type${testResults.enneagram}` : null} 
              />
            </div>
          </div>
        )}
        
        {/* 완료 상태 표시 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
            <div className="text-sm">컬러심리</div>
            <div className="font-bold">💭</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
            <div className="text-sm">MBTI</div>
            <div className="font-bold">🧠</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
            <div className="text-sm">에니어그램</div>
            <div className="font-bold">🔢</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
            <div className="text-sm">마음카드</div>
            <div className="font-bold">💭</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">⚠️ {error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              닫기
            </button>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            AI가 당신의 성격을 종합 분석해드립니다. (데모 버전)
          </p>
          <button
            onClick={analyzeWithAI}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '🤖 AI 분석 중...' : '🧠 AI 종합 분석 시작'}
          </button>
        </div>
      </div>
    </div>
  );
}