import HeroGrowthCard from "@/components/HeroGrowthCard"

export default function DashboardPage() {
  const hero = {
    name: "비전의 불꽃",
    subtitle: "감정의 에너지로 세상을 움직이는 영혼의 점화자",
    image: "/images/hero-constellation.svg",
    level: 12,
    exp: { current: 340, next: 500 },
    mbti: "ENFP",
    reti: { code: "R7", score: 1.8 },
    gem: { name: "아우레아", icon: "", keywords: ["균형", "평형", "통합"], summary: "조화로운 중심을 만드는 결정." },
    growth: { innate: 62, acquired: 74, harmony: 68, individual: 55 },
    strengths: ["영감 전파", "공감 리더십", "창의적 시도"],
    weaknesses: ["지속성 저하", "우선순위 분산", "감정 과몰입"],
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><HeroGrowthCard hero={hero} /></div>
      <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 text-white/70">사이드 위젯 (최근 리포트, 추천 루틴 등)</div>
    </div>
  )
}
