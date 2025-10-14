import { Item, Mode } from "./schema";

export function makeMockItems(mode: Mode): Item[] {
  const likertChoices = [
    "전혀 아니다",
    "거의 아니다", 
    "약간 아니다",
    "보통이다",
    "약간 그렇다",
    "대체로 그렇다",
    "매우 그렇다"
  ];

  const mockStems = [
    "새로운 아이디어를 즉시 시도한다.",
    "하던 일을 끝까지 마무리한다.",
    "다른 사람들과 협력하는 것을 선호한다.",
    "혼자서 조용히 생각하는 시간이 필요하다.",
    "변화와 새로운 도전을 즐긴다."
  ];

  return mockStems.map((stem, index) => ({
    id: `${mode}-likert-${index + 1}`,
    type: "likert" as const,
    stem,
    section: "personality",
    choices: likertChoices
  }));
}

export function getTotalHint(mode: Mode): number {
  return mode === "quick" ? 24 : 36;
}
