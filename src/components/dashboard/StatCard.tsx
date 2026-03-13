interface StatCardProps {
  label: string
  value: number | string
  accentColor: string
  emoji: string
}

export default function StatCard({ label, value, accentColor, emoji }: StatCardProps) {
  return (
    <div
      className="bg-card rounded-[14px] p-5 px-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-t-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)]"
      style={{ borderTopColor: accentColor }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-muted-foreground text-[11px] font-bold uppercase tracking-[1px]">{label}</div>
          <div className="text-[34px] font-black text-foreground mt-1">{value}</div>
        </div>
        <div
          className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl"
          style={{ background: `${accentColor}18` }}
        >
          {emoji}
        </div>
      </div>
    </div>
  )
}
