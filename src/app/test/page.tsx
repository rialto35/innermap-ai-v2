'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions } from '@/lib/questions'
import { ProgressBar } from '@/components/ProgressBar'
import QuestionCard from '@/components/QuestionCard'
import { score, mbtiFromScores, retiTop2, big5Scaled, type Answers } from '@/lib/scoring'
import { matchHero } from '@/lib/data/heroes144'
import { getTribeFromBirthDate } from '@/lib/innermapLogic'
import { recommendStone } from '@/lib/data/tribesAndStones'

type Step = 'start' | 'basic' | 'questions' | 'loading'

export default function TestPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('start')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [genderPreference, setGenderPreference] = useState<'male' | 'female'>('male')

  const totalSteps = questions.length + 2

  const handleBirthInput = useCallback((value: string) => {
    const raw = value.replace(/\D/g, '')
    if (raw.length <= 4) return raw
    if (raw.length <= 6) return raw.replace(/(\d{4})(\d{1,2})/, '$1-$2')
    return raw.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  }, [])

  const handleAnswer = (value: number | 'A' | 'B') => {
    const question = questions[currentQuestion]
    setAnswers(prev => ({ ...prev, [question.id]: value }))

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 200)
    } else {
      setTimeout(() => {
        setStep('loading')
        finalizeResult({ name, birthDate, answers: { ...answers, [question.id]: value }, genderPreference })
          .then(() => router.push('/result'))
      }, 300)
    }
  }

  const finalizeResult = async ({
    name,
    birthDate,
    answers,
    genderPreference,
  }: {
    name: string
    birthDate: string
    answers: Answers
    genderPreference: 'male' | 'female'
  }) => {
    const scores = score(questions, answers)
    const mbti = mbtiFromScores(scores)
    const reti = retiTop2(scores)
    const big5 = big5Scaled(scores)
    const hero = matchHero(mbti.type, reti.top1?.[0] ?? '')
    const tribe = birthDate ? getTribeFromBirthDate(birthDate) : null
    const stone = recommendStone(big5)

    const payload = {
      name,
      birthDate,
      answers,
      genderPreference,
      scores,
      mbti,
      reti,
      big5,
      hero,
      tribe,
      stone,
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('result', JSON.stringify(payload))
    }
  }

  if (step === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12">
            <h1 className="text-4xl font-bold text-white mb-6">InnerMap 영웅분석 검사</h1>
            <p className="text-white/70 leading-relaxed">
              35개의 문항을 통해 MBTI, RETI, Big5, 성장 벡터를 종합 분석하여<br />
              당신의 영웅 타입과 12 부족·결정석 인사이트를 안내합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/60 mt-6">
              <Stat label="문항 수" value="슬라이더 30 + 강요선택 5" />
              <Stat label="소요 시간" value="약 7-8분" />
              <Stat label="결과 구성" value="MBTI·RETI·Big5·부족·결정석·영웅" />
            </div>

            <button onClick={() => setStep('basic')} className="btn-primary mt-10 px-8 py-3">
              시작하기 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'basic') {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ProgressBar step={1} total={totalSteps} />

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 space-y-8">
            <h2 className="text-3xl font-bold text-white">기본 정보</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white/70 mb-2">이름 (선택)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-2">
                  생년월일 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={birthDate}
                  onChange={e => setBirthDate(handleBirthInput(e.target.value))}
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-white/50 mt-2">생년월일은 12 부족 매핑에 사용되며 저장되지 않습니다.</p>
              </div>

              <div>
                <label className="block text-white/70 mb-2">영웅 이미지 성별</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGenderPreference(option)}
                      className={[
                        'flex-1 px-4 py-3 rounded-xl border transition',
                        genderPreference === option
                          ? 'border-sky-400 bg-sky-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10',
                      ].join(' ')}
                    >
                      {option === 'male' ? '남성' : '여성'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep('start')} className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15">
                ← 이전
              </button>
              <button
                onClick={() => {
                  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
                    alert('생년월일을 YYYY-MM-DD 형식으로 입력해주세요')
                    return
                  }
                  setStep('questions')
                }}
                className="btn-primary flex-1"
              >
                다음 →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'questions') {
    const question = questions[currentQuestion]

    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <ProgressBar step={currentQuestion + 2} total={totalSteps} />
          <QuestionCard question={question} onAnswer={handleAnswer} value={answers[question.id]} />
          <div className="text-right text-sm text-white/60">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto border-4 border-white/10 border-t-sky-400 rounded-full animate-spin" />
          <h2 className="text-2xl font-semibold text-white">결과를 생성하는 중입니다...</h2>
          <p className="text-white/60 text-sm">AI가 답변을 분석하고 영웅 인사이트를 준비하고 있습니다.</p>
        </div>
      </div>
    )
  }

  return null
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-4">
      <div className="text-xs uppercase tracking-[0.25em] text-white/50 mb-1">{label}</div>
      <div className="text-sm text-white/80">{value}</div>
    </div>
  )
}

