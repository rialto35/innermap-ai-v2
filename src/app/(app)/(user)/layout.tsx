'use client'

import { ReactNode } from 'react'
import AuthProvider from '@/components/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0a0f1f] to-[#111827] text-slate-100">
        <Header />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  )
}

