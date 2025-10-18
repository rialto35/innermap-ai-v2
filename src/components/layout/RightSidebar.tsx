import { ReactNode } from 'react'

interface RightSidebarProps {
  children: ReactNode
}

export default function RightSidebar({ children }: RightSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      {children}
    </aside>
  )
}

