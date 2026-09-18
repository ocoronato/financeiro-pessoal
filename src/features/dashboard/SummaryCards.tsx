import type { LucideIcon } from 'lucide-react'
import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'

interface SummaryCardsProps {
  totalBalance: number
  accountsCount: number
  monthlyIncome: number
  monthlyExpense: number
  monthlyBalance: number
  upcomingInvoicesTotal: number
}

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
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <MoneyDisplay value={value} variant={variant} size="lg" className="mt-2 block" />
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
      <Card className="bg-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-2 opacity-90">
          <Wallet className="size-4" />
          <p className="text-sm font-medium">Saldo atual</p>
        </div>
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
          {totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <p className="mt-1 text-sm opacity-80">
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
