import axios from 'axios'
import type { Approval } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('civictrack_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('civictrack_token')
      localStorage.removeItem('civictrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──
export const loginApi = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const registerUserApi = (data: { name: string; email: string; password: string; role?: string }) =>
  api.post('/auth/register', data)

export const logoutApi = () => api.post('/auth/logout')

// ── TICKETS ──
export const getTicketsApi = () => api.get('/tickets')
export const getTicketApi = (id: string) => api.get(`/tickets/${id}`)
export const createTicketApi = (data: object) => api.post('/tickets', data)
export const updateTicketStatusApi = (id: string, status: string) =>
  api.patch(`/tickets/${id}/status`, { status })
export const updateTicketPriorityApi = (id: string, priority: string) =>
  api.patch(`/tickets/${id}/priority`, { priority })
export const updateApprovalApi = (id: string, approval: Approval) =>
  api.patch(`/tickets/${id}/approval`, { approval })

export default api