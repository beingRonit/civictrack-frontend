'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getUser, clearAuth } from '@/lib/auth'
import { logoutApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import { User } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setUser(getUser())
  }, [])

  async function handleLogout() {
    await logoutApi().catch(() => {})
    clearAuth()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', emoji: String.fromCodePoint(0x1F4CA), show: true },
    { href: '/register-complaint', label: 'Register', emoji: String.fromCodePoint(0x1F4DD), show: user?.role !== 'admin' },
    { href: '/tickets', label: 'All Tickets', emoji: String.fromCodePoint(0x1F4CB), show: true },
    { href: '/analytics', label: 'Analytics', emoji: String.fromCodePoint(0x1F4C8), show: true },
    { href: '/approvals', label: 'Approvals', emoji: String.fromCodePoint(0x2705), show: user?.role === 'admin' },
  ]

  const avatarLetter = user?.name?.[0]?.toUpperCase() || 'U'
  const avatarColor = user?.role === 'admin' ? '#F97316' : '#2563EB'

  return (
    <nav className="bg-navy sticky top-0 z-100 shadow-[0_2px_16px_rgba(0,0,0,0.22)]">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-[62px]">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] bg-civic-orange rounded-[10px] flex items-center justify-center text-xl">
            {String.fromCodePoint(0x1F3DB, 0xFE0F)}
          </div>
          <div>
            <div className="text-white font-extrabold text-lg tracking-tight leading-tight">CivicTrack</div>
            <div className="text-[#93C5FD] text-[10px] font-medium">Your complaints. Tracked. Resolved.</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-1">
          {navLinks.filter(l => l.show).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive(link.href)
                  ? 'bg-civic-orange text-white'
                  : 'text-[#CBD5E1] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {link.emoji} {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5 pr-[52px]">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <div
              className="w-7 h-7 rounded-[7px] flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: avatarColor }}
            >
              {avatarLetter}
            </div>
            <div className="hidden sm:block">
              <div className="text-white text-[13px] font-semibold">{user?.name}</div>
              <div className="text-[#93C5FD] text-[10px]">
                {user?.role === 'admin' ? 'Municipal Admin' : 'Civilian User'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 border border-white/20 text-white rounded-[7px] px-3 py-1.5 text-[13px] font-semibold transition-all hover:bg-red-500/35"
          >
            Sign Out
          </button>
          {/* Hamburger */}
          <button
            className="md:hidden bg-transparent border-none text-white p-1.5 text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '\u2715' : '\u2630'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-dark px-4 py-2.5 pb-4.5">
          {navLinks.filter(l => l.show).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-1.5 w-full px-4 py-2 mb-1 rounded-lg text-[15px] font-semibold transition-all ${
                isActive(link.href)
                  ? 'bg-civic-orange text-white'
                  : 'text-[#CBD5E1] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {link.emoji} {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <button
            onClick={() => { setMobileOpen(false); handleLogout() }}
            className="flex items-center gap-1.5 w-full px-4 py-2 rounded-lg text-[15px] font-semibold text-[#FCA5A5]"
          >
            {String.fromCodePoint(0x1F6AA)} Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
