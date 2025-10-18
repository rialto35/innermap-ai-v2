'use client'

import { ReactNode } from 'react'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
      {children}
    </div>
  )
}

