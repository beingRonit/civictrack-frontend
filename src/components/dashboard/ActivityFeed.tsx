import { Ticket } from '@/types'

interface ActivityFeedProps {
  tickets: Ticket[]
}

export default function ActivityFeed({ tickets }: ActivityFeedProps) {
  const recent = tickets.slice(0, 5)

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Recent Activity</h3>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent activity</p>
      ) : (
        recent.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div>
              <p className="font-medium text-sm">{ticket.title}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs font-medium">{ticket.status}</span>
          </div>
        ))
      )}
    </div>
  )
}
