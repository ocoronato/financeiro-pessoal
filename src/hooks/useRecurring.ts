import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { RecurringTransaction } from '@/types'

export function useRecurring(): RecurringTransaction[] {
  return useLiveQuery(() => db.recurringTransactions.toArray(), [], []) ?? []
}
