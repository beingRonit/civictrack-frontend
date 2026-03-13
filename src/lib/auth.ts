import { User } from '@/types'

export function saveAuth(token: string, user: User) {
  localStorage.setItem('civictrack_token', token)
  localStorage.setItem('civictrack_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('civictrack_token')
  localStorage.removeItem('civictrack_user')
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('civictrack_token')
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('civictrack_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  return getUser()?.role === 'admin'
}

export function isLoggedIn(): boolean {
  return !!getToken()
}