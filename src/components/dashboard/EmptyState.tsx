/**
 * Empty State - No test results yet
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="text-6xl mb-6">🌱</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        아직 검사를 진행하지 않았어요
      </h2>
      <p className="text-gray-600 mb-8">
        첫 번째 InnerMap 검사를 시작해보세요
      </p>
      <Link
        href="/analyze"
        className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
      >
        검사 시작하기 →
      </Link>
    </motion.div>
  );
}

