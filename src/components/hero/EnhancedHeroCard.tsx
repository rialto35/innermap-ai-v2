/**
 * EnhancedHeroCard Component
 * 영웅 카드 with 부족/결정석 시각화 + 오늘의 운세
 */

'use client';

import { useEffect, useState } from 'react';
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
  birthDate?: string; // YYYY-MM-DD for daily luck
  mbti?: string; // MBTI type
  reti?: string | number; // RETI type
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
  birthDate,
  mbti,
  reti,
}: EnhancedHeroCardProps) {
  const [luck, setLuck] = useState<any>(null);
  const [loadingLuck, setLoadingLuck] = useState(false);
  
  const expPct = hero?.exp ? Math.min(100, Math.round((hero.exp.current / hero.exp.next) * 100)) : 0;
  const tribeColors = getTribeColors(tribeKey || tribe?.nameEn || 'default');

  // Generate heroCode if not provided
  const computedHeroCode =
    heroCode ||
    `${hero?.mbti || 'ENFP'}-TYPE${hero?.reti?.code?.replace('R', '') || hero?.reti || '1'}-${genderPreference[0].toUpperCase()}`;

  // Debug logging
  useEffect(() => {
    console.log('EnhancedHeroCard props:', {
      tribeKey,
      stoneKey,
      heroCode: computedHeroCode,
      'tribe?.nameEn': tribe?.nameEn,
      'gem?.nameEn': gem?.nameEn
    });
  }, [tribeKey, stoneKey, computedHeroCode, tribe, gem]);

  // Fetch daily luck
  useEffect(() => {
    if (birthDate) {
      setLoadingLuck(true);
      fetch(`/api/luck?dob=${birthDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) setLuck(data.data);
        })
        .catch(console.error)
        .finally(() => setLoadingLuck(false));
    }
  }, [birthDate]);

  return (
    <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-xl">
      {/* Main Layout: Hero Info + Daily Luck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Hero Profile (2 columns) */}
        <div className="lg:col-span-2">
          <div className="flex flex-col items-center gap-6">
            {/* Hero Image & Name */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <HeroImage heroCode={computedHeroCode} width={200} height={200} priority />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{hero?.name || 'Unknown Hero'}</h2>
              <p className="text-white/60 text-sm mb-4">{hero?.subtitle || hero?.tagline || 'Hero Description'}</p>
              
              {/* Tags below image */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${tribeColors.gradient} text-white`}
                >
                  Lv.{hero?.level || 1}
                </span>
                <span className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-sm">
                  MBTI {mbti || hero?.mbti || 'N/A'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-600/40 text-sm">
                  RETI {reti ? `R${reti}` : (hero?.reti?.code || (hero?.reti ? `R${hero?.reti}` : 'N/A'))}
                </span>
              </div>
            </div>

            {/* Tribe & Stone Badges - Horizontal Layout */}
            <div className="flex items-center justify-center gap-6 w-full">
              {tribe && (
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 min-w-[140px]">
                  <TribeBadge tribe={tribeKey || tribe.nameEn?.toLowerCase()} size={64} showLabel={false} />
                  <div className="text-center">
                    <div className="text-xs text-white/50 mb-1">부족</div>
                    <div className="text-sm font-semibold text-white">{tribe.name || tribe.nameEn}</div>
                  </div>
                </div>
              )}
              {gem && (
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 min-w-[140px]">
                  <StoneBadge stone={stoneKey || gem.nameEn?.toLowerCase()} size={64} variant="natal" showLabel={false} />
                  <div className="text-center">
                    <div className="text-xs text-white/50 mb-1">결정석</div>
                    <div className="text-sm font-semibold text-white">{gem.name || gem.nameEn}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Daily Luck (1 column) */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-5 h-full">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span>🌟</span>
              <span>오늘의 운세</span>
            </h3>
            
            {loadingLuck ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
              </div>
            ) : luck ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        i < luck.score
                          ? 'border-amber-400 bg-amber-400/30 scale-110'
                          : 'border-white/10 bg-white/5'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-2xl font-bold text-amber-300 mb-2">{luck.score}/5</div>
                <p className="text-white/80 text-sm leading-relaxed">{luck.message}</p>
                <p className="mt-3 text-xs text-white/50">{luck.date}</p>
              </>
            ) : (
              <div className="text-white/60 text-sm">
                생년월일을 입력하면 오늘의 운세를 확인할 수 있습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>다음 레벨까지</span>
          <span>
            {hero?.exp?.current || 0} / {hero?.exp?.next || 100} ({expPct}%)
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
              {growth?.[g.k] || hero?.growth?.[g.k] || 0}
              <span className="text-xs text-white/50">%</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${tribeColors.gradient} transition-all duration-500`}
                style={{ width: `${growth?.[g.k] || hero?.growth?.[g.k] || 0}%` }}
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
            {(strengths || hero?.strengths || []).map((s: string, i: number) => (
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
            {(weaknesses || hero?.weaknesses || []).map((s: string, i: number) => (
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
