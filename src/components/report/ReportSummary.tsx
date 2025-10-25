/**
 * ReportSummary 컴포넌트
 * 검사 직후와 요약 탭에서 동일하게 사용
 */

import { ReportV1 } from '@/types/report';
import InnerCompass9 from '@/components/charts/InnerCompass9';

interface ReportSummaryProps {
  report: ReportV1;
}

export default function ReportSummary({ report }: ReportSummaryProps) {
  const { scores, summary, meta } = report;

  return (
    <div data-testid="summary-root" className="space-y-8">
      {/* 요약 섹션 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>핵심 요약</span>
        </h2>
        <div className="space-y-4">
          <div className="text-lg font-medium text-white">
            {summary.highlight}
          </div>
          <ul className="space-y-2">
            {summary.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2 text-white/80">
                <span className="text-white/50">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Big5 점수 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>🧠</span>
          <span>Big5 성격 분석</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(scores.big5).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-white/70 uppercase">{key}</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MBTI & RETI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎭</span>
            <span>MBTI</span>
          </h3>
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {scores.mbti}
          </div>
          <p className="text-white/70 text-sm">
            성격 유형 지표
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>RETI</span>
          </h3>
          <div className="text-4xl font-bold text-blue-400 mb-2">
            {scores.reti}
          </div>
          <p className="text-white/70 text-sm">
            동기 유형 지표
          </p>
        </div>
      </div>

      {/* Inner9 차트 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🧭</span>
          <span>Inner9 내면 지도</span>
        </h3>
        <div data-testid="inner9-chart">
          <InnerCompass9 
            data={scores.inner9.map(axis => ({ 
              key: axis.label.toLowerCase(), 
              label: axis.label, 
              value: axis.value 
            }))} 
            color="#8B5CF6" 
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
          {scores.inner9.map((axis, index) => (
            <div key={index} className="text-center">
              <div className="text-white/70 font-medium">{axis.label}</div>
              <div className="text-white font-bold">{axis.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>ℹ️</span>
          <span>분석 정보</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-white/70">엔진 버전</div>
            <div className="text-white font-medium">{meta.engineVersion}</div>
          </div>
          <div>
            <div className="text-white/70">가중치 버전</div>
            <div className="text-white font-medium">{meta.weightsVersion}</div>
          </div>
          <div>
            <div className="text-white/70">생성 시간</div>
            <div className="text-white font-medium">
              {new Date(meta.generatedAt).toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}