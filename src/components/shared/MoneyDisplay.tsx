import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface MoneyDisplayProps {
  value: number
  variant?: 'default' | 'income' | 'expense' | 'auto' | 'muted'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

const sizeClasses: Record<NonNullable<MoneyDisplayProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl font-semibold',
  xl: 'text-3xl font-semibold tracking-tight',
}

export function MoneyDisplay({ value, variant = 'default', size = 'md', showSign = false, className }: MoneyDisplayProps) {
  const resolvedVariant = variant === 'auto' ? (value < 0 ? 'expense' : value > 0 ? 'income' : 'default') : variant

  const colorClass = {
    default: 'text-foreground',
    income: 'text-income',
    expense: 'text-expense',
    muted: 'text-muted-foreground',
  }[resolvedVariant]

  const sign = showSign && value > 0 ? '+' : ''

  return (
    <span className={cn('tabular-nums', sizeClasses[size], colorClass, className)}>
      {sign}
      {formatCurrency(value)}
    </span>
  )
}
