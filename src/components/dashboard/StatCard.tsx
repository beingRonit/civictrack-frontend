import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  accentColor: string
  icon: LucideIcon
}

export default function StatCard({ label, value, accentColor, icon: Icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-3 rounded-lg ${accentColor}/10`}>
          <Icon className={`w-6 h-6 ${accentColor.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
