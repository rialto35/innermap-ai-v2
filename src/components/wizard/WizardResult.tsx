import innermapTribes from '@/data/innermapTribes.json'
import { WizardResultState } from '@/app/wizard/page'

interface WizardResultProps {
  state: WizardResultState
}

export default function WizardResult({ state }: WizardResultProps) {
  if (state.status === 'idle') {
    return (
      <section className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-300/70">
        생년월일을 입력하면 결과가 이곳에 표시됩니다.
      </section>
    )
  }

  const tribe = innermapTribes.tribes.find(t => t.id === state.tribeId)

  if (!tribe) {
    return (
      <section className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-6 py-8">
        <p className="text-sm text-rose-200">결과를 불러오는 데 실패했습니다.</p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-slate-300/70">
        <span>입력 생년월일 · {state.birthDate}</span>
        <span>사주 12지지 · {tribe.branchKor}({tribe.branch})</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-bold text-white">{tribe.nameKor}</h2>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{tribe.nameEng}</p>
          <p className="mt-4 text-base text-slate-200/80">{tribe.essence.philosophy}</p>

          <div className="mt-6 space-y-3 text-sm text-slate-200/70">
            <p>
              <span className="font-semibold text-slate-200">핵심 가치 · </span>
              {tribe.essence.coreValue}
            </p>
            <p>
              <span className="font-semibold text-slate-200">아키타입 · </span>
              {tribe.essence.archetype}
            </p>
            {tribe.essence.opposition && (
              <p>
                <span className="font-semibold text-slate-200">대립 부족 · </span>
                {tribe.essence.opposition}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200/70">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border"
              style={{ borderColor: `${tribe.symbol.color.hex}80`, backgroundColor: `${tribe.symbol.color.hex}20` }}
            >
              <span className="text-center text-[11px] font-semibold text-slate-100 leading-tight">
                {tribe.symbol.icon}
              </span>
            </div>
            <div>
              <div className="font-semibold text-white/90">{tribe.symbol.iconEng}</div>
              <div>{tribe.symbol.color.name} · {tribe.symbol.color.hex}</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">성향 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {tribe.personality.keywords.slice(0, 5).map(keyword => (
                <span key={keyword} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">성장 제안</h3>
            <ul className="list-disc space-y-1 pl-5 text-xs">
              {tribe.personality.growth.slice(0, 3).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 text-sm md:grid-cols-2">
        <button className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white transition hover:border-white/30 hover:bg-white/15">
          부족 상세 보기
        </button>
        <button className="rounded-2xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-white transition hover:border-sky-400/60 hover:bg-sky-500/20">
          추천 결정석 알아보기
        </button>
      </div>
    </section>
  )
}
