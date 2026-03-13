'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import Navbar from './Navbar'
import ThemeToggle from '../shared/ThemeToggle'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) router.push('/login')
  }, [router])

  return (
    <>
      <ThemeToggle />
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-5 py-9 pb-14 animate-fade-in">
        {children}
      </main>
    </>
  )
}
