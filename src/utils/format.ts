import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCurrencyCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return format(parseISO(dateStr), 'dd/MM/yyyy')
}

export function formatDateLong(dateStr: string): string {
  if (!dateStr) return ''
  return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1)
  return format(date, 'MMMM/yyyy', { locale: ptBR })
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value)
}
