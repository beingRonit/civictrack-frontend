import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const register = (data: object) =>
  api.post('/auth/register', data)

export const getMe = () => api.get('/auth/me')

export const logout = () => api.post('/auth/logout')

// Tickets
export const getTickets = () => api.get('/tickets')
export const getTicket = (id: number) => api.get(`/tickets/${id}`)
export const createTicket = (data: object) => api.post('/tickets', data)
export const updateTicketStatus = (id: number, status: string) =>
  api.patch(`/tickets/${id}/status`, { status })
export const updateApproval = (id: number, approval: string) =>
  api.patch(`/tickets/${id}/approval`, { approval })

export default api