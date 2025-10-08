export function QuestionCard({ 
  q, 
  onAnswer 
}: {
  q: { id: string; text: string; options: string[] };
  onAnswer: (id: string, value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white">
      <p className="mb-4 text-lg">{q.text}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(q.id, i)}
            className="rounded-xl px-4 py-3 min-h-[44px] bg-white/10 hover:bg-white/20 text-left transition-all hover:scale-105"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

