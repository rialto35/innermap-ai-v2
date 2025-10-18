import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6 xl:px-8">
      {children}
    </div>
  )
}

