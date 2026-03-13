'use client'

import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { useTickets } from '@/hooks/useTickets'
import { useAuth } from '@/hooks/useAuth'
import { useSSE } from '@/hooks/useSSE'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: tickets, isLoading } = useTickets()
  useSSE()

  if (authLoading || isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  const total = tickets?.length || 0
  const pending = tickets?.filter((t) => t.status === 'OPEN').length || 0
  const inProgress = tickets?.filter((t) => t.status === 'IN_PROGRESS').length || 0
  const resolved = tickets?.filter((t) => t.status === 'RESOLVED').length || 0
  const highPriority = tickets?.filter((t) => t.priority === 'HIGH').length || 0

  const isAdmin = user?.role === 'admin'

  const getGreeting = () => {
    const hour = new Date().getHours()
    let greeting = 'Good Morning'
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon'
    else if (hour >= 17) greeting = 'Good Evening'

    const name = isAdmin ? 'Admin' : (user?.name || 'User')
    return `${greeting}, ${name} 👋🏼`
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-3xl font-bold">{getGreeting()}</h1>
          <p className="text-muted-foreground mt-2">
            Live overview of all civic complaints in your city
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
          <StatCard label="Total Tickets" value={total} accentColor="#1E3A5F" emoji={'\u{1F3DB}\u{FE0F}'} />
          <StatCard label="Pending" value={pending} accentColor="#EAB308" emoji={'\u{23F3}'} />
          <StatCard label="In Progress" value={inProgress} accentColor="#2563EB" emoji={'\u{26A1}'} />
          <StatCard label="Resolved" value={resolved} accentColor="#16A34A" emoji={'\u{2705}'} />
          {isAdmin && (
            <StatCard label="High Priority" value={highPriority} accentColor="#EF4444" emoji={'\u{1F6A8}'} />
          )}
        </div>

        {/* Activity Feed */}
        {tickets && <ActivityFeed tickets={tickets} />}
      </div>
    </AppLayout>
  )
}