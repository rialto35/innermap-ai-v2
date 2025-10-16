/**
 * /analyze - Unified Analyze Flow
 * 
 * PR #4.5: Complete rewrite with:
 * - Unified single-loop questionnaire
 * - Auto-save (local + server)
 * - Real-time preview
 * - Progress tracking
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyzeStore } from '@/lib/analyze/state';
import { loadQuestions, transformAnswers, validateCompleteness } from '@/lib/analyze/transform';
import { AutoSaveManager, loadFromLocal } from '@/lib/analyze/autosave';
import UnifiedQuestion from '@/components/analyze/UnifiedQuestion';
import UnifiedProgress from '@/components/analyze/UnifiedProgress';
import LivePreview from '@/components/analyze/LivePreview';

export default function AnalyzePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const {
    index,
    answers,
    setAnswer,
    next,
    prev,
    setDraftId,
    markSaved,
    complete,
    reset,
    getProgress,
    getAnsweredCount,
    isComplete: checkComplete,
    getEstimatedTimeLeft
  } = useAnalyzeStore();
  
  const [questions] = useState(() => loadQuestions());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveManager] = useState(() => 
    new AutoSaveManager(
      (draftId) => {
        setDraftId(draftId);
        markSaved();
      },
      (error) => console.error('Auto-save error:', error)
    )
  );
  
  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedAnswers = loadFromLocal();
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      const confirmed = confirm('이전에 진행하던 검사가 있습니다. 이어서 진행하시겠습니까?');
      if (confirmed) {
        // Restore answers
        Object.entries(savedAnswers).forEach(([id, value]) => {
          setAnswer(id, value);
        });
      } else {
        reset();
      }
    }
  }, []);
  
  // Auto-save on answer change
  useEffect(() => {
    const answeredCount = getAnsweredCount();
    if (answeredCount > 0) {
      autoSaveManager.save(answers, answeredCount);
    }
  }, [answers]);
  
  const currentQuestion = questions[index];
  const answeredCount = getAnsweredCount();
  const progress = getProgress();
  const estimatedTimeLeft = getEstimatedTimeLeft();
  
  // Handle answer change
  const handleAnswer = (value: number) => {
    setAnswer(currentQuestion.id, value);
  };
  
  // Handle next
  const handleNext = () => {
    if (index < questions.length - 1) {
      next();
    } else {
      // Last question - check completion
      if (checkComplete()) {
        handleSubmit();
      }
    }
  };
  
  // Handle submit
  const handleSubmit = async () => {
    const validation = validateCompleteness(answers);
    
    if (!validation.isValid) {
      alert(`모든 문항에 답변해주세요. (누락: ${validation.missing.length}개)`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Transform answers
      const transformed = transformAnswers(answers);
      
      // Submit to API
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: transformed.answers,
          testType: 'full'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      
      const result = await response.json();
      
      // Mark complete and clear draft
      complete();
      
      // Redirect to result
      router.push(`/results/${result.resultId}`);
      
    } catch (error) {
      console.error('Submit error:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === 'loading' || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress */}
        <UnifiedProgress
          currentIndex={index}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          estimatedTimeLeft={estimatedTimeLeft}
        />
        
        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <UnifiedQuestion
                key={currentQuestion.id}
                questionId={currentQuestion.id}
                text={currentQuestion.text}
                value={answers[currentQuestion.id]}
                scale={currentQuestion.scale}
                onChange={handleAnswer}
                onNext={handleNext}
                onPrev={prev}
              />
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prev}
                disabled={index === 0}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← 이전
              </button>
              
              <button
                onClick={handleNext}
                disabled={
                  index === questions.length - 1 
                    ? !checkComplete()  // 마지막 문항: 모든 문항 답변 체크
                    : !answers[currentQuestion.id]  // 중간 문항: 현재 문항만 체크
                }
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {index === questions.length - 1 ? (
                  isSubmitting ? '제출 중...' : `제출하기 → (${answeredCount}/${questions.length})`
                ) : (
                  '다음 →'
                )}
              </button>
            </div>
          </div>
          
          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <LivePreview
                answers={answers}
                answeredCount={answeredCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
