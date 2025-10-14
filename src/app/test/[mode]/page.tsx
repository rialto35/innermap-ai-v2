import { notFound } from "next/navigation";
const valid = new Set(["quick","deep"]);

export default function Page({ params }: { params: { mode: string } }) {
  const { mode } = params;
  if (!valid.has(mode)) return notFound();

  const meta = mode === "quick"
    ? { title: "QuickMap (퀵맵)", sub: "예상 3–5분 · Fast Insight" }
    : { title: "DeepMap (딥맵)",  sub: "예상 10–12분 · Full Spectrum Analysis" };

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-xl font-semibold">{meta.title}</h1>
      <p className="text-sm text-gray-500 mt-1">{meta.sub}</p>
      <section className="mt-6 border rounded-2xl p-4">
        <p className="text-sm">문항/채점 모듈은 다음 단계에서 연결합니다.</p>
      </section>
    </main>
  );
}
