import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/database/db'
import type { Category, CategoryKind } from '@/types'

export function useCategories(kind?: CategoryKind): Category[] {
  return (
    useLiveQuery(async () => {
      const all = await db.categories.orderBy('name').toArray()
      return kind ? all.filter((c) => c.kind === kind) : all
    }, [kind]) ?? []
  )
}

export function useCategory(id?: number): Category | undefined {
  return useLiveQuery(() => (id !== undefined ? db.categories.get(id) : undefined), [id])
}
