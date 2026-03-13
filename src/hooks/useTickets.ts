import { useQuery } from '@tanstack/react-query'
import { getTicketsApi, getTicketApi } from '@/lib/api'
import { Ticket } from '@/types'

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await getTicketsApi()
      return res.data
    },
  })
}

export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await getTicketApi(id)
      return res.data
    },
    enabled: !!id,
  })
}