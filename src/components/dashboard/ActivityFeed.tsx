import { Ticket } from '@/types'

interface ActivityFeedProps {
  tickets: Ticket[]
}

export default function ActivityFeed({ tickets }: ActivityFeedProps) {
  const recent = tickets.slice(0, 5)

  return (
    <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
      <div className="text-navy dark:text-[#93C5FD] font-bold text-base mb-4 flex items-center gap-2">
        {String.fromCodePoint(0x1F514)} Recent Activity
      </div>
      {recent.length === 0 ? (
        <p className="text-[#9CA3AF] text-center py-5">No activity yet.</p>
      ) : (
        recent.map((ticket, index) => (
          <div
            key={ticket.id}
            className="flex items-center gap-3 px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-[#162032] rounded-[10px] mb-2 animate-fade-up transition-all duration-200 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] hover:shadow-sm"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="w-2 h-2 rounded-full bg-civic-orange shrink-0 animate-pulse-dot" />
            <div className="flex-1 text-[13px]">
              <span className="font-bold text-navy dark:text-[#93C5FD]">#{ticket.id}</span>
              {' \u00B7 '}
              {ticket.title}
            </div>
            <span className="text-[#9CA3AF] text-xs bg-[#E5E7EB] dark:bg-[#334155] dark:text-[#94A3B8] px-2 py-0.5 rounded-md">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
