"use client";

import React from "react";

type HeroGuardEmptyStateProps = {
  name?: string | null;
  onStartTest: () => void;
};

export default function HeroGuardEmptyState({ name = "여행자", onStartTest }: HeroGuardEmptyStateProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-white">
      <div className="max-w-lg w-full space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-white/40">Welcome, {name}</p>
          <h1 className="text-3xl font-bold">검사를 먼저 진행해 주세요</h1>
          <p className="text-white/60">
            아직 저장된 분석 결과가 없어요. 5~7분 정도만 투자하면 나만의 영웅, 부족, 결정석 정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-white/90">검사를 마치면 이런 정보를 볼 수 있어요</h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li>• 144가지 영웅 중 나와 가장 닮은 영웅 카드</li>
            <li>• MBTI, Big5, Inner9 기반의 상세 성향 분석</li>
            <li>• 사주 기반 12부족 & 맞춤 결정석 추천</li>
          </ul>
        </div>

        <button
          onClick={onStartTest}
          className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition"
        >
          검사 시작하기 →
        </button>
      </div>
    </section>
  );
}

