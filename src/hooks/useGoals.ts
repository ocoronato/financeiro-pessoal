import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { Goal } from '@/types'

export function useGoals(): Goal[] {
  return useLiveQuery(() => db.goals.orderBy('name').toArray(), [], []) ?? []
}

export function useGoal(id?: number): Goal | undefined {
  return useLiveQuery(() => (id !== undefined ? db.goals.get(id) : undefined), [id])
}
