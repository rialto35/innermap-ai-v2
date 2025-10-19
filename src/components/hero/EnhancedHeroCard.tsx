/**
 * EnhancedHeroCard Component
 * 영웅 카드 with 부족/결정석 시각화
 */

'use client';

import Link from 'next/link';
import HeroImage from '@/components/assets/HeroImage';
import { TribeBadge } from '@/components/assets/TribeBadge';
import { StoneBadge } from '@/components/assets/StoneBadge';
import { getTribeColors } from '@/lib/constants/tribeColors';

interface EnhancedHeroCardProps {
  hero: any;
  gem?: any;
  tribe?: any;
  growth?: any;
  strengths?: string[];
  weaknesses?: string[];
  genderPreference?: 'male' | 'female';
  testResultId?: string;
  heroCode?: string; // ENFJ-TYPE1-M format
  tribeKey?: string; // balance, creation, etc.
  stoneKey?: string; // arche, kairos, etc.
}

export default function EnhancedHeroCard({
  hero,
  gem,
  tribe,
  growth,
  strengths,
  weaknesses,
  genderPreference = 'male',
  testResultId,
  heroCode,
  tribeKey,
  stoneKey,
}: EnhancedHeroCardProps) {
  const expPct = Math.min(100, Math.round((hero.exp.current / hero.exp.next) * 100));
  const tribeColors = getTribeColors(tribeKey || tribe?.nameEn || 'default');

  // Generate heroCode if not provided
  const computedHeroCode =
    heroCode ||
    `${hero.mbti}-TYPE${hero.reti?.code?.replace('R', '') || '1'}-${genderPreference[0].toUpperCase()}`;

  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-xl">
      {/* Hero Profile Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Hero Image */}
        <div className="relative">
          <HeroImage heroCode={computedHeroCode} width={180} height={180} priority />
        </div>

        {/* Hero Info & Badges */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">{hero.name}</h2>
          <p className="text-white/60 text-sm mb-4">{hero.subtitle || hero.tagline}</p>

          {/* Tribe & Stone Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
            {tribeKey && (
              <div className="flex flex-col items-center gap-1">
                <TribeBadge tribe={tribeKey} size={72} />
                <span className="text-xs text-white/50">부족</span>
              </div>
            )}
            {stoneKey && (
              <div className="flex flex-col items-center gap-1">
                <StoneBadge stone={stoneKey} size={72} variant="natal" />
                <span className="text-xs text-white/50">결정석</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${tribeColors.gradient} text-white`}
            >
              Lv.{hero.level}
            </span>
            <span className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-sm">
              MBTI {hero.mbti}
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-600/40 text-sm">
              RETI {hero.reti?.code || `R${hero.reti}`}
            </span>
            {gem && (
              <span className="px-3 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-600/40 text-sm">
                {gem.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>다음 레벨까지</span>
          <span>
            {hero.exp.current} / {hero.exp.next} ({expPct}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${tribeColors.gradient} transition-all duration-500`}
            style={{ width: `${expPct}%` }}
          />
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { k: 'innate', label: '선천', icon: '🌱' },
          { k: 'acquired', label: '후천', icon: '📚' },
          { k: 'harmony', label: '조화', icon: '☯️' },
          { k: 'individual', label: '개별', icon: '⭐' },
        ].map((g) => (
          <div
            key={g.k}
            className="rounded-xl border border-zinc-800 bg-white/5 p-3 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs text-zinc-400">{g.label}</span>
            </div>
            <div className="text-lg font-bold text-white">
              {growth?.[g.k] || hero.growth?.[g.k] || 0}
              <span className="text-xs text-white/50">%</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${tribeColors.gradient} transition-all duration-500`}
                style={{ width: `${growth?.[g.k] || hero.growth?.[g.k] || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-emerald-700/30 bg-emerald-500/5 p-4">
          <h4 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>강점</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(strengths || hero.strengths || []).map((s: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg border border-emerald-600/40 text-emerald-200 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-700/30 bg-amber-500/5 p-4">
          <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>성장 영역</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(weaknesses || hero.weaknesses || []).map((s: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg border border-amber-600/40 text-amber-200 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {testResultId && (
          <Link
            href={`/results/${testResultId}`}
            className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-medium rounded-xl hover:scale-105 transition text-center"
          >
            상세 결과 보기
          </Link>
        )}
        <Link
          href="/analyze"
          className="flex-1 min-w-[200px] px-4 py-3 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 font-medium rounded-xl transition text-center"
        >
          새로운 분석 시작
        </Link>
      </div>
    </div>
  );
}

