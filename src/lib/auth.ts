import { User } from '@/types'

const USER_KEY = 'civictrack_user'

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getUser()
}
