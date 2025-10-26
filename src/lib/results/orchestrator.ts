import { supabaseAdmin } from "@/lib/supabase";
import type {
  ResultSummary,
  ResultDetail,
  ResultDashboard,
  ResultCoaching,
} from "@/types/result-bundle";

export type ResultHoroscope = {
  date: string;
  fortune: {
    tone: string;
    score: number; // 1~5
    message: string;
    focus: string;
  };
};

function normalizeKeyword(value: string) {
  return value.replace(/[^가-힣a-zA-Z0-9]/g, "").trim();
}

function pickStrengths(summary: ResultSummary, detail: ResultDetail | null, count = 3) {
  if (detail?.inner9?.axes?.length) {
    const pairs = detail.inner9.axes.map((value, index) => ({
      label: detail.inner9.labels?.[index] ?? `축${index + 1}`,
      value,
    }));
    return pairs
      .sort((a, b) => b.value - a.value)
      .slice(0, count)
      .map((item) => item.label);
  }
  return summary.keywords.slice(0, count).map(normalizeKeyword).filter(Boolean);
}

function pickGrowthAreas(detail: ResultDetail | null, count = 2) {
  if (detail?.inner9?.axes?.length) {
    const pairs = detail.inner9.axes.map((value, index) => ({
      label: detail.inner9.labels?.[index] ?? `축${index + 1}`,
      value,
    }));
    return pairs
      .sort((a, b) => a.value - b.value)
      .slice(0, count)
      .map((item) => item.label);
  }
  return [];
}

export function buildDashboardFromResult(
  resultId: string,
  summary: ResultSummary,
  detail: ResultDetail | null
): ResultDashboard {
  const strengths = pickStrengths(summary, detail, 3);
  const growthAreas = pickGrowthAreas(detail, 2);

  const confidence = typeof summary.confidence === "number" ? summary.confidence : 0.6;
  const level = Math.max(1, Math.min(50, Math.round(confidence * 10)));

  const inner9Values = detail?.inner9?.axes ?? [];
  const avgInner9 = inner9Values.length
    ? inner9Values.reduce((a, b) => a + b, 0) / (inner9Values.length * 100)
    : Object.values(summary.big5).reduce((a, b) => a + b, 0) / (5 * 100);

  const xpMax = 1200;
  const xpCurrent = Math.round(Math.min(1, Math.max(0, avgInner9)) * xpMax);

  const questSeeds = strengths.length ? strengths : summary.keywords.map(normalizeKeyword).filter(Boolean);
  const quests = questSeeds.slice(0, 3).map((label, index) => ({
    id: `${resultId}-quest-${index + 1}`,
    title: `${label} 역량 강화 루틴`,
    difficulty: (index === 0 ? "MED" : index === 1 ? "EASY" : "HARD") as "EASY" | "MED" | "HARD",
  }));

  if (quests.length === 0) {
    quests.push({
      id: `${resultId}-quest-default`,
      title: "매일 10분 자기 성찰",
      difficulty: "EASY" as "EASY" | "MED" | "HARD",
    });
  }

  return {
    level,
    xp: {
      current: xpCurrent,
      max: xpMax,
    },
    strengths,
    growthAreas,
    quests,
  };
}

export async function ensureDashboardCache(
  resultId: string,
  summary: ResultSummary,
  detail: ResultDetail | null
): Promise<ResultDashboard> {
  const dashboard = buildDashboardFromResult(resultId, summary, detail);
  await supabaseAdmin
    .from("result_views")
    .upsert(
      {
        result_id: resultId,
        level: dashboard.level,
        xp_current: dashboard.xp.current,
        xp_max: dashboard.xp.max,
        strengths: dashboard.strengths,
        growth_areas: dashboard.growthAreas,
        quests: dashboard.quests,
      },
      { onConflict: "result_id" }
    );
  return dashboard;
}

