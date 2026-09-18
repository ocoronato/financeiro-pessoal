import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/types'
import { isDateInRange, type DateRange } from './date'

export interface MonthlyTrendPoint {
  key: string
  label: string
  month: number
  year: number
  receita: number
  despesa: number
}

export function buildMonthlyTrend(transactions: Transaction[], monthsCount: number): MonthlyTrendPoint[] {
  const now = new Date()
  const points: MonthlyTrendPoint[] = []

  for (let i = monthsCount - 1; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const range = {
      start: ref,
      end: new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999),
    }
    const items = transactions.filter((t) => t.type !== 'transferencia' && isDateInRange(t.date, range))
    const receita = items.filter((t) => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0)
    const despesa = items.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0)

    points.push({
      key: `${ref.getFullYear()}-${ref.getMonth()}`,
      label: format(ref, 'MMM', { locale: ptBR }).replace('.', ''),
      month: ref.getMonth() + 1,
      year: ref.getFullYear(),
      receita,
      despesa,
    })
  }

  return points
}

export function buildMonthlyTrendForRange(transactions: Transaction[], range: DateRange): MonthlyTrendPoint[] {
  const points: MonthlyTrendPoint[] = []
  let cursor = new Date(range.start.getFullYear(), range.start.getMonth(), 1)
  const end = new Date(range.end.getFullYear(), range.end.getMonth(), 1)

  while (cursor <= end && points.length < 24) {
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999)
    const items = transactions.filter(
      (t) => t.type !== 'transferencia' && isDateInRange(t.date, { start: cursor, end: monthEnd }),
    )
    const receita = items.filter((t) => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0)
    const despesa = items.filter((t) => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0)

    points.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: format(cursor, 'MMM/yy', { locale: ptBR }).replace('.', ''),
      month: cursor.getMonth() + 1,
      year: cursor.getFullYear(),
      receita,
      despesa,
    })

    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  }

  return points
}
