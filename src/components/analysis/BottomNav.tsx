interface BottomNavProps {
  canPrev: boolean;
  canNext: boolean;
  canSubmit: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function BottomNav({
  canPrev,
  canNext,
  canSubmit,
  onPrev,
  onNext,
  onSubmit
}: BottomNavProps) {
  return (
    <div className="flex justify-between items-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={`
          rounded-xl h-11 px-6 font-medium transition
          ${canPrev 
            ? "bg-white/10 text-white hover:bg-white/20" 
            : "bg-white/5 text-white/30 cursor-not-allowed"
          }
        `}
      >
        이전
      </button>

      <div className="flex gap-3">
        {canSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl h-11 px-6 bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            제출하기
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className={`
              rounded-xl h-11 px-6 font-semibold transition
              ${canNext 
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }
            `}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
