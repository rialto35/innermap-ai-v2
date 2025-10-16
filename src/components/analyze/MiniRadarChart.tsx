/**
 * Mini Radar Chart for Live Preview
 */

'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface MiniRadarChartProps {
  big5: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export default function MiniRadarChart({ big5 }: MiniRadarChartProps) {
  const data = [
    { trait: '개방성', value: big5.openness },
    { trait: '성실성', value: big5.conscientiousness },
    { trait: '외향성', value: big5.extraversion },
    { trait: '친화성', value: big5.agreeableness },
    { trait: '안정성', value: 100 - big5.neuroticism } // Invert for display
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="trait"
          tick={{ fill: '#6b7280', fontSize: 11 }}
        />
        <PolarRadiusAxis 
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Radar
          dataKey="value"
          stroke="#4f46e5"
          fill="#818cf8"
          fillOpacity={0.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

