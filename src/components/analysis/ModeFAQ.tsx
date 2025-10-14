"use client";
import { useState } from "react";
import { MODE_COPY } from "@/lib/analysis/copy";

interface ModeFAQProps {
  mode: "quick" | "deep";
}

export default function ModeFAQ({ mode }: ModeFAQProps) {
  const copy = MODE_COPY[mode];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">자주 묻는 질문</h2>
        <p className="text-gray-600">궁금한 점들을 미리 확인해보세요</p>
      </div>
      
      <div className="space-y-4">
        {copy.faqs.map((faq, index) => (
          <div key={index} className="border rounded-2xl overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              onClick={() => handleToggle(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              role="button"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                role="region"
                className="px-6 pb-4 text-gray-600 leading-relaxed"
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
