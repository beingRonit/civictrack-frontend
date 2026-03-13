'use client'

import { useEffect, useState } from 'react'

export default function FaviconUpdater() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('civictrack_theme')
    const dark = saved === 'dark'
    setIsDark(dark)

    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (!favicon) return

    favicon.href = dark ? '/favicon-dark.ico' : '/favicon-light.ico'
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark')
      setIsDark(dark)
      
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
      if (!favicon) return

      favicon.href = dark ? '/favicon-dark.ico' : '/favicon-light.ico'
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return null
}
