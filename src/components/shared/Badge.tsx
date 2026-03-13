const statusConfig: Record<string, { label: string; classes: string }> = {
  OPEN: { label: 'Pending', classes: 'bg-civic-blue/10 text-civic-blue border-civic-blue' },
  IN_PROGRESS: { label: 'InProgress', classes: 'bg-civic-yellow/10 text-civic-yellow border-civic-yellow' },
  RESOLVED: { label: 'Resolved', classes: 'bg-civic-green/10 text-civic-green border-civic-green' },
}

const priorityConfig: Record<string, { label: string; classes: string }> = {
  LOW: { label: 'Low', classes: 'bg-civic-green/10 text-civic-green border-civic-green' },
  MEDIUM: { label: 'Medium', classes: 'bg-civic-orange/10 text-civic-orange border-civic-orange' },
  HIGH: { label: 'High', classes: 'bg-civic-red/10 text-civic-red border-civic-red' },
  CRITICAL: { label: 'Critical', classes: 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]' },
}

const approvalConfig: Record<string, { emoji: string; label: string; classes: string }> = {
  APPROVED: { emoji: '✅', label: 'Approved', classes: 'bg-civic-green/10 text-civic-green border-civic-green' },
  AWAITING: { emoji: '⏳', label: 'Awaiting', classes: 'bg-civic-orange/10 text-civic-orange border-civic-orange' },
  REJECTED: { emoji: '❌', label: 'Rejected', classes: 'bg-civic-red/10 text-civic-red border-civic-red' },
}

const fallback = { emoji: '', label: '—', classes: 'bg-muted text-muted-foreground border-border' }

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? fallback
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority] ?? fallback
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}

export function ApprovalBadge({ approval }: { approval: 'AWAITING' | 'APPROVED' | 'REJECTED' }) {
  const key = approval
  const cfg = approvalConfig[key] ?? fallback
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1 whitespace-nowrap min-w-24 justify-center ${cfg.classes}`}>
      {cfg.emoji} {cfg.label}
    </span>
  )
}