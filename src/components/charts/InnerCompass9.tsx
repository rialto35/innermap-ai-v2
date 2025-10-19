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
import { INNER9_DESCRIPTIONS } from '@/constants/inner9';

export function toChartData(inner9: Record<string, number>): ChartDataPoint[] {
  const labelMap: Record<string, string> = {
    creation: INNER9_DESCRIPTIONS.creation.label,
    will: INNER9_DESCRIPTIONS.will.label,
    sensitivity: INNER9_DESCRIPTIONS.sensitivity.label,
    harmony: INNER9_DESCRIPTIONS.harmony.label,
    expression: INNER9_DESCRIPTIONS.expression.label,
    insight: INNER9_DESCRIPTIONS.insight.label,
    resilience: INNER9_DESCRIPTIONS.resilience.label,
    balance: INNER9_DESCRIPTIONS.balance.label,
    growth: INNER9_DESCRIPTIONS.growth.label,
  };

  return Object.entries(inner9).map(([k, v]) => ({
    key: k,
    label: labelMap[k] ?? k,
    value: Math.round(v),
  }));
}

