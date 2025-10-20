"use client";
import Link from 'next/link';

export default function ResultsHub() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">내 결과</h1>
          <p className="text-xl text-white/70 mb-8">
            당신의 심리 분석 결과를 다양한 관점에서 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link
            href="/results/inner9"
            className="group p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all"
          >
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Inner9 분석</h3>
            <p className="text-white/60 text-sm">
              내면의 9가지 차원을 통한 심층 분석
            </p>
          </Link>

          <Link
            href="/results/report"
            className="group p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all"
          >
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">상세 리포트</h3>
            <p className="text-white/60 text-sm">
              Big5, MBTI, RETI 등 종합 분석 결과
            </p>
          </Link>

          <Link
            href="/results/deep"
            className="group p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
          >
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">심층 분석</h3>
            <p className="text-white/60 text-sm">
              AI 기반 개인화된 심리 분석 리포트
            </p>
          </Link>

          <Link
            href="/results/coach"
            className="group p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all"
          >
            <div className="text-3xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold text-white mb-2">운세 코칭</h3>
            <p className="text-white/60 text-sm">
              개인화된 운세 및 조언 서비스
            </p>
          </Link>
        </div>

        <div className="mt-12">
          <Link
            href="/mypage"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-white"
          >
            <span>마이페이지로 돌아가기</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
