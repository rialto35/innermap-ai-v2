'use client'

import { ReactNode } from 'react'
import SWUnregisterOnce from '../_client-sw-unregister'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <SWUnregisterOnce />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
        {children}
      </div>
    </>
  )
}

