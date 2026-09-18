import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { Account } from '@/types'

export function useAccounts(): Account[] {
  return useLiveQuery(() => db.accounts.orderBy('name').toArray(), [], []) ?? []
}

export function useAccount(id?: number): Account | undefined {
  return useLiveQuery(() => (id !== undefined ? db.accounts.get(id) : undefined), [id])
}
