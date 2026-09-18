import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function formatFromCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

interface CurrencyInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> {
  value: number
  onValueChange: (value: number) => void
}

export function CurrencyInput({ value, onValueChange, className, ...props }: CurrencyInputProps) {
  const display = formatFromCents(Math.round(value * 100))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    const cents = digits ? parseInt(digits, 10) : 0
    onValueChange(cents / 100)
  }

  return (
    <Input
      inputMode="decimal"
      placeholder="R$ 0,00"
      value={display}
      onChange={handleChange}
      className={cn('tabular-nums', className)}
      {...props}
    />
  )
}
