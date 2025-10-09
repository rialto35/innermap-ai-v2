'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ProgressBar'
import QuestionCard from '@/components/QuestionCard'

// Mock 질문 데이터
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    text: '새로운 사람들을 만나는 것이 즐겁다.',
    scale: '5' as const
  },
  {
    id: 'q2',
    text: '계획을 세우기보다 즉흥적으로 행동하는 편이다.',
    scale: '5' as const
  },
  {
    id: 'q3',
    text: '논리적 분석을 중시한다.',
    scale: '5' as const
  },
  {
    id: 'q4',
    text: '완벽을 추구하는 편이다.',
    scale: '7' as const
  },
  {
    id: 'q5',
    text: '다른 사람을 돕는 것이 행복하다.',
    scale: '7' as const
  },
]

type Step = 'start' | 'basic' | 'questions' | 'loading'

export default function TestPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('start')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  function formatBirthInput(value: string) {
    const raw = value.replace(/\D/g, "")
    if (raw.length <= 4) return raw
    if (raw.length <= 6) return raw.replace(/(\d{4})(\d{1,2})/, "$1-$2")
    return raw.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
  }

  // Step: Start
  if (step === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12">
            <h1 className="text-4xl font-bold text-white mb-6">
              영웅 분석 검사
            </h1>
            <p className="text-white/80 text-lg mb-8">
              당신의 내면을 탐험할 준비가 되셨나요?<br/>
              간단한 질문으로 당신만의 영웅 유형을 발견하세요
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-white/70">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>소요 시간: 약 5분</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/70">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>문항 수: {MOCK_QUESTIONS.length}개</span>
              </div>
            </div>

            <button
              onClick={() => setStep('basic')}
              className="btn-primary w-full md:w-auto"
            >
              시작하기 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step: Basic Info
  if (step === 'basic') {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ProgressBar step={1} total={MOCK_QUESTIONS.length + 2} />

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              기본 정보
            </h2>

            <div className="space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-white mb-2">
                  이름 (선택)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 생년월일 */}
              <div>
                <label className="block text-white mb-2">
                  생년월일 (필수) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={birthDate}
                  onChange={e => setBirthDate(formatBirthInput(e.target.value))}
                  placeholder="YYYY-MM-DD"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={10}
                  required
                />
              </div>

              {/* 안내 문구 */}
              <p className="text-white/60 text-sm">
                💡 생년월일은 분석의 정확도를 높이는 데 사용됩니다
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep('start')}
                className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
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

  // Step: Questions
  if (step === 'questions') {
    const question = MOCK_QUESTIONS[currentQuestion]

    const handleAnswer = (value: number) => {
      const newAnswers = { ...answers, [question.id]: value }
      setAnswers(newAnswers)

      // 다음 질문으로
      if (currentQuestion < MOCK_QUESTIONS.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
        }, 300)
      } else {
        // 마지막 질문 완료
        setTimeout(() => {
          setStep('loading')
          // 3초 후 결과 페이지로
          setTimeout(() => {
            router.push('/result')
          }, 3000)
        }, 300)
      }
    }

    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ProgressBar 
            step={currentQuestion + 3} 
            total={MOCK_QUESTIONS.length + 2} 
          />

          <QuestionCard 
            question={question}
            onAnswer={handleAnswer}
          />

          {/* 이전 버튼 */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-6 text-white/60 hover:text-white text-sm transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전 질문
            </button>
          )}
        </div>
      </div>
    )
  }

  // Step: Loading
  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* 로딩 애니메이션 */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
          </div>

          {/* 텍스트 */}
          <h2 className="text-2xl font-bold text-white mb-3">
            당신의 영웅을 찾고 있습니다...
          </h2>
          <p className="text-white/60">
            AI가 당신의 답변을 분석하고 있어요
          </p>
        </div>
      </div>
    )
  }

  return null
}
