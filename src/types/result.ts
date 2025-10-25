export interface ResultV2 {
  id: string;
  userId: string;
  meta: {
    version: string;
    engineVersion: string;
    weightsVersion: string;
    createdAt: string;
  };
  scores: {
    big5: Record<string, number>;
    mbti: string;
    reti: number;
    inner9: Array<{ label: string; value: number }>;
  };
  summary: {
    highlight: string;
    bullets: string[];
  };
  deep?: {
    modules: string[];
    narrative?: string;
    resources?: string[];
  };
  profile?: {
    name?: string;
    birth?: string;
    email?: string;
  };
}

// Mapping from ReportV1 to ResultV2 (lightweight helper)
import type { ReportV1 } from '@/types/report';

export function reportV1ToResultV2(report: ReportV1): ResultV2 {
  return {
    id: report.id,
    userId: report.ownerId,
    meta: {
      version: report.meta.version,
      engineVersion: report.meta.engineVersion,
      weightsVersion: report.meta.weightsVersion,
      createdAt: report.meta.generatedAt,
    },
    scores: {
      big5: report.scores.big5,
      mbti: report.scores.mbti,
      reti: report.scores.reti,
      inner9: report.scores.inner9,
    },
    summary: report.summary,
    deep: report.deep
      ? {
          modules: Object.keys(report.deep.modules),
          narrative: report.deep.narrative,
          resources: report.deep.resources ? Object.values(report.deep.resources).flatMap(v => (typeof v === 'string' ? [v] : Object.values(v as any))) : [],
        }
      : undefined,
  };
}


