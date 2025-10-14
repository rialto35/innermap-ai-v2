"use client";
import { motion } from "framer-motion";
import ModeHero from "./ModeHero";
import ModeFacts from "./ModeFacts";
import ModeSteps from "./ModeSteps";
import ModeFAQ from "./ModeFAQ";
import { MODE_COPY } from "@/lib/analysis/copy";

interface ModePageProps {
  mode: "quick" | "deep";
}

export default function ModePage({ mode }: ModePageProps) {
  const copy = MODE_COPY[mode];
  const otherMode = mode === "quick" ? "deep" : "quick";
  const otherRoute = mode === "quick" ? "/test/deep" : "/test/quick";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/test" className="hover:text-gray-700">검사하기</a>
          <span>›</span>
          <a href="/test" className="hover:text-gray-700">분석 모드 선택</a>
          <span>›</span>
          <span className="text-gray-900">{copy.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModeHero mode={mode} />
      </motion.div>

      {/* Facts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ModeFacts mode={mode} />
      </motion.div>

      {/* Steps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ModeSteps mode={mode} />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <ModeFAQ mode={mode} />
      </motion.div>

      {/* Mode Compare Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="sticky bottom-4 md:static"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 pb-8">
          <div className="bg-gray-50 border rounded-full px-6 py-3 flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600">모드 비교:</span>
            <a
              href={otherRoute}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {MODE_COPY[otherMode].title} 보기 →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
