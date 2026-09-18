import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from '@/components/shared/ChartTooltip'
import { formatCurrencyCompact } from '@/utils/format'
import type { MonthlyTrendPoint } from '@/utils/trend'

interface IncomeExpenseChartProps {
  data: MonthlyTrendPoint[]
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={56}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={(v) => formatCurrencyCompact(v)}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }}
        />
        <Bar dataKey="receita" name="Receitas" fill="var(--income)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar dataKey="despesa" name="Despesas" fill="var(--expense)" radius={[4, 4, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}
