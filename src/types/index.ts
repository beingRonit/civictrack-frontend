export type Role = 'citizen' | 'admin'
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Approval = 'AWAITING' | 'APPROVED' | 'REJECTED'
export type Category = 'WATER' | 'ELECTRICITY' | 'ROAD' | 'GARBAGE'

// These types are aligned with the backend Prisma schema

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface ActivityLog {
  id: string
  message: string
  createdAt: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  status: Status
  // 3-state approval aligned with backend enum
  approval: Approval
  createdAt: string
  location?: string
  latitude?: number
  longitude?: number
  user?: User
  activityLogs?: ActivityLog[]
}

export interface AuthResponse {
  token: string
  user: User
}

export interface CreateTicketInput {
  name: string
  category: Category
  priority: Priority
  description?: string
}