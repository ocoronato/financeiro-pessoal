import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { CreditCard } from '@/types'

export function useCreditCards(): CreditCard[] {
  return useLiveQuery(() => db.creditCards.orderBy('name').toArray(), [], []) ?? []
}

export function useCreditCard(id?: number): CreditCard | undefined {
  return useLiveQuery(() => (id !== undefined ? db.creditCards.get(id) : undefined), [id])
}
