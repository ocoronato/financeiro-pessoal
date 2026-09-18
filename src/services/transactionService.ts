import { db } from '@/database/db'
import type { Transaction, TransactionStatus, TransactionType } from '@/types'
import { addMonthsClamped, toISODate } from '@/utils/date'
import { getOrCreateInvoice } from './invoiceService'

export interface TransactionFormInput {
  type: TransactionType
  description: string
  amount: number
  date: string
  categoryId?: number
  accountId?: number
  cardId?: number
  installments?: number
  status: TransactionStatus
  note?: string
}

export interface TransferInput {
  description?: string
  amount: number
  date: string
  fromAccountId: number
  toAccountId: number
  note?: string
}

export async function createTransaction(input: TransactionFormInput): Promise<number[]> {
  if (input.cardId && input.installments && input.installments > 1) {
    return createInstallmentPurchase(input, input.cardId, input.installments)
  }

  const now = new Date().toISOString()
  let invoiceId: number | undefined
  if (input.cardId) {
    const invoice = await getOrCreateInvoice(input.cardId, new Date(`${input.date}T12:00:00`))
    invoiceId = invoice.id
  }

  const id = await db.transactions.add({
    type: input.type,
    description: input.description,
    amount: input.amount,
    date: input.date,
    categoryId: input.categoryId,
    accountId: input.cardId ? undefined : input.accountId,
    cardId: input.cardId,
    invoiceId,
    status: input.cardId ? 'pago' : input.status,
    note: input.note,
    createdAt: now,
  })
  return [id]
}

async function createInstallmentPurchase(
  input: TransactionFormInput,
  cardId: number,
  installments: number,
): Promise<number[]> {
  const groupId = crypto.randomUUID()
  const baseDate = new Date(`${input.date}T12:00:00`)
  const totalCents = Math.round(input.amount * 100)
  const baseCents = Math.floor(totalCents / installments)
  const remainder = totalCents - baseCents * installments
  const now = new Date().toISOString()
  const ids: number[] = []

  for (let i = 0; i < installments; i++) {
    const installmentDate = addMonthsClamped(baseDate, i)
    const invoice = await getOrCreateInvoice(cardId, installmentDate)
    const cents = baseCents + (i < remainder ? 1 : 0)

    const id = await db.transactions.add({
      type: 'despesa',
      description: `${input.description} (${i + 1}/${installments})`,
      amount: cents / 100,
      date: toISODate(installmentDate),
      categoryId: input.categoryId,
      cardId,
      invoiceId: invoice.id,
      installmentGroupId: groupId,
      installmentNumber: i + 1,
      installmentTotal: installments,
      status: 'pago',
      note: input.note,
      createdAt: now,
    })
    ids.push(id)
  }
  return ids
}

export async function updateTransaction(id: number, input: TransactionFormInput) {
  let invoiceId: number | undefined
  if (input.cardId) {
    const invoice = await getOrCreateInvoice(input.cardId, new Date(`${input.date}T12:00:00`))
    invoiceId = invoice.id
  }

  await db.transactions.update(id, {
    type: input.type,
    description: input.description,
    amount: input.amount,
    date: input.date,
    categoryId: input.categoryId,
    accountId: input.cardId ? undefined : input.accountId,
    cardId: input.cardId,
    invoiceId,
    status: input.cardId ? 'pago' : input.status,
    note: input.note,
  })
}

export async function deleteTransaction(id: number) {
  return db.transactions.delete(id)
}

export async function toggleTransactionStatus(id: number, status: TransactionStatus) {
  return db.transactions.update(id, { status })
}

export async function duplicateTransaction(id: number): Promise<number> {
  const original = await db.transactions.get(id)
  if (!original) throw new Error('Transação não encontrada')

  return db.transactions.add({
    type: original.type,
    description: original.description,
    amount: original.amount,
    date: original.date,
    categoryId: original.categoryId,
    accountId: original.accountId,
    toAccountId: original.toAccountId,
    cardId: original.cardId,
    invoiceId: original.invoiceId,
    status: original.status,
    note: original.note,
    createdAt: new Date().toISOString(),
  })
}

export async function createTransfer(input: TransferInput): Promise<number> {
  if (input.fromAccountId === input.toAccountId) {
    throw new Error('Selecione contas diferentes para a transferência.')
  }
  return db.transactions.add({
    type: 'transferencia',
    description: input.description?.trim() || 'Transferência entre contas',
    amount: input.amount,
    date: input.date,
    accountId: input.fromAccountId,
    toAccountId: input.toAccountId,
    status: 'pago',
    note: input.note,
    createdAt: new Date().toISOString(),
  })
}

export function getInstallmentSiblings(transactions: Transaction[], groupId: string): Transaction[] {
  return transactions
    .filter((t) => t.installmentGroupId === groupId)
    .sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0))
}
