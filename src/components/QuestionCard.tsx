type QuestionScale = '2' | '5' | '7'

interface QuestionCardProps {
  question: {
    id: string
    text: string
    scale: QuestionScale
  }
  onAnswer: (value: number) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const getOptions = (scale: QuestionScale): string[] => {
    switch (scale) {
      case '2':
        return ['아니오', '예']
      case '5':
        return [
          '전혀 그렇지 않다',
          '그렇지 않다',
          '보통이다',
          '그렇다',
          '매우 그렇다'
        ]
      case '7':
        return [
          '전혀 아니다',
          '아니다',
          '약간 아니다',
          '보통이다',
          '약간 그렇다',
          '그렇다',
          '매우 그렇다'
        ]
    }
  }

  const options = getOptions(question.scale)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      {/* 질문 텍스트 */}
      <h2 className="text-2xl text-white mb-8 leading-relaxed">
        {question.text}
      </h2>

      {/* 답변 옵션 */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index + 1)}
            className="w-full px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-left transition-all hover:scale-[1.02] border border-white/5 min-h-[60px] flex items-center group"
          >
            <span className="text-white/50 mr-4 font-medium group-hover:text-white/70 transition">
              {index + 1}
            </span>
            <span className="flex-1">{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

