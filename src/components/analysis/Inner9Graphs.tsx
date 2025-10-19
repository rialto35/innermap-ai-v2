"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

type Props = {
  big5Percentiles: { O: number; C: number; E: number; A: number; N: number };
  mbtiRatios: { EI: number; SN: number; TF: number; JP: number };
};

// Big5 trait labels (Korean)
const BIG5_LABELS: Record<string, string> = {
  O: "개방성",
  C: "성실성",
  E: "외향성",
  A: "친화성",
  N: "신경성",
};

// MBTI dimension labels (Korean)
const MBTI_LABELS: Record<string, string> = {
  EI: "외향-내향",
  SN: "감각-직관",
  TF: "사고-감정",
  JP: "판단-인식",
};

// Color mapping for Big5 traits
const BIG5_COLORS: Record<string, string> = {
  O: "#8B5CF6", // Violet
  C: "#3B82F6", // Blue
  E: "#10B981", // Green
  A: "#F59E0B", // Amber
  N: "#EF4444", // Red
};

// Color mapping for MBTI dimensions
const MBTI_COLORS: Record<string, string> = {
  EI: "#8B5CF6", // Violet
  SN: "#3B82F6", // Blue
  TF: "#10B981", // Green
  JP: "#F59E0B", // Amber
};

/**
 * Custom Tooltip for Big5 Percentiles
 */
const Big5Tooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg bg-zinc-800 p-3 shadow-lg border border-zinc-700">
        <p className="font-semibold text-white">{data.label}</p>
        <p className="text-sm text-white/80">백분위수: {data.value}%</p>
        <p className="text-xs text-white/60 mt-1">
          {data.value >= 70 ? "높음" : data.value >= 30 ? "평균" : "낮음"}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom Tooltip for MBTI Ratios
 */
const MBTITooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const [left, right] = data.name.split("");
    const leftRatio = data.value;
    const rightRatio = 100 - data.value;
    
    return (
      <div className="rounded-lg bg-zinc-800 p-3 shadow-lg border border-zinc-700">
        <p className="font-semibold text-white">{data.label}</p>
        <div className="text-sm text-white/80 mt-1">
          <p>{left}: {leftRatio}%</p>
          <p>{right}: {rightRatio}%</p>
        </div>
        <p className="text-xs text-white/60 mt-1">
          {leftRatio > 60 ? `${left} 성향 강함` : leftRatio < 40 ? `${right} 성향 강함` : "균형적"}
        </p>
      </div>
    );
  }
  return null;
};

export default function Inner9Graphs({ big5Percentiles, mbtiRatios }: Props) {
  // Transform Big5 data
  const big5Data = Object.entries(big5Percentiles).map(([key, value]) => ({
    name: key,
    label: BIG5_LABELS[key] || key,
    value,
    color: BIG5_COLORS[key] || "#6B7280",
  }));

  // Transform MBTI data
  const mbtiData = Object.entries(mbtiRatios).map(([key, value]) => ({
    name: key,
    label: MBTI_LABELS[key] || key,
    value,
    color: MBTI_COLORS[key] || "#6B7280",
  }));

  return (
    <div className="space-y-8">
      {/* Big5 Percentiles Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span>
            <span>Big5 성격 요인 백분위수</span>
          </h3>
          <p className="text-sm text-white/60 mt-1">
            당신의 Big5 성격 특성이 전체 인구 대비 어느 위치에 있는지 보여줍니다
          </p>
        </div>

        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={big5Data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="label"
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
                label={{
                  value: "백분위수 (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#999", fontSize: 12 },
                }}
              />
              <Tooltip content={<Big5Tooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {big5Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {big5Data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/70">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white/80">해석:</span> 70% 이상은 높음, 30-70%는 평균, 30% 이하는 낮음
          </p>
        </div>
      </div>

      {/* MBTI Ratios Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧠</span>
            <span>MBTI 축 비율</span>
          </h3>
          <p className="text-sm text-white/60 mt-1">
            각 MBTI 차원에서 당신의 선호도 비율을 보여줍니다
          </p>
        </div>

        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mbtiData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="label"
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
                label={{
                  value: "비율 (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#999", fontSize: 12 },
                }}
              />
              <Tooltip content={<MBTITooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {mbtiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {mbtiData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/70">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white/80">해석:</span> 60% 이상은 강한 선호, 40-60%는 균형적, 40% 이하는 반대 성향 선호
          </p>
        </div>
      </div>
    </div>
  );
}

