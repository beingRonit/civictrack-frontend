'use client'

import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import TicketDetail from '@/components/tickets/TicketDetail'
import { useTicket } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: ticket, isLoading } = useTicket(id)

  if (isLoading) return <AppLayout><p>Loading...</p></AppLayout>
  if (!ticket) return <AppLayout><p>Ticket not found</p></AppLayout>

  return (
    <AppLayout>
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/tickets')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tickets
        </Button>
        <TicketDetail ticket={ticket} />
      </div>
    </AppLayout>
  )
}
