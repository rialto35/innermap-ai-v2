/**
 * Tribe Color Mapping
 * 부족별 테마 색상 정의
 */

export const tribeColorMap: Record<string, { gradient: string; border: string; text: string }> = {
  balance: {
    gradient: 'from-sky-500 to-cyan-400',
    border: 'border-sky-500/30',
    text: 'text-sky-300',
  },
  creation: {
    gradient: 'from-orange-400 to-amber-300',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
  },
  harmony: {
    gradient: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
  },
  will: {
    gradient: 'from-red-500 to-rose-400',
    border: 'border-red-500/30',
    text: 'text-red-300',
  },
  insight: {
    gradient: 'from-purple-500 to-violet-400',
    border: 'border-purple-500/30',
    text: 'text-purple-300',
  },
  sensitivity: {
    gradient: 'from-pink-500 to-rose-400',
    border: 'border-pink-500/30',
    text: 'text-pink-300',
  },
  expression: {
    gradient: 'from-yellow-500 to-amber-400',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
  },
  resilience: {
    gradient: 'from-slate-500 to-gray-400',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
  },
  growth: {
    gradient: 'from-lime-500 to-green-400',
    border: 'border-lime-500/30',
    text: 'text-lime-300',
  },
  flame: {
    gradient: 'from-orange-600 to-red-500',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
  },
  default: {
    gradient: 'from-violet-500 to-blue-500',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
  },
};

export function getTribeColors(tribe: string) {
  return tribeColorMap[tribe.toLowerCase()] ?? tribeColorMap.default;
}

