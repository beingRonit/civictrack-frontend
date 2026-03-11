'use client'

import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import { useTickets } from '@/hooks/useTickets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { FileText, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react'

const PIE_COLORS = ['#EAB308', '#2563EB', '#16A34A']

export default function AnalyticsPage() {
  const { data: tickets, isLoading } = useTickets()

  if (isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  const all = tickets || []
  const total = all.length
  const pending = all.filter((t) => t.status === 'Pending').length
  const inProgress = all.filter((t) => t.status === 'InProgress').length
  const resolved = all.filter((t) => t.status === 'Resolved').length
  const highPriority = all.filter((t) => t.priority === 'High').length

  // Category breakdown
  const categories = ['Water', 'Electricity', 'Road', 'Garbage']
  const categoryData = categories.map((cat) => ({
    name: cat,
    count: all.filter((t) => t.category === cat).length,
  }))

  // Status breakdown for pie chart
  const statusData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ]

  // Priority breakdown
  const priorities = [
    { label: 'High', count: all.filter((t) => t.priority === 'High').length, color: 'bg-civic-red' },
    { label: 'Medium', count: all.filter((t) => t.priority === 'Medium').length, color: 'bg-civic-yellow' },
    { label: 'Low', count: all.filter((t) => t.priority === 'Low').length, color: 'bg-civic-green' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total" value={total} accentColor="bg-civic-blue" icon={FileText} />
          <StatCard label="Pending" value={pending} accentColor="bg-civic-yellow" icon={Clock} />
          <StatCard label="In Progress" value={inProgress} accentColor="bg-civic-orange" icon={BarChart3} />
          <StatCard label="Resolved" value={resolved} accentColor="bg-civic-green" icon={CheckCircle} />
          <StatCard label="High Priority" value={highPriority} accentColor="bg-civic-red" icon={AlertTriangle} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart: By Category */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart: Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Priority Progress Bars */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorities.map((p) => (
              <div key={p.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{p.label}</span>
                  <span>{p.count} / {total}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.color} rounded-full transition-all`}
                    style={{ width: total ? `${(p.count / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
