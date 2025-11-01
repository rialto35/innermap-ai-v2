/**
 * 신뢰도 배지 컴포넌트
 * 
 * 확률 수치 대신 "낮음/보통/높음"으로 표시
 */

"use client";

export function ConfidenceBadge({ 
  level,
  probability,
}: { 
  level?: "낮음" | "보통" | "높음";
  probability?: number;
}) {
  // probability가 주어지면 level 계산
  const computedLevel = level ?? (
    probability !== undefined
      ? probability >= 0.75 ? "높음" : probability >= 0.5 ? "보통" : "낮음"
      : "보통"
  );

  const colors = {
    "높음": "bg-green-100 text-green-800 border-green-200",
    "보통": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "낮음": "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons = {
    "높음": "✓",
    "보통": "~",
    "낮음": "?",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${colors[computedLevel]}`}>
      <span>{icons[computedLevel]}</span>
      <span>확신도: {computedLevel}</span>
    </span>
  );
}

/**
 * Enneagram Top-3 카드 컴포넌트
 */
export function EnneagramTop3Card({
  candidates,
}: {
  candidates: Array<{
    type: number;
    probability: number;
    confidence: "high" | "medium" | "low";
  }>;
}) {
  const confidenceKo = {
    high: "높음",
    medium: "보통",
    low: "낮음",
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Enneagram Top-3 후보</h3>
      <div className="space-y-2">
        {candidates.map((candidate, idx) => (
          <div
            key={candidate.type}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              idx === 0 ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${idx === 0 ? "text-purple-600" : "text-gray-600"}`}>
                {idx + 1}위
              </span>
              <span className="text-base font-semibold">
                {candidate.type}번 유형
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {Math.round(candidate.probability * 100)}%
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                candidate.confidence === "high" 
                  ? "bg-green-100 text-green-700" 
                  : candidate.confidence === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {confidenceKo[candidate.confidence]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        ℹ️ Enneagram은 자기성찰과 전문가 상담을 통해 확인하는 것이 가장 정확합니다.
      </p>
    </div>
  );
}

