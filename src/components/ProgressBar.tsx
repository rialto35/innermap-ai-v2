export function ProgressBar({ 
  step, 
  total 
}: { 
  step: number
  total: number 
}) {
  const percentage = Math.round((step / total) * 100)
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-white/80 mb-2">
        <span>Step {step}/{total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500"
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  )
}

