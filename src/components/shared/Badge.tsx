import { Status, Priority, Approval } from '@/types'

const statusColors: Record<Status, string> = {
  Pending: 'bg-civic-yellow/10 text-civic-yellow border-civic-yellow',
  InProgress: 'bg-civic-blue/10 text-civic-blue border-civic-blue',
  Resolved: 'bg-civic-green/10 text-civic-green border-civic-green',
}

const priorityColors: Record<Priority, string> = {
  Low: 'bg-civic-green/10 text-civic-green border-civic-green',
  Medium: 'bg-civic-yellow/10 text-civic-yellow border-civic-yellow',
  High: 'bg-civic-red/10 text-civic-red border-civic-red',
}

const approvalColors: Record<Approval, string> = {
  Awaiting: 'bg-civic-orange/10 text-civic-orange border-civic-orange',
  Approved: 'bg-civic-green/10 text-civic-green border-civic-green',
  Rejected: 'bg-civic-red/10 text-civic-red border-civic-red',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[priority]}`}>
      {priority}
    </span>
  )
}

export function ApprovalBadge({ approval }: { approval: Approval }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${approvalColors[approval]}`}>
      {approval}
    </span>
  )
}
