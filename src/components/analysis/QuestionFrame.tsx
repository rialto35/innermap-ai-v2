interface QuestionFrameProps {
  title: string;
  subtitle?: string;
  meta?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function QuestionFrame({ 
  title, 
  subtitle, 
  meta, 
  children, 
  footer 
}: QuestionFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-white/70 mb-2">
              {subtitle}
            </p>
          )}
          {meta && (
            <p className="text-sm text-white/50">
              {meta}
            </p>
          )}
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-white/10 bg-white/95 dark:bg-neutral-900/90 p-6 mb-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
