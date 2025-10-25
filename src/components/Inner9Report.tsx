"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Big5 = { O:number; C:number; E:number; A:number; N:number };
type Inner9 = { key:string; score:number }[]; // 예: [{key:"창조",score:88}, ...]
type Result = {
  big5: Big5;
  mbti?: string | null;
  reti?: string | null;
  inner9: Inner9;
  analysis?: string | null;
};

function top3(inner9: Inner9) {
  return [...inner9].sort((a,b)=>b.score-a.score).slice(0,3);
}
function avg(inner9: Inner9) {
  if (!inner9?.length) return 0;
  return Math.round(inner9.reduce((s,x)=>s+x.score,0)/inner9.length);
}

// 간단한 인사이트 생성기 (MBTI/RETI/Big5 모두 반영 — 규칙 기반 v1)
export function generateInsight(r: Result) {
  const lines: string[] = [];
  const t3 = top3(r.inner9).map(x=>x.key).join(", ");
  lines.push(`당신을 두드러지게 만드는 Inner9 상위 축: ${t3}.`);

  if (r.mbti) lines.push(`MBTI: ${r.mbti} 성향을 반영해, 강점은 자연스러운 의사결정 패턴에서 나타납니다.`);
  if (r.reti) lines.push(`RETI(동기): ${r.reti} 가중치에 따라 몰입 조건이 달라집니다.`);

  // Big5 기반 코멘트(예시 규칙)
  const { O, C, E, A, N } = r.big5;
  if (O>=70) lines.push("높은 개방성: 새로운 아이디어, 추상적 주제, 실험을 즐깁니다.");
  if (C<45) lines.push("낮은 성실성: 루틴과 마감 보강이 필요합니다. 짧은 스프린트 계획이 효과적입니다.");
  if (E>=60) lines.push("외향성 우세: 협업/발표/리드에서 에너지가 납니다.");
  if (A<40) lines.push("수용성 낮음: 비판적 시각이 강점이나, 협업시 명확한 규칙/에티켓을 세우세요.");
  if (N>=60) lines.push("정서 불안성: 컨디션 관리(수면/호흡/운동)와 리듬이 성과의 핵심입니다.");

  return lines.join(" ");
}

export default function Inner9Report({ result }: { result: Result }) {
  const t3 = top3(result.inner9);
  const mean = avg(result.inner9);
  const insight = generateInsight(result);

  return (
    <div className="space-y-6">
      {/* 1) 핵심 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>핵심 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>상위 3축: <b>{t3.map(x=>`${x.key}(${x.score})`).join(", ")}</b></p>
          <p>전체 평균 점수: <b>{mean}</b></p>
          <p>MBTI: <b>{result.mbti || "—"}</b> / RETI: <b>{result.reti || "—"}</b></p>
        </CardContent>
      </Card>

      {/* 2) 세부 표 */}
      <Card>
        <CardHeader><CardTitle>세부 차원 점수</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {result.inner9.map((d)=>(
              <div key={d.key} className="rounded-xl border p-3">
                <div className="text-sm opacity-70">{d.key}</div>
                <div className="text-2xl font-semibold">{d.score}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3) 성장 인사이트 */}
      <Card>
        <CardHeader><CardTitle>성장 인사이트</CardTitle></CardHeader>
        <CardContent>
          <p className="leading-7">{insight}</p>
        </CardContent>
      </Card>
    </div>
  );
}

