'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useSSE() {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const es = new EventSource(`${baseUrl}/sse`, { withCredentials: true })

    es.addEventListener('ticket-updated', (e) => {
      const data = JSON.parse(e.data)

      // Invalidate ticket queries so lists refresh
      queryClient.invalidateQueries({ queryKey: ['tickets'] })

      // Surgical update for the individual ticket cache
      if (data.id) {
        queryClient.setQueryData(['ticket', data.id], (old: Record<string, unknown> | undefined) => {
          if (!old) return old
          return { ...old, ...data }
        })
      }
    })

    es.onerror = () => {
      es.close()
    }

    return () => es.close()
  }, [queryClient])
}
