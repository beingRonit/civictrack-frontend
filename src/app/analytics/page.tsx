'use client'

import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import { useTickets } from '@/hooks/useTickets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { useTheme } from 'next-themes'

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg px-3 py-2 shadow-md text-xs font-medium border border-white/10 bg-white/10 backdrop-blur-md text-gray-900 dark:text-gray-100">
      {label && <div className="mb-0.5 opacity-70">{label}</div>}
      <div className="font-bold">{payload[0].name ?? payload[0].dataKey}: {payload[0].value}</div>
    </div>
  )
}

const PIE_COLORS = ['#F59E0B', '#3B82F6', '#10B981']
const STATUS_DOT_COLORS: Record<string, string> = {
  Open: '#F59E0B',
  'In Progress': '#3B82F6',
  Resolved: '#10B981',
}

export default function AnalyticsPage() {
  const { data: tickets, isLoading } = useTickets()

  if (isLoading) return <AppLayout><p>Loading...</p></AppLayout>

  const all = tickets || []
  const total = all.length
  const open = all.filter((t) => t.status === 'OPEN').length
  const inProgress = all.filter((t) => t.status === 'IN_PROGRESS').length
  const resolved = all.filter((t) => t.status === 'RESOLVED').length

  const priorities = [
    { label: 'Low', count: all.filter((t) => t.priority === 'LOW').length, color: 'bg-[#10B981]', accentColor: '#10B981' },
    { label: 'Medium', count: all.filter((t) => t.priority === 'MEDIUM').length, color: 'bg-[#F59E0B]', accentColor: '#F59E0B' },
    { label: 'High', count: all.filter((t) => t.priority === 'HIGH').length, color: 'bg-[#EF4444]', accentColor: '#EF4444' },
    { label: 'Critical', count: all.filter((t) => t.priority === 'CRITICAL').length, color: 'bg-[#7C3AED]', accentColor: '#7C3AED' },
  ]

  const categoryMap = [
    { value: 'WATER', label: 'Water' },
    { value: 'ELECTRICITY', label: 'Electricity' },
    { value: 'ROAD', label: 'Road' },
    { value: 'GARBAGE', label: 'Garbage' },
  ]
  const categoryData = categoryMap.map((cat) => ({
    name: cat.label,
    count: all.filter((t) => t.category === cat.value).length,
  }))

  const statusData = [
    { name: 'Open', value: open },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Insights and statistics across all complaints</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          <StatCard label="Low" value={priorities[0].count} accentColor="#10B981" emoji={'🟢'} />
          <StatCard label="Medium" value={priorities[1].count} accentColor="#F59E0B" emoji={'🟡'} />
          <StatCard label="High" value={priorities[2].count} accentColor="#EF4444" emoji={'🟠'} />
          <StatCard label="Critical" value={priorities[3].count} accentColor="#7C3AED" emoji={'🔴'} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="outline-none focus:outline-none focus-within:outline-none [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
            <CardHeader>
              <CardTitle>Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} minPointSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="relative outline-none focus:outline-none focus-within:outline-none [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <ResponsiveContainer width={280} height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {statusData.map((_, i) => (
                          <Cell 
                            key={i} 
                            fill={PIE_COLORS[i]} 
                            stroke="none" 
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        content={<CustomTooltip />}
                        cursor={false}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-foreground">{total}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4">
                {statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-sm text-muted-foreground">{s.name}</span>
                    <span className="text-sm font-semibold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        .recharts-wrapper, .recharts-surface, .recharts-sector, .recharts-bar-rectangle,
        .recharts-pie, .recharts-pie-sector, .recharts-cell {
          outline: none !important;
          -webkit-tap-highlight-color: transparent;
        }
        .recharts-sector:focus, .recharts-bar-rectangle:focus,
        .recharts-wrapper:focus, .recharts-surface:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .recharts-tooltip-wrapper {
          outline: none !important;
        }
      `}</style>
    </AppLayout>
  )
}