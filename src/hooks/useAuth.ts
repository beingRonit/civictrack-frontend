'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { getUser, clearAuth } from '@/lib/auth'
import { logout as apiLogout } from '@/lib/api'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = getUser()
    if (!u) {
      router.push('/login')
      return
    }
    setUser(u)
    setLoading(false)
  }, [router])

  async function logout() {
    await apiLogout().catch(() => {})
    clearAuth()
    router.push('/login')
  }

  return { user, loading, logout }
}
