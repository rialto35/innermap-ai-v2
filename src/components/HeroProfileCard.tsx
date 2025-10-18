/**
 * HeroProfileCard - Complete hero profile display
 * Shows hero info, color stones, Inner9 chart, and daily luck
 */

'use client';

import { useEffect, useState } from 'react';
import InnerCompass9, { toChartData } from './charts/InnerCompass9';

interface HeroProfileCardProps {
  hero: {
    id: number;
    code: string;
    title: string;
    color?: number;
    score?: number;
  };
  color: {
    natal: {
      id: number;
      name: string;
      color: string;
      score?: number;
    };
    growth: {
      id: number;
      name: string;
      color: string;
      score?: number;
    };
  };
  inner9: Record<string, number>;
  narrative?: {
    summary: string;
  };
  engineVersion: string;
  modelVersion: string;
  dob?: string;
}

export default function HeroProfileCard({
  hero,
  color,
  inner9,
  narrative,
  engineVersion,
  modelVersion,
  dob,
}: HeroProfileCardProps) {
  const [luck, setLuck] = useState<any>(null);

  useEffect(() => {
    if (dob) {
      fetch(`/api/luck?dob=${dob}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) setLuck(data.data);
        })
        .catch(console.error);
    }
  }, [dob]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-200">
              영웅 분석
            </div>
            <h2 className="text-2xl font-bold text-white">{hero.title}</h2>
            <p className="mt-1 text-sm text-white/60 font-mono">{hero.code}</p>
            {hero.score && (
              <div className="mt-2 text-sm text-white/70">
                매칭 점수: <span className="font-semibold text-violet-300">{Math.round(hero.score)}/100</span>
              </div>
            )}
          </div>

          {/* Color Stones */}
          <div className="flex gap-2">
            <div className="group relative">
              <div
                className="h-12 w-12 rounded-full border-2 border-white/20 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.natal.color }}
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                선천석: {color.natal.name}
              </div>
            </div>
            <div className="group relative">
              <div
                className="h-12 w-12 rounded-full border-2 border-white/20 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.growth.color }}
              />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                성장석: {color.growth.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inner9 Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <span>🧭</span>
          <span>Inner Compass (Inner9)</span>
        </h3>
        <InnerCompass9 data={toChartData(inner9)} color={color.growth.color} />
      </div>

      {/* Narrative */}
      {narrative && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
            <span>📖</span>
            <span>당신의 이야기</span>
          </h3>
          <p className="text-white/80 leading-relaxed">{narrative.summary}</p>
        </div>
      )}

      {/* Daily Luck */}
      {luck && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6">
          <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
            <span>🌟</span>
            <span>오늘의 운세</span>
          </h3>
          <div className="mb-3 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full border-2 ${
                  i < luck.score
                    ? 'border-amber-400 bg-amber-400/20'
                    : 'border-white/10 bg-white/5'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-white/70">{luck.score}/5</span>
          </div>
          <p className="text-white/80 text-sm">{luck.message}</p>
          <p className="mt-2 text-xs text-white/50">{luck.date}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/50 mb-1">엔진 버전</div>
            <div className="font-mono text-violet-300">{engineVersion}</div>
          </div>
          <div>
            <div className="text-white/50 mb-1">모델 버전</div>
            <div className="font-mono text-violet-300">{modelVersion}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

