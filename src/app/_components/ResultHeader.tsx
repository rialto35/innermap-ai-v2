"use client";

type EngineMeta = {
  name: "im-core" | "inner9" | "forecast" | string;
  version: string;
  extra?: string;       // w(MBTI/RETI/Big5)=0.35/0.30/0.35 등
};

export default function ResultHeader({
  title,
  intro,
  engines
}: {
  title: string;
  intro: React.ReactNode;
  engines: EngineMeta[];
}) {
  return (
    <section className="mb-8 rounded-2xl bg-gradient-to-b from-[#14122a] to-[#0f0d1e] p-6 border border-white/10">
      <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
      <p className="text-base leading-relaxed text-white/80 mb-4">{intro}</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {engines.map((e, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 border border-white/20"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-violet-400" />
            <span className="font-medium text-white">{e.name}</span>
            <span className="text-white/60">v{e.version}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
