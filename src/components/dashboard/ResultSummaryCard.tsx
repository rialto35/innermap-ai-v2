/**
 * Result Summary Card
 * 
 * Displays latest test result summary
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ResultSnapshot } from '@innermap/engine';

interface ResultSummaryCardProps {
  result: ResultSnapshot;
}

export default function ResultSummaryCard({ result }: ResultSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/results/${result.id}`}>
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-6">
            {/* Hero Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
              {result.hero.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {result.hero.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {result.tribe.type}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {result.stone.type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  MBTI: {result.mbti.type}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <svg 
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Stats Preview */}
          <div className="mt-6 grid grid-cols-5 gap-4">
            {Object.entries(result.big5).map(([trait, score]) => (
              <div key={trait} className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{score}</div>
                <div className="text-xs text-gray-500 capitalize">{trait.slice(0, 1)}</div>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

