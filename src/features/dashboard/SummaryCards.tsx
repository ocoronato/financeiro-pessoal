import type { LucideIcon } from 'lucide-react'
import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  totalBalance: number
  accountsCount: number
  monthlyIncome: number
  monthlyExpense: number
  monthlyBalance: number
  upcomingInvoicesTotal: number
}

const TILE_ICON_STYLES = {
  default: 'bg-secondary text-foreground',
  income: 'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  auto: 'bg-secondary text-foreground',
} as const

function StatTile({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: LucideIcon
  label: string
  value: number
  variant: 'default' | 'income' | 'expense' | 'auto'
}) {
  return (
    <Card className="p-4">
      <div className={cn('flex size-8 items-center justify-center rounded-lg', TILE_ICON_STYLES[variant])}>
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <MoneyDisplay value={value} variant={variant} size="lg" className="mt-0.5 block" />
    </Card>
  )
}

export function SummaryCards({
  totalBalance,
  accountsCount,
  monthlyIncome,
  monthlyExpense,
  monthlyBalance,
  upcomingInvoicesTotal,
}: SummaryCardsProps) {
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-neutral-950 via-neutral-950 to-primary p-6 text-primary-foreground shadow-elevated">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ background: 'radial-gradient(280px 160px at 100% 0%, var(--color-primary) 0%, transparent 70%)' }}
        />
        <div className="relative flex items-center gap-2 opacity-90">
          <Wallet className="size-4" />
          <p className="text-sm font-medium">Saldo atual</p>
        </div>
        <p className="relative mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <p className="relative mt-1 text-sm opacity-80">
          Disponível em {accountsCount} {accountsCount === 1 ? 'conta' : 'contas'}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={TrendingUp} label="Receitas do mês" value={monthlyIncome} variant="income" />
        <StatTile icon={TrendingDown} label="Despesas do mês" value={monthlyExpense} variant="expense" />
        <StatTile icon={Wallet} label="Saldo do mês" value={monthlyBalance} variant="auto" />
        <StatTile icon={Receipt} label="Próximas faturas" value={upcomingInvoicesTotal} variant="default" />
      </div>
    </div>
  )
}
