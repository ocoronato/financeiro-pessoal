import { useMemo } from 'react'
import { useAccountBalances } from '@/hooks/useAccountBalances'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useInvoices } from '@/hooks/useInvoices'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useGoals } from '@/hooks/useGoals'
import { getPeriodRange, isDateInRange, toISODate } from '@/utils/date'
import { buildMonthlyTrend } from '@/utils/trend'
import type { Transaction } from '@/types'

export function useDashboardData() {
  const { accounts, balances, totalBalance } = useAccountBalances()
  const transactions = useTransactions()
  const categories = useCategories()
  const invoices = useInvoices()
  const cards = useCreditCards()
  const goals = useGoals()

  return useMemo(() => {
    const monthRange = getPeriodRange('este-mes')
    const monthTransactions = transactions.filter((t) => isDateInRange(t.date, monthRange))

    const monthlyIncome = monthTransactions
      .filter((t) => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0)
    const monthlyExpense = monthTransactions
      .filter((t) => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0)

    const openInvoiceIds = new Set(invoices.filter((i) => i.status !== 'paga').map((i) => i.id))
    const upcomingInvoicesTotal = transactions
      .filter((t) => t.invoiceId !== undefined && openInvoiceIds.has(t.invoiceId))
      .reduce((sum, t) => sum + t.amount, 0)

    const recentTransactions = transactions.slice(0, 6)

    const topExpenses = monthTransactions
      .filter((t) => t.type === 'despesa')
      .slice()
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    const todayStr = toISODate(new Date())
    const upcomingBills: Transaction[] = transactions
      .filter((t) => t.type === 'despesa' && t.status === 'pendente' && !t.cardId)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)

    const categoryTotals = new Map<number, number>()
    for (const t of monthTransactions) {
      if (t.type !== 'despesa' || t.categoryId === undefined) continue
      categoryTotals.set(t.categoryId, (categoryTotals.get(t.categoryId) ?? 0) + t.amount)
    }
    const categoryBreakdown = Array.from(categoryTotals.entries())
      .map(([categoryId, total]) => ({
        category: categories.find((c) => c.id === categoryId),
        total,
      }))
      .filter((entry) => entry.category)
      .sort((a, b) => b.total - a.total)

    const trend = buildMonthlyTrend(transactions, 6)

    return {
      accounts,
      balances,
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance: monthlyIncome - monthlyExpense,
      upcomingInvoicesTotal,
      recentTransactions,
      topExpenses,
      upcomingBills,
      categoryBreakdown,
      trend,
      categories,
      cards,
      invoices,
      goals,
      todayStr,
    }
  }, [accounts, balances, totalBalance, transactions, categories, invoices, cards, goals])
}
