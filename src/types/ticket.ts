export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  approval: boolean
  createdAt: string
  updatedAt: string
  userId: string
  activities: Activity[]
}

export interface Activity {
  id: string
  message: string
  createdAt: string
  ticketId: string
}
