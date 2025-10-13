'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Big5RadarChartProps {
  big5: {
    O: number  // Openness
    C: number  // Conscientiousness
    E: number  // Extraversion
    A: number  // Agreeableness
    N: number  // Neuroticism
  }
}

export default function Big5RadarChart({ big5 }: Big5RadarChartProps) {
  const data = [
    { trait: '개방성', value: big5.O, fullMark: 100 },
    { trait: '성실성', value: big5.C, fullMark: 100 },
    { trait: '외향성', value: big5.E, fullMark: 100 },
    { trait: '친화성', value: big5.A, fullMark: 100 },
    { trait: '신경성', value: big5.N, fullMark: 100 },
  ]

  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Big5 성격 특성</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#52525b" />
          <PolarAngleAxis 
            dataKey="trait" 
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 10 }}
          />
          <Radar 
            name="Big5" 
            dataKey="value" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#27272a', 
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* 수치 표시 */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {data.map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-zinc-400">{item.trait}</div>
            <div className="text-emerald-400 font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

