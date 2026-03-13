'use client'

import { useState } from 'react'
import { isAdmin } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { createTicketApi } from '@/lib/api'
import { toast } from 'sonner'
import AppLayout from '@/components/layout/AppLayout'

const categories = [
  { value: 'WATER', label: 'Water', emoji: '\u{1F4A7}', color: '#2563EB' },
  { value: 'ELECTRICITY', label: 'Electricity', emoji: '\u{26A1}', color: '#EAB308' },
  { value: 'ROAD', label: 'Road', emoji: '\u{1F6E3}\u{FE0F}', color: '#6B7280' },
  { value: 'GARBAGE', label: 'Garbage', emoji: '\u{1F5D1}\u{FE0F}', color: '#16A34A' },
]

const priorities = [
  { value: 'LOW', label: 'Low', color: '#16A34A' },
  { value: 'MEDIUM', label: 'Medium', color: '#EAB308' },
  { value: 'HIGH', label: 'High', color: '#F97316' },
  { value: 'CRITICAL', label: 'Critical', color: '#EF4444' },
]

export default function RegisterComplaintPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { toast.error('Please fill in the Complaint Title before submitting'); return }
    if (!location.trim()) { toast.error('Please fill in the Location before submitting'); return }
    if (!category) { toast.error('Please select a Category before submitting'); return }
    if (isAdmin() && !priority) { toast.error('Please select a Priority before submitting'); return }
    setLoading(true)
    try {
      await createTicketApi({
        title, description, category, priority,
        ...(location && { location }),
      })
      toast.success('Complaint registered successfully!')
      router.push('/tickets')
    } catch {
      toast.error('Failed to register complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-navy dark:text-[#93C5FD] flex items-center gap-2">
            {'\u{1F4DD}'} Register Complaint
          </h1>
          <p className="text-[#6B7280] dark:text-[#94A3B8] text-sm mt-1">
            Submit a new civic issue in detail
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-[#1E293B] rounded-[14px] border border-[#E5E7EB] dark:border-[#334155] p-6 shadow-sm space-y-6 animate-scale-in">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-[#F1F5F9] mb-1.5">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Brief title for your complaint"
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#162032] text-[#111827] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-civic-orange text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-[#F1F5F9] mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#162032] text-[#111827] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-civic-orange text-sm resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-[#F1F5F9] mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Kolkata, West Bengal"
                className="w-full px-4 py-2.5 rounded-[10px] border border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#162032] text-[#111827] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-civic-orange text-sm"
              />
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-[#F1F5F9] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center gap-1.5 py-4 rounded-[12px] border-2 transition-all text-sm font-semibold ${
                      category === cat.value
                        ? 'border-civic-orange bg-[#FFF7ED] dark:bg-[#F97316]/10 shadow-md scale-[1.04]'
                        : 'border-[#E5E7EB] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#162032] hover:border-[#D1D5DB] dark:hover:border-[#475569]'
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-navy dark:text-[#F1F5F9]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selection (Admin Only) */}
            {isAdmin() && (
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-[#F1F5F9] mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3 flex-wrap stagger-children">
                  {priorities.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`px-5 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                        priority === p.value
                          ? 'text-white shadow-md scale-[1.06]'
                          : 'bg-white dark:bg-[#162032] text-[#374151] dark:text-[#D1D5DB] hover:opacity-80'
                      }`}
                      style={
                        priority === p.value
                          ? { borderColor: p.color, backgroundColor: p.color }
                          : { borderColor: p.color + '55' }
                      }
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[10px] bg-civic-orange hover:bg-[#EA680C] text-white font-bold text-base transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Submitting...' : '\u{1F680} Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
