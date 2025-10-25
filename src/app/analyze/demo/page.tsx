"use client";

import dynamic from "next/dynamic";
import Inner9Report from "@/components/Inner9Report";

const Inner9Chart = dynamic(() => import("@/components/Inner9Chart"), { ssr: false });

export default function AnalyzeDemoPage() {
  // 데모 데이터
  const demoResult = {
    big5: { O: 82, C: 48, E: 61, A: 55, N: 63 },
    mbti: "INFP",
    reti: "자율/자기표현",
    inner9: [
      { key: "창조", score: 88 },
      { key: "의지", score: 84 },
      { key: "통찰", score: 80 },
      { key: "균형", score: 62 },
      { key: "현실", score: 55 },
      { key: "연결", score: 48 },
      { key: "조화", score: 45 },
      { key: "감응", score: 44 },
      { key: "안정", score: 41 },
    ],
    analysis: null
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inner9 데모 결과</h1>
        <p className="text-gray-600">9가지 차원으로 당신의 내면을 탐색한 결과입니다</p>
      </div>
      
      {/* 차트 섹션 */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <Inner9Chart data={demoResult.inner9} />
      </section>
      
      {/* 리포트 섹션 */}
      <section>
        <Inner9Report result={demoResult} />
      </section>
    </div>
  );
}
