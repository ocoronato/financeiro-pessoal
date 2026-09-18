export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function clampedDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, Math.min(day, daysInMonth(year, month)))
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addMonthsClamped(date: Date, months: number): Date {
  const total = date.getFullYear() * 12 + date.getMonth() + months
  const year = Math.floor(total / 12)
  const month = ((total % 12) + 12) % 12
  const day = Math.min(date.getDate(), daysInMonth(year, month + 1))
  return new Date(year, month, day)
}

export interface DateRange {
  start: Date
  end: Date
}

export type PeriodFilter =
  | 'este-mes'
  | 'mes-passado'
  | 'ultimos-3-meses'
  | 'ultimos-6-meses'
  | 'este-ano'
  | 'personalizado'

export function getPeriodRange(filter: PeriodFilter, custom?: DateRange): DateRange {
  const now = new Date()
  const startOfMonth = (y: number, m: number) => new Date(y, m, 1, 0, 0, 0, 0)
  const endOfMonth = (y: number, m: number) => new Date(y, m + 1, 0, 23, 59, 59, 999)

  switch (filter) {
    case 'este-mes':
      return { start: startOfMonth(now.getFullYear(), now.getMonth()), end: endOfMonth(now.getFullYear(), now.getMonth()) }
    case 'mes-passado': {
      const m = now.getMonth() - 1
      const d = new Date(now.getFullYear(), m, 1)
      return { start: startOfMonth(d.getFullYear(), d.getMonth()), end: endOfMonth(d.getFullYear(), d.getMonth()) }
    }
    case 'ultimos-3-meses': {
      const d = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      return { start: startOfMonth(d.getFullYear(), d.getMonth()), end: endOfMonth(now.getFullYear(), now.getMonth()) }
    }
    case 'ultimos-6-meses': {
      const d = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      return { start: startOfMonth(d.getFullYear(), d.getMonth()), end: endOfMonth(now.getFullYear(), now.getMonth()) }
    }
    case 'este-ano':
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999) }
    case 'personalizado':
      return custom ?? { start: startOfMonth(now.getFullYear(), now.getMonth()), end: endOfMonth(now.getFullYear(), now.getMonth()) }
  }
}

export function getPreviousPeriodRange(range: DateRange): DateRange {
  const durationMs = range.end.getTime() - range.start.getTime()
  const end = new Date(range.start.getTime() - 1)
  const start = new Date(end.getTime() - durationMs)
  return { start, end }
}

export function isDateInRange(dateStr: string, range: DateRange): boolean {
  const time = new Date(dateStr + 'T12:00:00').getTime()
  return time >= range.start.getTime() && time <= range.end.getTime()
}

export function getInvoicePeriod(date: Date, closingDay: number): { month: number; year: number } {
  const day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  if (day > closingDay) {
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return { month, year }
}

export function getInvoiceClosingDate(month: number, year: number, closingDay: number): Date {
  return clampedDate(year, month, closingDay)
}

export function getInvoiceDueDate(month: number, year: number, dueDay: number, closingDay: number): Date {
  let dueMonth = month
  let dueYear = year
  if (dueDay <= closingDay) {
    dueMonth += 1
    if (dueMonth > 12) {
      dueMonth = 1
      dueYear += 1
    }
  }
  return clampedDate(dueYear, dueMonth, dueDay)
}
