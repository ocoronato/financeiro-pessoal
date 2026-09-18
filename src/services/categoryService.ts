import { db } from '@/database/db'
import type { Category } from '@/types'

export async function createCategory(data: Omit<Category, 'id' | 'isDefault'>) {
  return db.categories.add({ ...data, isDefault: false })
}

export async function updateCategory(id: number, data: Partial<Omit<Category, 'id'>>) {
  return db.categories.update(id, data)
}

export async function deleteCategory(id: number) {
  const [txCount, recurringCount] = await Promise.all([
    db.transactions.where('categoryId').equals(id).count(),
    db.recurringTransactions.where('categoryId').equals(id).count(),
  ])
  if (txCount > 0 || recurringCount > 0) {
    throw new Error(
      'Não é possível excluir: existem transações ou recorrências usando esta categoria.',
    )
  }
  return db.categories.delete(id)
}
