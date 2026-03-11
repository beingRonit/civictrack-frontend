'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import TicketTable from '@/components/tickets/TicketTable'
import TicketCard from '@/components/tickets/TicketCard'
import { useTickets } from '@/hooks/useTickets'
import { useSSE } from '@/hooks/useSSE'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ticket } from '@/types'

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
      (t) => t.title.toLowerCase().includes(q) || String(t.id).includes(q)
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
        <h1 className="text-2xl font-bold">All Tickets</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by title or ID..."
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Water">Water</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Road">Road</SelectItem>
              <SelectItem value="Garbage">Garbage</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="InProgress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block">
          <TicketTable tickets={filtered} />
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden grid gap-4">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No tickets found</p>
        )}
      </div>
    </AppLayout>
  )
}