import Link from "next/link";
import { MODE_COPY } from "@/lib/analysis/copy";

interface ModeHeroProps {
  mode: "quick" | "deep";
}

export default function ModeHero({ mode }: ModeHeroProps) {
  const copy = MODE_COPY[mode];
  const startRoute = `/test/${mode}/start`;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {copy.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-2">
          {copy.subtitle}
        </p>
        
        {/* Meta */}
        <p className="text-sm text-gray-500 mb-8">
          {copy.meta}
        </p>
        
        {/* CTA Button */}
        <Link
          href={startRoute}
          className="inline-flex items-center bg-black text-white rounded-xl h-11 px-6 font-medium hover:bg-gray-800 transition-colors"
        >
          바로 시작
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        
        {/* Small Caption */}
        <p className="text-xs text-gray-400 mt-4">
          무료 · 개인정보 보호 · 즉시 결과 확인
        </p>
      </div>
    </section>
  );
}
