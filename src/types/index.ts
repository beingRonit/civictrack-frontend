export type Role = 'citizen' | 'admin'
export type Status = 'Pending' | 'InProgress' | 'Resolved'
export type Priority = 'Low' | 'Medium' | 'High'
export type Approval = 'Awaiting' | 'Approved' | 'Rejected'
export type Category = 'Water' | 'Electricity' | 'Road' | 'Garbage'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Ticket {
  id: number
  title: string
  description: string
  category: Category
  priority: Priority
  status: Status
  approval: Approval
  createdAt: string
  user: User
}

export interface AuthResponse {
  token: string
  user: User
}
