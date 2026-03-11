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
import { Eye } from 'lucide-react'

interface TicketTableProps {
  tickets: Ticket[]
}

export default function TicketTable({ tickets }: TicketTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Approval</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="font-mono">#{ticket.id}</TableCell>
            <TableCell className="font-medium">{ticket.title}</TableCell>
            <TableCell>{ticket.category}</TableCell>
            <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
            <TableCell><StatusBadge status={ticket.status} /></TableCell>
            <TableCell><ApprovalBadge approval={ticket.approval} /></TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Link href={`/tickets/${ticket.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
