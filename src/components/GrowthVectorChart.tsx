'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface GrowthVectorChartProps {
  growth: {
    innate: number
    acquired: number
    conscious: number
    unconscious: number
    growth: number
    stability: number
    harmony: number
    individual: number
  }
}

export default function GrowthVectorChart({ growth }: GrowthVectorChartProps) {
  const data = [
    { name: '선천', value: growth.innate, color: '#3b82f6' },
    { name: '후천', value: growth.acquired, color: '#8b5cf6' },
    { name: '의식', value: growth.conscious, color: '#10b981' },
    { name: '무의식', value: growth.unconscious, color: '#f59e0b' },
    { name: '성장', value: growth.growth, color: '#06b6d4' },
    { name: '안정', value: growth.stability, color: '#6366f1' },
    { name: '조화', value: growth.harmony, color: '#ec4899' },
    { name: '개별', value: growth.individual, color: '#14b8a6' },
  ]

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/50 to-sky-500/50 text-lg">📈</span>
        <div>
          <h3 className="text-lg font-semibold">성장 벡터</h3>
          <p className="text-xs text-white/50">선천·후천·의식 등 주요 성장 축의 현재 위치</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            width={50}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[0, 12, 12, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

