'use client';

import ActionBar from '@/components/ActionBar'

export default function ReportPage() {
  // Mock 데이터
  const report = {
    hero: '가능성의 탐험가',
    continent: '터콰이즈 대륙',
    emoji: '🏔️',
    sections: {
      summary: '당신은 혁신과 가능성을 추구하는 영웅입니다. 새로운 아이디어와 도전을 두려워하지 않으며, 끊임없이 성장하고자 하는 열망이 있습니다.',
      continentDesc: '터콰이즈 대륙은 창의성과 혁신의 땅입니다. 이곳의 영웅들은 끊임없이 새로운 가능성을 탐험하며, 변화를 두려워하지 않습니다.',
      identity: '당신은 논리와 직관의 균형을 맞추는 사람입니다. 분석적 사고와 창의적 발상을 동시에 활용하여 문제를 해결합니다.',
      strengths: [
        { title: '연결의 마법사', emoji: '⚡', desc: '서로 다른 아이디어를 연결하여 혁신을 만들어냅니다' },
        { title: '빠른 학습자', emoji: '📚', desc: '새로운 지식을 빠르게 습득하고 적용합니다' },
        { title: '유연한 사고', emoji: '🌊', desc: '상황에 맞춰 유연하게 대처합니다' }
      ],
      shadows: '완벽주의 성향이 때로는 시작을 방해할 수 있습니다. 완성보다는 시작에 집중하세요.',
      quests: [
        '이번 달에 작은 프로젝트 1개를 시작해서 끝까지 완성하기',
        '매일 10분씩 명상이나 독서로 집중력 기르기',
        '새로운 사람과 대화하며 네트워크 확장하기'
      ]
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* [0] 영웅 공개 */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{report.emoji}</div>
            <h1 className="text-4xl font-bold text-white mb-2">{report.hero}</h1>
            <p className="text-purple-400">{report.continent}</p>
          </div>
        </section>

        {/* [1] 대륙의 기운 */}
        <section className="rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-400/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🌍</span>
            대륙의 기운
          </h2>
          <p className="text-white/90 leading-relaxed text-lg">
            {report.sections.continentDesc}
          </p>
        </section>

        {/* [2] 영웅의 정체성 */}
        <section className="rounded-2xl bg-purple-500/10 backdrop-blur-md border border-purple-400/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✨</span>
            영웅의 정체성
          </h2>
          <p className="text-white/90 leading-relaxed text-lg">
            {report.sections.identity}
          </p>
        </section>

        {/* [3] 강점 */}
        <section className="rounded-2xl bg-green-500/10 backdrop-blur-md border border-green-400/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💪</span>
            당신의 강점
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {report.sections.strengths.map((strength, idx) => (
              <div 
                key={idx}
                className="rounded-xl bg-white/10 p-6 hover:scale-105 transition"
              >
                <div className="text-4xl mb-3">{strength.emoji}</div>
                <h3 className="text-white font-bold mb-2">{strength.title}</h3>
                <p className="text-white/70 text-sm">{strength.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [4] 그림자 영역 */}
        <section className="rounded-2xl bg-orange-500/10 backdrop-blur-md border border-orange-400/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span>
            그림자 영역
          </h2>
          <p className="text-white/90 leading-relaxed text-lg">
            {report.sections.shadows}
          </p>
        </section>

        {/* [5] 성장 퀘스트 */}
        <section className="rounded-2xl bg-yellow-500/10 backdrop-blur-md border border-yellow-400/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🎯</span>
            이번 달 성장 퀘스트
          </h2>
          <ul className="space-y-4">
            {report.sections.quests.map((quest, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-lg">{idx + 1}.</span>
                <span className="text-white/90 text-lg">{quest}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* [6] 영웅의 선언 */}
        <section className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            영웅의 선언
          </h2>
          <p className="text-2xl text-white/90 italic leading-relaxed">
            &ldquo;나는 가능성의 탐험가로서, 끊임없이 배우고 성장하며, 세상에 긍정적인 변화를 만들어갑니다.&rdquo;
          </p>
        </section>
      </div>

      <ActionBar />
    </div>
  )
}

