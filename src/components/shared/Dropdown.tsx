'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownOption {
  value: string
  label: string
  emoji?: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  className?: string
}

export default function Dropdown({ value, onChange, options, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-10 w-full appearance-none rounded-xl border border-input bg-card pl-4 pr-9 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer flex items-center gap-2 text-left"
      >
        {selected?.emoji && <span>{selected.emoji}</span>}
        <span className="truncate">{selected?.label ?? 'Select...'}</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] transition-transform duration-200" style={{ transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
          {'\u{25BC}'}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-input bg-card shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer text-left
                ${opt.value === value
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground hover:bg-muted/60'
                }`}
            >
              {opt.emoji && <span className="text-base">{opt.emoji}</span>}
              <span>{opt.label}</span>
              {opt.value === value && <span className="ml-auto text-primary text-xs">{'\u{2713}'}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
