'use client'

import { Ticket } from '@/types'
import { StatusBadge, PriorityBadge, ApprovalBadge } from '@/components/shared/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateTicketStatus, updateApproval } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface TicketDetailProps {
  ticket: Ticket
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const user = getUser()
  const isAdmin = user?.role === 'admin'
  const queryClient = useQueryClient()
  const [status, setStatus] = useState(ticket.status)
  const [approval, setApproval] = useState(ticket.approval)

  async function handleStatusUpdate() {
    try {
      await updateTicketStatus(ticket.id, status)
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleApproval(value: string) {
    try {
      await updateApproval(ticket.id, value)
      setApproval(value as typeof approval)
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
      toast.success(`Ticket ${value.toLowerCase()}`)
    } catch {
      toast.error('Failed to update approval')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold font-mono">#{ticket.id}</h1>
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
        <ApprovalBadge approval={ticket.approval} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{ticket.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Complainant:</span>
              <p className="font-medium">{ticket.user?.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{ticket.category}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <p className="font-medium">{ticket.priority}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="default"
                className="bg-civic-green hover:bg-civic-green/90"
                onClick={() => handleApproval('Approved')}
              >
                ✅ Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleApproval('Rejected')}
              >
                ❌ Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-civic-blue">
          <CardContent className="p-4 text-sm text-civic-blue">
            This ticket is being reviewed by administrators. You will be notified of any status changes.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
