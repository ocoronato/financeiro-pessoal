import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { TransactionCard } from '@/features/transactions/TransactionCard'
import { PeriodFilter } from '@/features/reports/PeriodFilter'
import { IncomeExpenseChart } from '@/features/dashboard/IncomeExpenseChart'
import { CategoryBreakdownChart } from '@/features/dashboard/CategoryBreakdownChart'
import { ExpenseTrendChart } from '@/features/reports/ExpenseTrendChart'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreditCards } from '@/hooks/useCreditCards'
import { getPeriodRange, getPreviousPeriodRange, isDateInRange, type PeriodFilter as PeriodFilterType } from '@/utils/date'
import { buildMonthlyTrend, buildMonthlyTrendForRange } from '@/utils/trend'
import { formatPercent } from '@/utils/format'
import { cn } from '@/lib/utils'
import { deleteTransaction, duplicateTransaction, toggleTransactionStatus } from '@/services/transactionService'
import { toast } from '@/hooks/use-toast'
import type { Transaction } from '@/types'

function ComparisonStat({
  label,
  current,
  previous,
  positiveIsGood,
}: {
  label: string
  current: number
  previous: number
  positiveIsGood: boolean
}) {
  const delta = current - previous
  const percent = previous !== 0 ? delta / previous : current !== 0 ? 1 : 0
  const isGood = positiveIsGood ? delta >= 0 : delta <= 0
  const Icon = delta === 0 ? Minus : delta > 0 ? ArrowUp : ArrowDown

  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('flex items-center gap-1 text-sm font-medium', delta === 0 ? 'text-muted-foreground' : isGood ? 'text-income' : 'text-expense')}>
        <Icon className="size-3.5" />
        {formatPercent(Math.abs(percent))}
      </span>
    </div>
  )
}

export default function ReportsPage() {
  const transactions = useTransactions()
  const categories = useCategories()
  const accounts = useAccounts()
  const cards = useCreditCards()
  const { openEdit } = useTransactionDialog()

  const [filter, setFilter] = useState<PeriodFilterType>('este-mes')
  const [customStart, setCustomStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [customEnd, setCustomEnd] = useState(new Date())
  const [deleting, setDeleting] = useState<Transaction | undefined>()

  const range = useMemo(
    () => getPeriodRange(filter, { start: customStart, end: customEnd }),
    [filter, customStart, customEnd],
  )
  const previousRange = useMemo(() => getPreviousPeriodRange(range), [range])

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts])
  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const periodTransactions = useMemo(
    () => transactions.filter((t) => t.type !== 'transferencia' && isDateInRange(t.date, range)),
    [transactions, range],
  )
  const previousTransactions = useMemo(
    () => transactions.filter((t) => t.type !== 'transferencia' && isDateInRange(t.date, previousRange)),
    [transactions, previousRange],
  )

  const income = periodTransactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const expense = periodTransactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
  const previousIncome = previousTransactions.filter((t) => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const previousExpense = previousTransactions.filter((t) => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)

  const categoryBreakdown = useMemo(() => {
    const totals = new Map<number, number>()
    for (const t of periodTransactions) {
      if (t.type !== 'despesa' || t.categoryId === undefined) continue
      totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount)
    }
    return Array.from(totals.entries())
      .map(([categoryId, total]) => ({ category: categoryMap.get(categoryId), total }))
      .filter((e) => e.category)
      .sort((a, b) => b.total - a.total)
  }, [periodTransactions, categoryMap])

  const topExpenses = useMemo(
    () =>
      periodTransactions
        .filter((t) => t.type === 'despesa')
        .slice()
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8),
    [periodTransactions],
  )

  const trend = useMemo(() => buildMonthlyTrendForRange(transactions, range), [transactions, range])
  const expenseTrend = useMemo(() => buildMonthlyTrend(transactions, 6), [transactions])

  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="Relatórios" description="Analise seus gastos e receitas por período." />

      <PeriodFilter
        value={filter}
        onChange={setFilter}
        customStart={customStart}
        customEnd={customEnd}
        onCustomChange={(s, e) => {
          setCustomStart(s)
          setCustomEnd(e)
        }}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Receitas do período</p>
          <MoneyDisplay value={income} variant="income" size="lg" className="mt-1 block" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Despesas do período</p>
          <MoneyDisplay value={expense} variant="expense" size="lg" className="mt-1 block" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Saldo do período</p>
          <MoneyDisplay value={income - expense} variant="auto" size="lg" className="mt-1 block" />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparação com o período anterior</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ComparisonStat label="Receitas" current={income} previous={previousIncome} positiveIsGood />
          <ComparisonStat label="Despesas" current={expense} previous={previousExpense} positiveIsGood={false} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita x despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Sem despesas neste período.</p>
            ) : (
              <CategoryBreakdownChart data={categoryBreakdown} limit={10} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos nos últimos meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTrendChart data={expenseTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maiores despesas do período</CardTitle>
        </CardHeader>
        <CardContent>
          {topExpenses.length === 0 ? (
            <EmptyState icon={ArrowDown} title="Nenhuma despesa neste período" />
          ) : (
            <div className="space-y-2">
              {topExpenses.map((t) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  category={t.categoryId !== undefined ? categoryMap.get(t.categoryId) : undefined}
                  account={t.accountId !== undefined ? accountMap.get(t.accountId) : undefined}
                  card={t.cardId !== undefined ? cardMap.get(t.cardId) : undefined}
                  onEdit={() => openEdit(t)}
                  onDuplicate={async () => {
                    if (!t.id) return
                    await duplicateTransaction(t.id)
                    toast({ title: 'Transação duplicada', variant: 'success' })
                  }}
                  onDelete={() => setDeleting(t)}
                  onToggleStatus={() => t.id && toggleTransactionStatus(t.id, t.status === 'pago' ? 'pendente' : 'pago')}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir transação?"
        description={`Tem certeza que deseja excluir "${deleting?.description}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={async () => {
          if (!deleting?.id) return
          await deleteTransaction(deleting.id)
          toast({ title: 'Transação excluída', variant: 'success' })
          setDeleting(undefined)
        }}
      />
    </div>
  )
}
