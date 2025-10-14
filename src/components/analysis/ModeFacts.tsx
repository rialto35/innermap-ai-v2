import { MODE_COPY } from "@/lib/analysis/copy";

interface ModeFactsProps {
  mode: "quick" | "deep";
}

const factIcons = {
  quick: ["📝", "⏱️", "📊", "🎯"],
  deep: ["📝", "⏱️", "📊", "🎯"]
};

export default function ModeFacts({ mode }: ModeFactsProps) {
  const copy = MODE_COPY[mode];
  const icons = factIcons[mode];

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copy.facts.map((fact, index) => (
          <div
            key={index}
            className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-6 text-center"
          >
            <div className="text-3xl mb-3">{icons[index]}</div>
            <p className="text-sm text-gray-700 leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
      
      {/* Trust indicator */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <span>신뢰도 표기 예정</span>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