export function buildCoachingFromResult(
  summary: ResultSummary,
  detail: ResultDetail | null
): ResultCoaching {
  const primaryStrength = summary.keywords[0] ?? "핵심 강점";
  const tribe = detail?.world?.tribe ?? "노마드";
  const growthArea = pickGrowthAreas(detail, 1)[0] ?? "새로운 영역";
  const confidence = typeof summary.confidence === "number" ? summary.confidence : 0.6;

  const stars = Math.max(1, Math.min(5, Math.round(confidence * 5)));

  return {
    daily: {
      stars,
      oneLiner: `${summary.mbti} 유형의 당신은 ${primaryStrength} 에서 빛납니다. 오늘은 그 강점을 적극 활용해보세요!`,
      actions: [
        `${primaryStrength}을(를) 활용해 15분 집중 시간을 확보하세요.`,
        `${tribe} 부족답게 주변 사람과 협력하거나 피드백을 주고받아 보세요.`,
        `${growthArea}을(를) 의식적으로 챙기며 하루를 마무리하세요.`,
      ],
    },
    weeklyPlan: {
      rituals: [
        `${primaryStrength} 키워드를 중심으로 주간 목표 1개를 설정합니다.`,
        `${tribe} 부족의 특징을 살린 협업 활동을 일지에 기록하세요.`,
      ],
      blockers: [
        `${growthArea} 관련해서 회피하고 있는 일이 있다면 구체적으로 정의해보세요.`,
        `자원이나 시간이 부족하다면 소규모 실험으로 시작해 부담을 줄이세요.`,
      ],
    },
    narrative: {
      work: `${tribe} 부족의 관점에서 일을 바라보면 새로운 아이디어가 떠오릅니다. 작은 시도를 통해 성과를 축적해보세요.`,
      relation: `${primaryStrength}을(를) 기반으로 주변 사람과 관계를 다져보세요. 진심 어린 피드백이 큰 힘이 됩니다.`,
      habit: `${growthArea} 개선을 위해 수면/운동/독서 중 하나를 선택해 10분 투자 루틴을 만들어보세요.`,
    },
  };
}

export async function ensureCoachingCache(
  resultId: string,
  summary: ResultSummary,
  detail: ResultDetail | null
): Promise<ResultCoaching> {
  // TODO: LLM 보조 단계 연결 시 polishing 레이어 추가 (claude-3.5-sonnet 등)
  const coaching = buildCoachingFromResult(summary, detail);
  await supabaseAdmin
    .from("result_coaching")
    .upsert(
      {
        result_id: resultId,
        daily_coaching: coaching.daily,
        weekly_plan: coaching.weeklyPlan,
        narrative: coaching.narrative,
      },
      { onConflict: "result_id" }
    );
  return coaching;
}

export function buildHoroscopeFromResult(
  detail: ResultDetail | null,
  birthdate?: string
): ResultHoroscope {
  const inner9 = detail?.inner9;
  const avg = inner9?.axes?.length
    ? inner9.axes.reduce((a, b) => a + b, 0) / inner9.axes.length
    : 60;
  const score = Math.max(1, Math.min(5, Math.round((avg / 100) * 5)));
  const focus = inner9?.labels?.[0] ?? "자기 성장";

  return {
    date: new Date().toISOString().slice(0, 10),
    fortune: {
      tone: score >= 4 ? "positive" : score <= 2 ? "caution" : "steady",
      score,
      message: `오늘은 ${focus} 영역에서 의미 있는 인사이트가 떠오를 수 있습니다. 작은 기회를 놓치지 마세요!`,
      focus: birthdate ? `${birthdate}의 흐름과도 조화를 이룹니다.` : `${focus}에 집중하면 좋은 흐름을 만들 수 있습니다.`,
    },
  };
}

export async function ensureHoroscopeCache(
  resultId: string,
  detail: ResultDetail | null,
  birthdate?: string
): Promise<ResultHoroscope> {
  const horoscope = buildHoroscopeFromResult(detail, birthdate);
  await supabaseAdmin
    .from("result_horoscope")
    .upsert(
      {
        result_id: resultId,
        date: horoscope.date,
        fortune: horoscope.fortune,
      },
      { onConflict: "result_id" }
    );
  return horoscope;
}
