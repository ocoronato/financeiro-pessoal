import { db } from '@/database/db'
import type { CreditCard, Invoice, Transaction } from '@/types'
import { ensureInvoicesExist } from './invoiceService'

export async function createCreditCard(data: Omit<CreditCard, 'id' | 'createdAt'>) {
  const id = await db.creditCards.add({ ...data, createdAt: new Date().toISOString() })
  const card = await db.creditCards.get(id)
  if (card) await ensureInvoicesExist(card, 1)
  return id
}

export async function updateCreditCard(id: number, data: Partial<Omit<CreditCard, 'id'>>) {
  return db.creditCards.update(id, data)
}

export async function deleteCreditCard(id: number) {
  const txCount = await db.transactions.where('cardId').equals(id).count()
  if (txCount > 0) {
    throw new Error('Não é possível excluir: existem compras vinculadas a este cartão.')
  }
  await db.invoices.where('cardId').equals(id).delete()
  return db.creditCards.delete(id)
}

export function calculateCardUsage(cardId: number, transactions: Transaction[], invoices: Invoice[]): number {
  const unpaidInvoiceIds = new Set(
    invoices.filter((i) => i.cardId === cardId && i.status !== 'paga').map((i) => i.id),
  )
  return transactions
    .filter((t) => t.cardId === cardId && t.invoiceId !== undefined && unpaidInvoiceIds.has(t.invoiceId))
    .reduce((sum, t) => sum + t.amount, 0)
}
