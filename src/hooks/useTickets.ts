import { useQuery } from '@tanstack/react-query'
import { getTickets, getTicket } from '@/lib/api'
import { Ticket } from '@/types'

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await getTickets()
      return res.data
    },
  })
}

export function useTicket(id: number) {
  return useQuery<Ticket>({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await getTicket(id)
      return res.data
    },
  })
}