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
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
      <h3 className="text-lg font-semibold text-white mb-4">성장 벡터</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            width={50}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#27272a', 
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

