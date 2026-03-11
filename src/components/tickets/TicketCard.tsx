import { Ticket } from '@/types'
import { StatusBadge, PriorityBadge, ApprovalBadge } from '@/components/shared/Badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">#{ticket.id}</span>
          <PriorityBadge priority={ticket.priority} />
        </div>

        <h3 className="font-semibold">{ticket.title}</h3>
        <p className="text-sm text-muted-foreground">{ticket.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <StatusBadge status={ticket.status} />
            <ApprovalBadge approval={ticket.approval} />
          </div>
          <Link href={`/tickets/${ticket.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
