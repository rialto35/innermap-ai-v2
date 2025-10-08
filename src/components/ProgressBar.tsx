export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white/80 mb-1">
        <span>Step {step}/{total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div 
          className="h-full bg-indigo-400 transition-all duration-300" 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

