import { db } from '@/database/db'
import type { RecurringTransaction } from '@/types'
import { clampedDate, toISODate } from '@/utils/date'
import { getOrCreateInvoice } from './invoiceService'

export async function createRecurring(data: Omit<RecurringTransaction, 'id' | 'createdAt' | 'active' | 'lastGeneratedPeriod'>) {
  return db.recurringTransactions.add({
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
  })
}

export async function updateRecurring(id: number, data: Partial<Omit<RecurringTransaction, 'id'>>) {
  return db.recurringTransactions.update(id, data)
}

export async function deleteRecurring(id: number) {
  return db.recurringTransactions.delete(id)
}

export async function toggleRecurringActive(id: number, active: boolean) {
  return db.recurringTransactions.update(id, { active })
}

function currentPeriod(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function generatePendingRecurringTransactions() {
  const period = currentPeriod()
  const now = new Date()
  const allRules = await db.recurringTransactions.toArray()
  const candidates = allRules.filter((r) => r.active && r.lastGeneratedPeriod !== period)

  for (const rule of candidates) {
    // Wrapped in a single Dexie transaction and re-checked from the DB so two
    // concurrent calls (e.g. React StrictMode's double effect invocation)
    // can never both pass the guard and create a duplicate transaction.
    await db.transaction('rw', db.recurringTransactions, db.transactions, db.invoices, async () => {
      const current = await db.recurringTransactions.get(rule.id!)
      if (!current || !current.active || current.lastGeneratedPeriod === period) return

      const date = clampedDate(now.getFullYear(), now.getMonth() + 1, current.dayOfMonth)
      let invoiceId: number | undefined
      if (current.cardId) {
        const invoice = await getOrCreateInvoice(current.cardId, date)
        invoiceId = invoice.id
      }

      await db.transactions.add({
        type: current.kind,
        description: current.description,
        amount: current.amount,
        date: toISODate(date),
        categoryId: current.categoryId,
        accountId: current.cardId ? undefined : current.accountId,
        cardId: current.cardId,
        invoiceId,
        status: current.cardId ? 'pago' : 'pendente',
        recurringId: current.id,
        createdAt: new Date().toISOString(),
      })

      await db.recurringTransactions.update(current.id!, { lastGeneratedPeriod: period })
    })
  }
}
