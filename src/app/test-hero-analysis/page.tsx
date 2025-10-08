'use client';
import { useState } from 'react';
import { useHeroAnalysis } from '@/hooks/useHeroAnalysis';
import HeroAnalysisReport from '@/components/HeroAnalysisReport';
import type { HeroAnalysisInput } from '@/lib/prompts/systemPrompt';

export default function TestHeroAnalysisPage() {
  const { analyze, result, loading, error, reset } = useHeroAnalysis();
  
  const [formData, setFormData] = useState<HeroAnalysisInput>({
    mbti: 'ENTP',
    enneagram: 7,
    big5: {
      openness: 85,
      conscientiousness: 45,
      extraversion: 70,
      agreeableness: 60,
      neuroticism: 35,
    },
    colors: ['터콰이즈', '퍼플', '오렌지'],
    birthDate: '1990-05-15',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyze(formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="animated-background"></div>
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🧬 Hero Analysis 테스트
            </h1>
            <p className="text-lg text-white/70">
              영웅 세계관 기반 성격 분석 시스템
            </p>
          </div>

          {/* 결과가 없을 때: 입력 폼 */}
          {!result && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
                
                {/* MBTI */}
                <div>
                  <label className="block text-white font-semibold mb-2">MBTI</label>
                  <select
                    value={formData.mbti}
                    onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* 에니어그램 */}
                <div>
                  <label className="block text-white font-semibold mb-2">에니어그램</label>
                  <select
                    value={formData.enneagram}
                    onChange={(e) => setFormData({ ...formData, enneagram: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <option key={num} value={num}>타입 {num}</option>
                    ))}
                  </select>
                </div>

                {/* Big5 */}
                <div className="space-y-3">
                  <label className="block text-white font-semibold">Big5 (선택)</label>
                  {formData.big5 && (
                    <>
                      <div>
                        <label className="text-sm text-white/70">개방성: {formData.big5.openness}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.big5.openness}
                          onChange={(e) => setFormData({
                            ...formData,
                            big5: { ...formData.big5!, openness: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70">성실성: {formData.big5.conscientiousness}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.big5.conscientiousness}
                          onChange={(e) => setFormData({
                            ...formData,
                            big5: { ...formData.big5!, conscientiousness: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70">외향성: {formData.big5.extraversion}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.big5.extraversion}
                          onChange={(e) => setFormData({
                            ...formData,
                            big5: { ...formData.big5!, extraversion: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70">친화성: {formData.big5.agreeableness}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.big5.agreeableness}
                          onChange={(e) => setFormData({
                            ...formData,
                            big5: { ...formData.big5!, agreeableness: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70">신경성: {formData.big5.neuroticism}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.big5.neuroticism}
                          onChange={(e) => setFormData({
                            ...formData,
                            big5: { ...formData.big5!, neuroticism: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* 컬러 */}
                <div>
                  <label className="block text-white font-semibold mb-2">선택 컬러 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: e.target.value.split(',').map(c => c.trim())
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="터콰이즈, 퍼플, 오렌지"
                  />
                </div>

                {/* 에러 메시지 */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                    ⚠️ {error}
                  </div>
                )}

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                    loading
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
                  } text-white`}
                >
                  {loading ? '🔮 분석 중...' : '🚀 영웅 분석 시작'}
                </button>
              </form>
            </div>
          )}

          {/* 결과 표시 */}
          {result && (
            <HeroAnalysisReport result={result} onReset={reset} />
          )}

        </div>
      </div>
    </div>
  );
}

