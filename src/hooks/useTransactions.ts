import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { Transaction } from '@/types'

export function useTransactions(): Transaction[] {
  return useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray(), [], []) ?? []
}

export function useTransactionsByInvoice(invoiceId?: number): Transaction[] {
  return (
    useLiveQuery(
      () => (invoiceId !== undefined ? db.transactions.where('invoiceId').equals(invoiceId).toArray() : []),
      [invoiceId],
      [],
    ) ?? []
  )
}
