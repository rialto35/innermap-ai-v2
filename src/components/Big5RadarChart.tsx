'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/50 to-cyan-500/50 text-lg">🌌</span>
        <div>
          <h3 className="text-lg font-semibold">Big5 레이더</h3>
          <p className="text-xs text-white/50">특성별 백분위 점수를 확인하세요</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" radialLines={false} />
          <PolarAngleAxis 
            dataKey="trait" 
            tick={{ fill: '#d1d5db', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Radar 
            name="Big5" 
            dataKey="value" 
            stroke="url(#big5-stroke)" 
            fill="url(#big5-fill)" 
            fillOpacity={0.8}
          />
          <defs>
            <linearGradient id="big5-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <radialGradient id="big5-fill" cx="50%" cy="50%" r="70%">
              <stop offset="10%" stopColor="rgba(96,165,250,0.45)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0.1)" />
            </radialGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-white/70">
        {data.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
            <div className="text-white/60">{item.trait}</div>
            <div className="text-cyan-300 font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

