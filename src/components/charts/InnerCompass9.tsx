/**
 * InnerCompass9 - 9-dimensional Radar Chart Component
 * Visualizes Inner9 scores using Recharts
 */

'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

type ChartDataPoint = { key: string; label: string; value: number };

type Props = { 
  data: ChartDataPoint[];
  color?: string;
};

export default function InnerCompass9({ data, color = '#8b5cf6' }: Props) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="label" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: 'rgba(255,255,255,0.5)' }}
          />
          <Radar 
            dataKey="value" 
            stroke={color}
            fill={color}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Convert Inner9 object to chart data format
 */
export function toChartData(inner9: Record<string, number>): ChartDataPoint[] {
  const labelMap: Record<string, string> = {
    creation: '창조성',
    will: '의지력',
    sensitivity: '감수성',
    harmony: '공감력',
    expression: '표현력',
    insight: '통찰력',
    resilience: '회복력',
    balance: '균형감',
    growth: '성장력',
  };

  return Object.entries(inner9).map(([k, v]) => ({
    key: k,
    label: labelMap[k] ?? k,
    value: Math.round(v),
  }));
}

