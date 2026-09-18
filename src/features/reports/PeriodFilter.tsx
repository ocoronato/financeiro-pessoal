import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toISODate, type PeriodFilter as PeriodFilterType } from '@/utils/date'

const OPTIONS: { value: PeriodFilterType; label: string }[] = [
  { value: 'este-mes', label: 'Este mês' },
  { value: 'mes-passado', label: 'Mês passado' },
  { value: 'ultimos-3-meses', label: 'Últimos 3 meses' },
  { value: 'ultimos-6-meses', label: 'Últimos 6 meses' },
  { value: 'este-ano', label: 'Este ano' },
  { value: 'personalizado', label: 'Período personalizado' },
]

interface PeriodFilterProps {
  value: PeriodFilterType
  onChange: (value: PeriodFilterType) => void
  customStart: Date
  customEnd: Date
  onCustomChange: (start: Date, end: Date) => void
}

export function PeriodFilter({ value, onChange, customStart, customEnd, onCustomChange }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={value} onValueChange={(v) => onChange(v as PeriodFilterType)}>
        <SelectTrigger className="w-auto min-w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value === 'personalizado' && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={toISODate(customStart)}
            onChange={(e) => e.target.value && onCustomChange(new Date(`${e.target.value}T00:00:00`), customEnd)}
            className="w-auto"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Input
            type="date"
            value={toISODate(customEnd)}
            onChange={(e) => e.target.value && onCustomChange(customStart, new Date(`${e.target.value}T23:59:59`))}
            className="w-auto"
          />
        </div>
      )}
    </div>
  )
}
