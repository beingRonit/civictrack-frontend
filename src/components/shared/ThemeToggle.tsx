'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('civictrack_theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('civictrack_theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      title="Toggle Dark / Light Mode"
      className="fixed top-3.5 right-4 z-[500] flex items-center justify-center w-[38px] h-[38px] rounded-[10px] text-lg bg-white/15 border border-white/25 backdrop-blur-sm text-white shadow-md hover:bg-white/[0.28] hover:scale-110 transition-all dark:bg-[#0F172A]/70 dark:border-white/15"
    >
      {dark ? String.fromCodePoint(0x2600, 0xFE0F) : String.fromCodePoint(0x1F319)}
    </button>
  )
}
