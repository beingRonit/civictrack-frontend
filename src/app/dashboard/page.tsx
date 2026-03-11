'use client'

import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { useTickets } from '@/hooks/useTickets'
import { useAuth } from '@/hooks/useAuth'
import { useSSE } from '@/hooks/useSSE'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: tickets, isLoading } = useTickets()
  useSSE()

  if (authLoading || isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  const total = tickets?.length || 0
  const pending = tickets?.filter((t) => t.status === 'Pending').length || 0
  const inProgress = tickets?.filter((t) => t.status === 'InProgress').length || 0
  const resolved = tickets?.filter((t) => t.status === 'Resolved').length || 0
  const highPriority = tickets?.filter((t) => t.priority === 'High').length || 0

  const isAdmin = user?.role === 'admin'

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Overview of all complaints' : 'Your complaint overview'}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Tickets" value={total} accentColor="bg-civic-blue" icon={FileText} />
          <StatCard label="Pending" value={pending} accentColor="bg-civic-yellow" icon={Clock} />
          <StatCard label="In Progress" value={inProgress} accentColor="bg-civic-orange" icon={BarChart3} />
          <StatCard label="Resolved" value={resolved} accentColor="bg-civic-green" icon={CheckCircle} />
          {isAdmin && (
            <StatCard label="High Priority" value={highPriority} accentColor="bg-civic-red" icon={AlertTriangle} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          {!isAdmin && (
            <Link href="/register">
              <Button className="bg-civic-orange hover:bg-civic-orange/90">
                + Submit New Complaint
              </Button>
            </Link>
          )}
          <Link href="/tickets">
            <Button variant="outline">View All Tickets</Button>
          </Link>
          {isAdmin && (
            <Link href="/approvals">
              <Button variant="outline">Go to Approvals</Button>
            </Link>
          )}
        </div>

        {/* Activity Feed */}
        {tickets && <ActivityFeed tickets={tickets} />}
      </div>
    </AppLayout>
  )
}