'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import TicketTable from '@/components/tickets/TicketTable'
import TicketCard from '@/components/tickets/TicketCard'
import { useTickets } from '@/hooks/useTickets'
import { useSSE } from '@/hooks/useSSE'
import { Input } from '@/components/ui/input'
import Dropdown from '@/components/shared/Dropdown'
import { Ticket } from '@/types'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'WATER', label: 'Water', emoji: '\u{1F4A7}' },
  { value: 'ELECTRICITY', label: 'Electricity', emoji: '\u{26A1}' },
  { value: 'ROAD', label: 'Road', emoji: '\u{1F6E3}\u{FE0F}' },
  { value: 'GARBAGE', label: 'Garbage', emoji: '\u{1F5D1}\u{FE0F}' },
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'OPEN', label: 'Pending', emoji: '\u{23F3}' },
  { value: 'IN_PROGRESS', label: 'In Progress', emoji: '\u{1F504}' },
  { value: 'RESOLVED', label: 'Resolved', emoji: '\u{2705}' },
]

export default function TicketsPage() {
  const { data: tickets, isLoading } = useTickets()
  useSSE()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  if (isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  let filtered = tickets || []
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) => (t.title?.toLowerCase() || '').includes(q) || String(t.id).includes(q)
    )
  }
  if (categoryFilter !== 'all') {
    filtered = filtered.filter((t) => t.category === categoryFilter)
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter((t) => t.status === statusFilter)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold animate-fade-in-up">All Tickets</h1>

        {/* Filters removed as requested. Keep only Sort by Priority if present. */}

        {/* Desktop: Table */}
        <div className="hidden md:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <TicketTable tickets={filtered} />
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden grid gap-4">
          {filtered.map((ticket, index) => (
            <div key={ticket.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8 animate-fade-in">No tickets found</p>
        )}
      </div>
    </AppLayout>
  )
}