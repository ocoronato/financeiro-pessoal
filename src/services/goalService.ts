import { db } from '@/database/db'
import type { Goal } from '@/types'

export async function createGoal(data: Omit<Goal, 'id' | 'createdAt' | 'currentAmount'> & { currentAmount?: number }) {
  return db.goals.add({ ...data, currentAmount: data.currentAmount ?? 0, createdAt: new Date().toISOString() })
}

export async function updateGoal(id: number, data: Partial<Omit<Goal, 'id'>>) {
  return db.goals.update(id, data)
}

export async function deleteGoal(id: number) {
  return db.goals.delete(id)
}

export async function addAmountToGoal(id: number, amount: number) {
  const goal = await db.goals.get(id)
  if (!goal) throw new Error('Meta não encontrada')
  const next = Math.max(0, goal.currentAmount + amount)
  await db.goals.update(id, { currentAmount: next })
  return next
}
