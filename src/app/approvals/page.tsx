'use client'

import AppLayout from '@/components/layout/AppLayout'
import { useTickets } from '@/hooks/useTickets'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/shared/Badge'
import { updateApprovalApi } from '@/lib/api'
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

  // Backend stores 3-state approval: 'AWAITING' | 'APPROVED' | 'REJECTED'
  const awaiting = tickets?.filter((t) => t.approval === 'AWAITING') || []

  async function handleApproval(id: string, value: 'APPROVED' | 'REJECTED') {
    try {
      await updateApprovalApi(id, value)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success(`Ticket ${value === 'APPROVED' ? 'approved' : 'rejected'}`)
    } catch {
      toast.error('Failed to update approval')
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold animate-fade-in-up">Pending Approvals</h1>

        {awaiting.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 min-h-[40vh] animate-fade-in">
            <p className="text-4xl mb-4 animate-bounce">🎉</p>
            <p className="text-xl font-semibold animate-fade-in-up" style={{ animationDelay: '0.1s' }}>All Caught Up!</p>
            <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>No tickets awaiting approval</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {awaiting.map((ticket, index) => (
              <Card 
                key={ticket.id} 
                className="border-l-4 border-l-civic-orange animate-fade-in-up hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">👁 Details</Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-civic-green hover:bg-civic-green/90 text-white hover:scale-105 transition-transform"
                      onClick={() => handleApproval(ticket.id, 'APPROVED')}
                    >
                      ✅ Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:scale-105 transition-transform"
                      onClick={() => handleApproval(ticket.id, 'REJECTED')}
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
