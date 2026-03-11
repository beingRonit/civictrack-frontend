'use client'

import AppLayout from '@/components/layout/AppLayout'
import { useTickets } from '@/hooks/useTickets'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/shared/Badge'
import { updateApproval } from '@/lib/api'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ApprovalsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: tickets, isLoading } = useTickets()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  const awaiting = tickets?.filter((t) => t.approval === 'Awaiting') || []

  async function handleApproval(id: number, value: string) {
    try {
      await updateApproval(id, value)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success(`Ticket ${value.toLowerCase()}`)
    } catch {
      toast.error('Failed to update approval')
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>

        {awaiting.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-xl font-semibold">All Caught Up!</p>
            <p className="text-muted-foreground">No tickets awaiting approval</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {awaiting.map((ticket) => (
              <Card key={ticket.id} className="border-l-4 border-l-civic-orange">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.category} · <PriorityBadge priority={ticket.priority} />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">👁 Details</Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-civic-green hover:bg-civic-green/90"
                      onClick={() => handleApproval(ticket.id, 'Approved')}
                    >
                      ✅ Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleApproval(ticket.id, 'Rejected')}
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
