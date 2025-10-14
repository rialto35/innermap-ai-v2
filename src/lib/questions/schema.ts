export type Mode = "quick" | "deep";
export type ItemType = "likert" | "pair" | "sjt";

export interface Item {
  id: string;
  type: ItemType;         // "likert" only for now
  stem: string;           // question text
  section?: string;       // optional tag
  choices?: string[];     // for likert labels
}

export interface Answer {
  itemId: string;
  value: number | string;
  ts: number;             // timestamp(ms)
}

export interface FlowState {
  mode: Mode;
  index: number;          // 0-based current item
  total: number;
  answers: Record<string, Answer>;
  phase: "idle" | "running" | "review" | "done";
}
