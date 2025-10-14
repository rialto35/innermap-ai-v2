interface PairChoiceProps {
  disabled?: boolean;
}

export default function PairChoice({ disabled = true }: PairChoiceProps) {
  return (
    <div className="space-y-4">
      <div className="text-center text-white/60 mb-4">
        페어 선택 기능 (개발 예정)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
          <div className="text-white/40 text-lg mb-2">선택지 A</div>
          <div className="text-white/20 text-sm">내용이 여기에 표시됩니다</div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
          <div className="text-white/40 text-lg mb-2">선택지 B</div>
          <div className="text-white/20 text-sm">내용이 여기에 표시됩니다</div>
        </div>
      </div>
      {disabled && (
        <div className="text-center text-xs text-white/40">
          현재 비활성화 상태
        </div>
      )}
    </div>
  );
}
