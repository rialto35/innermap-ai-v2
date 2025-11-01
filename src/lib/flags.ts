/**
 * Feature Flags Utility (Phase 0)
 * - Read-only flags from env; admin-only exposure via /api/flags
 */

export type FeatureFlags = {
  engineV2: boolean;
  mbtiDirect: boolean;
  retiDirect: boolean;
  inner9Nonlinear: boolean;
  confidenceBadge: boolean;
  verboseLog: boolean;
  fusionV1: boolean;
  miniAdaptive: boolean;
  inner9Calib: boolean;
  phase1Conditional: boolean;
};

const asBool = (v: string | undefined, def = false) => {
  if (typeof v !== 'string') return def;
  const s = v.toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
};

export function getFlags(): FeatureFlags {
  return {
    engineV2: asBool(process.env.IM_ENGINE_V2_ENABLED, false),
    mbtiDirect: asBool(process.env.IM_MBTI_DIRECT_ENABLED, false),
    retiDirect: asBool(process.env.IM_RETI_DIRECT_ENABLED, false),
    inner9Nonlinear: asBool(process.env.IM_INNER9_NONLINEAR_ENABLED, false),
    confidenceBadge: asBool(process.env.IM_CONFIDENCE_BADGE_ENABLED, false),
    verboseLog: asBool(process.env.IM_ANALYSIS_VERBOSE_LOG, false),
    fusionV1: asBool(process.env.IM_FUSION_V1_ENABLED, false),
    miniAdaptive: asBool(process.env.IM_MINI_ADAPTIVE_ENABLED, false),
    inner9Calib: asBool(process.env.IM_INNER9_CALIB_ENABLED, false),
    phase1Conditional: asBool(process.env.IM_PHASE1_CONDITIONAL_ENABLED, false),
  };
}

export function isFlagEnabled<K extends keyof FeatureFlags>(key: K): boolean {
  const f = getFlags();
  return !!f[key];
}

export const flags = {
  payments_v2_guard: process.env.NEXT_PUBLIC_PAYMENTS_V2_GUARD === '1',
}

