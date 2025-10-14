interface ProgressBarProps {
  percent: number;
  label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/80">
          {label || "진행률"}
        </span>
        <span className="text-sm text-white/60">
          {percent}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="sr-only">
        진행률 {percent}퍼센트
      </span>
    </div>
  );
}
