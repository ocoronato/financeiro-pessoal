import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { Invoice } from '@/types'

export function useInvoices(): Invoice[] {
  return useLiveQuery(() => db.invoices.toArray(), [], []) ?? []
}

export function useCardInvoices(cardId?: number): Invoice[] {
  return (
    useLiveQuery(
      () => (cardId !== undefined ? db.invoices.where('cardId').equals(cardId).toArray() : []),
      [cardId],
      [],
    ) ?? []
  )
}

export function useInvoice(id?: number): Invoice | undefined {
  return useLiveQuery(() => (id !== undefined ? db.invoices.get(id) : undefined), [id])
}
