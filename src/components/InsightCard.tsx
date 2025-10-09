import Link from 'next/link'

interface InsightCardProps {
  title: string
  description: string
  icon: string
  href: string
  variant: 'primary' | 'secondary' | 'disabled'
}

export default function InsightCard({
  title,
  description,
  icon,
  href,
  variant
}: InsightCardProps) {
  const baseClasses = "rounded-2xl p-8 text-center transition-all duration-300"
  
  const variantClasses = {
    primary: "bg-blue-500/20 border-2 border-blue-400 hover:scale-105 hover:shadow-2xl cursor-pointer",
    secondary: "bg-green-500/20 border-2 border-green-400 hover:scale-105 hover:shadow-xl cursor-pointer",
    disabled: "bg-gray-400/20 border-2 border-gray-400 opacity-50 cursor-not-allowed"
  }

  const buttonClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    disabled: "btn-disabled"
  }

  const content = (
    <>
      {/* 아이콘 */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* 제목 */}
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

      {/* 설명 */}
      <p className="text-white/80 mb-6 leading-relaxed">{description}</p>

      {/* 버튼 */}
      <div className={buttonClasses[variant]}>
        {variant === 'disabled' ? 'Coming Soon' : '시작하기 →'}
      </div>
    </>
  )

  if (variant === 'disabled') {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]}`}>
        {content}
      </div>
    )
  }

  return (
    <Link 
      href={href}
      className={`block ${baseClasses} ${variantClasses[variant]}`}
    >
      {content}
    </Link>
  )
}
