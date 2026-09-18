export type RecurringKind = 'receita' | 'despesa'

export interface RecurringTransaction {
  id?: number
  kind: RecurringKind
  description: string
  amount: number
  categoryId: number
  dayOfMonth: number
  accountId?: number
  cardId?: number
  active: boolean
  lastGeneratedPeriod?: string
  createdAt: string
}
