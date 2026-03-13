'use client'

import { Ticket } from '@/types'
import { StatusBadge, PriorityBadge, ApprovalBadge } from '@/components/shared/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateTicketStatusApi, updateApprovalApi, updateTicketPriorityApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import Dropdown from '@/components/shared/Dropdown'

interface TicketDetailProps {
  ticket: Ticket
}

const statusOptions = [
  { value: 'OPEN', label: 'Pending', emoji: '\u{23F3}' },
  { value: 'IN_PROGRESS', label: 'In Progress', emoji: '\u{1F504}' },
  { value: 'RESOLVED', label: 'Resolved', emoji: '\u{2705}' },
]

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const user = getUser()
  const isAdmin = user?.role === 'admin'
  const queryClient = useQueryClient()
  const [status, setStatus] = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority)
  const [priorityLoading, setPriorityLoading] = useState(false)
  async function handlePriorityUpdate() {
    setPriorityLoading(true)
    try {
      await updateTicketPriorityApi(ticket.id, priority)
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Priority updated')
    } catch {
      toast.error('Failed to update priority')
    } finally {
      setPriorityLoading(false)
    }
  }

  async function handleStatusUpdate() {
    try {
      await updateTicketStatusApi(ticket.id, status)
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleApproval(value: 'APPROVED' | 'REJECTED') {
    try {
      await updateApprovalApi(ticket.id, value)
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      if (value === 'APPROVED') {
        toast.success('Ticket approved')
      } else {
        toast.error('Ticket rejected')
      }
    } catch {
      toast.error('Failed to update approval')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold font-mono">#{ticket.id}</h1>
        {/* Show badges in Priority, Status, Approve order. If rejected, only show Approve badge */}
        {ticket.approval === 'REJECTED' ? (
          <ApprovalBadge approval={ticket.approval} />
        ) : (
          <>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
            <ApprovalBadge approval={ticket.approval} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{ticket.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>
              <p className="font-medium">{ticket.category}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            {(ticket.location || ticket.latitude) && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium flex items-center gap-2">
                  📍 {ticket.location || `${ticket.latitude}, ${ticket.longitude}`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Step 1: Approval */}
              {ticket.approval === 'AWAITING' ? (
                <div className="space-y-2">
                  <div className="rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/60 dark:border-yellow-800 px-6 py-4 mb-2 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-yellow-900 dark:text-yellow-200 font-semibold text-base">
                      <span role='img' aria-label='hourglass'>⏳</span>
                      This complaint awaits your review
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="bg-civic-green hover:bg-civic-green/90 text-white font-semibold"
                      onClick={() => handleApproval('APPROVED')}
                      disabled={ticket.approval === 'APPROVED'}
                    >
                      {'\u{2705} Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval('REJECTED')}
                      disabled={ticket.approval === 'REJECTED'}
                    >
                      {'\u{274C} Reject'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Approve/Reject Status</p>
                  <div className="flex items-center gap-3">
                    <Button
                      className="bg-civic-green hover:bg-civic-green/90 text-white font-semibold"
                      onClick={() => handleApproval('APPROVED')}
                      disabled={ticket.approval === 'APPROVED'}
                    >
                      {'\u{2705} Approved'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval('REJECTED')}
                      disabled={ticket.approval === 'REJECTED'}
                    >
                      {'\u{274C} Rejected'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Status (only after approval) */}
              {ticket.approval === 'APPROVED' && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Update Status</p>
                    <div className="flex items-center gap-3">
                      <Dropdown
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        className="w-52"
                      />
                      <Button onClick={handleStatusUpdate}>Update Status</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Update Priority</p>
                    <div className="flex items-center gap-3">
                      <Dropdown
                        value={priority}
                        onChange={setPriority}
                        options={[
                          { value: 'LOW', label: 'Low', emoji: '🟢' },
                          { value: 'MEDIUM', label: 'Medium', emoji: '🟡' },
                          { value: 'HIGH', label: 'High', emoji: '🟠' },
                          { value: 'CRITICAL', label: 'Critical', emoji: '🔴' },
                        ]}
                        className="w-52"
                      />
                      <Button onClick={handlePriorityUpdate} disabled={priorityLoading}>
                        {priorityLoading ? 'Updating...' : 'Update Priority'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!isAdmin && (
        <Card className="border-civic-blue">
          <CardContent className="p-4 text-sm text-civic-blue">
            This ticket is being reviewed by administrators. You will be notified of any status changes.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
