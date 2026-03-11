'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Navbar from './Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login')
  }, [router])

  return (
    <>
      <Navbar />
      <main className="p-6">{children}</main>
    </>
  )
}
