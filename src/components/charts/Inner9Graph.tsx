"use client";

import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from "recharts";

interface Inner9GraphProps {
  labels: string[];
  values: number[];
}

export default function Inner9Graph({ labels, values }: Inner9GraphProps) {
  const data = labels.map((name, i) => ({ 
    name, 
    value: values[i] ?? 0 
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: 'rgba(255,255,255,0.5)' }}
          />
          <Radar 
            dataKey="value" 
            stroke="#8B5CF6" 
            fill="#8B5CF6" 
            fillOpacity={0.6} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

