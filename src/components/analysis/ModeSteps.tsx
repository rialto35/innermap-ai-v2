import { MODE_COPY } from "@/lib/analysis/copy";

interface ModeStepsProps {
  mode: "quick" | "deep";
}

const stepIcons = ["🎯", "💭", "📋"];

export default function ModeSteps({ mode }: ModeStepsProps) {
  const copy = MODE_COPY[mode];

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">진행 흐름</h2>
        <p className="text-gray-600">간단한 3단계로 완성됩니다</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copy.steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="text-4xl mb-4">{stepIcons[index]}</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {index + 1}단계
              </h3>
              <p className="text-sm text-gray-600">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
