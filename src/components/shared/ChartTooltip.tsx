import { formatCurrency } from '@/utils/format'

interface ChartTooltipProps {
  active?: boolean
  label?: string
  payload?: Array<{ name?: string; value?: number; color?: string }>
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-popover p-3 text-sm shadow-lg">
      {label && <p className="mb-1.5 font-medium capitalize">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums">{formatCurrency(entry.value ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
