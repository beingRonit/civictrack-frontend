'use client'

import { Ticket } from '@/types'
import { StatusBadge, PriorityBadge, ApprovalBadge } from '@/components/shared/Badge'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Search, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import Dropdown from '@/components/shared/Dropdown'

interface TicketTableProps {
  tickets: Ticket[]
  isAdmin?: boolean
}

const CATEGORY_ICONS: Record<string, string> = {
  WATER: '💧',
  ELECTRICITY: '⚡',
  ROAD: '🛣️',
  GARBAGE: '🗑️',
}

const PRIORITY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

export default function TicketTable({ tickets, isAdmin = false }: TicketTableProps) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortByPriority, setSortByPriority] = useState(false)

  let filtered = tickets.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      String(t.id).includes(q) ||
      (t.title || '').toLowerCase().includes(q)
    const matchCat = filterCategory === 'All' || t.category === filterCategory
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    return matchSearch && matchCat && matchStatus
  })

  if (sortByPriority) {
    filtered = [...filtered].sort(
      (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
    )
  }

  return (
    <div>
      {/* Controls Bar */}
      <div className="bg-white dark:bg-[#181F2A] rounded-xl shadow-sm px-4 py-3 mb-5 flex flex-wrap gap-3 items-center border border-gray-100 dark:border-[#232B3B]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Title..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 dark:border-[#3d4a5c] rounded-xl outline-none focus:border-[#1E3A5F] dark:focus:border-[#60A5FA] bg-white dark:bg-[#232B3B] dark:text-gray-100 transition-all font-medium shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Category Filter */}
        <Dropdown
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'WATER', label: 'Water', emoji: '💧' },
            { value: 'ELECTRICITY', label: 'Electricity', emoji: '⚡' },
            { value: 'ROAD', label: 'Road', emoji: '🛣️' },
            { value: 'GARBAGE', label: 'Garbage', emoji: '🗑️' },
          ]}
          className="w-44"
        />

        {/* Status Filter */}
        <Dropdown
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'OPEN', label: 'Pending', emoji: '⏳' },
            { value: 'IN_PROGRESS', label: 'In Progress', emoji: '🔄' },
            { value: 'RESOLVED', label: 'Resolved', emoji: '✅' },
          ]}
          className="w-44"
        />

        {/* Sort Toggle */}
        <button
          onClick={() => setSortByPriority((prev) => !prev)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all shadow-sm ${
            sortByPriority
              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] dark:bg-[#60A5FA] dark:text-[#181F2A] dark:border-[#60A5FA]'
              : 'bg-white text-gray-700 border-gray-200 hover:border-[#1E3A5F] hover:text-[#1E3A5F] dark:bg-[#232B3B] dark:text-gray-200 dark:border-[#3d4a5c] dark:hover:border-[#60A5FA] dark:hover:text-[#60A5FA]'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort by Priority
        </button>
      </div>

      {/* Ticket Count */}
      <p className="text-sm text-gray-500 mb-3">
        {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#181F2A] rounded-xl shadow-sm border border-gray-100 dark:border-[#232B3B]">
          <div className="text-5xl mb-3">🏙️</div>
          <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">No Complaints Found</div>
          <div className="text-gray-400 dark:text-gray-500 text-sm mt-1">Adjust filters or search</div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181F2A] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-[#232B3B]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC] dark:bg-[#232B3B] border-b-2 border-gray-200 dark:border-[#232B3B]">
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Title</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Category</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Priority</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Status</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Approval</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Time</TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-b border-gray-50 dark:border-[#232B3B] hover:bg-[#F8FAFC] dark:hover:bg-[#232B3B]/80 transition-colors"
                >


                  {/* Title */}
                  <TableCell className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {ticket.title || `Ticket #${ticket.id}`}
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
                    {CATEGORY_ICONS[ticket.category] && (
                      <span className="mr-1">{CATEGORY_ICONS[ticket.category]}</span>
                    )}
                    {ticket.category.charAt(0) + ticket.category.slice(1).toLowerCase()}
                  </TableCell>

                  {/* Priority */}
                  <TableCell className="py-3 px-4">
                    <PriorityBadge priority={ticket.priority} />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 px-4">
                    <StatusBadge status={ticket.status} />
                  </TableCell>

                  {/* Approval */}
                  <TableCell className="py-3 px-4">
                    <ApprovalBadge approval={ticket.approval} />
                  </TableCell>

                  {/* Time */}
                  <TableCell className="py-3 px-4 text-[13px] text-gray-400 dark:text-gray-500">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-200 text-gray-600 hover:border-[#1E3A5F] hover:text-[#1E3A5F]"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Link href={`/tickets/${ticket.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-blue-600/5 border border-blue-600/20 text-blue-600 hover:bg-blue-600/10"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}