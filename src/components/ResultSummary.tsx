/**
 * 결과 요약 컴포넌트
 * MBTI, RETI, Big5, Inner9 결과를 동시에 표시
 */

'use client';

import { FullResult } from '@/lib/engine/orchestrator';
import Inner9Chart from './charts/InnerCompass9';

interface ResultSummaryProps {
  result: FullResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  const { big5, mbti, reti, inner9, timestamp } = result;

  return (
    <section className="space-y-6">
      {/* 결과 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">당신의 성격 분석 결과</h2>
        <p className="text-gray-400 text-sm" data-testid="result-timestamp">
          생성 시각: {new Date(timestamp).toLocaleString('ko-KR')}
        </p>
      </div>

      {/* MBTI 결과 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>🎭</span>
          <span>MBTI 성격 유형</span>
        </h3>
        <div 
          className="text-3xl font-bold text-violet-400 text-center"
          data-testid="result-mbti"
        >
          {mbti}
        </div>
        <p className="text-gray-400 text-sm text-center mt-2">
          {mbti} 유형의 특성을 확인해보세요
        </p>
      </div>

      {/* RETI 결과 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>🎯</span>
          <span>RETI 동기 유형</span>
        </h3>
        <div 
          className="text-3xl font-bold text-blue-400 text-center"
          data-testid="result-reti"
        >
          {reti}형
        </div>
        <p className="text-gray-400 text-sm text-center mt-2">
          당신의 핵심 동기는 {reti}번 유형입니다
        </p>
      </div>

      {/* Big5 결과 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>Big5 성격 특성</span>
        </h3>
        <div 
          className="text-lg font-medium text-white text-center"
          data-testid="result-big5"
        >
          O{big5.o} C{big5.c} E{big5.e} A{big5.a} N{big5.n}
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
          <div className="text-center">
            <div className="text-violet-400 font-medium">개방성</div>
            <div className="text-white">{big5.o}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-medium">성실성</div>
            <div className="text-white">{big5.c}</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-medium">외향성</div>
            <div className="text-white">{big5.e}</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-medium">친화성</div>
            <div className="text-white">{big5.a}</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-medium">신경성</div>
            <div className="text-white">{big5.n}</div>
          </div>
        </div>
      </div>

      {/* Inner9 결과 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span>🧭</span>
          <span>Inner9 내면 지도</span>
        </h3>
        <div data-testid="inner9-chart">
          <Inner9Chart 
            data={inner9.map(axis => ({ key: axis.label.toLowerCase(), label: axis.label, value: axis.value }))} 
            color="#8B5CF6" 
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
          {inner9.map((axis, index) => (
            <div key={index} className="text-center">
              <div className="text-white/70 font-medium">{axis.label}</div>
              <div className="text-white font-bold">{axis.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 동시 생성 보장 메시지 */}
      <div className="text-center text-gray-500 text-xs">
        <p>모든 분석 결과는 동일한 시점에 생성되었습니다</p>
        <p data-testid="result-timestamp">{timestamp}</p>
      </div>
    </section>
  );
}
