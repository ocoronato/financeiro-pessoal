import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { formatCurrencyCompact } from '@/utils/format'
import type { Category } from '@/types'

interface CategoryBreakdownChartProps {
  data: { category?: Category; total: number }[]
  limit?: number
}

export function CategoryBreakdownChart({ data, limit = 8 }: CategoryBreakdownChartProps) {
  const items = data.slice(0, limit).map((d) => ({
    name: d.category?.name ?? 'Outros',
    total: d.total,
    color: d.category?.color ?? '#78716c',
  }))

  const height = Math.max(180, items.length * 40)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={items} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={100}
          tick={{ fill: 'var(--foreground)', fontSize: 12.5 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
        <Bar dataKey="total" name="Gasto" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {items.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
          <LabelList
            dataKey="total"
            position="right"
            formatter={(value) => formatCurrencyCompact(typeof value === 'number' ? value : 0)}
            style={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
