'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUser, clearAuth } from '@/lib/auth'
import { logout as apiLogout } from '@/lib/api'
import { useEffect, useState } from 'react'
import { User } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  async function handleLogout() {
    await apiLogout().catch(() => {})
    clearAuth()
    router.push('/login')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-navy text-white">
      <Link href="/dashboard" className="font-bold text-lg">
        CivicTrack
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hover:text-civic-orange transition-colors">
          Dashboard
        </Link>
        <Link href="/tickets" className="hover:text-civic-orange transition-colors">
          Tickets
        </Link>
        {user?.role === 'admin' && (
          <Link href="/approvals" className="hover:text-civic-orange transition-colors">
            Approvals
          </Link>
        )}
        <Link href="/analytics" className="hover:text-civic-orange transition-colors">
          Analytics
        </Link>

        <div className="flex items-center gap-3 ml-4 border-l border-white/20 pl-4">
          <span className="text-sm">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
