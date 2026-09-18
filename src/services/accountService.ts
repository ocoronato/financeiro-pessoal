import { db } from '@/database/db'
import type { Account, Invoice, Transaction } from '@/types'

export async function createAccount(data: Omit<Account, 'id' | 'createdAt'>) {
  return db.accounts.add({ ...data, createdAt: new Date().toISOString() })
}

export async function updateAccount(id: number, data: Partial<Omit<Account, 'id'>>) {
  return db.accounts.update(id, data)
}

export async function deleteAccount(id: number) {
  const [txCount, recurringCount] = await Promise.all([
    db.transactions.where('accountId').equals(id).or('toAccountId').equals(id).count(),
    db.recurringTransactions.where('accountId').equals(id).count(),
  ])
  if (txCount > 0 || recurringCount > 0) {
    throw new Error(
      'Não é possível excluir: existem transações ou recorrências vinculadas a esta conta.',
    )
  }
  return db.accounts.delete(id)
}

export function calculateAccountBalances(
  accounts: Account[],
  transactions: Transaction[],
  invoices: Invoice[],
): Map<number, number> {
  const balances = new Map<number, number>()
  for (const account of accounts) {
    if (account.id !== undefined) balances.set(account.id, account.initialBalance)
  }

  for (const t of transactions) {
    if (t.type === 'receita' && t.accountId !== undefined && balances.has(t.accountId)) {
      balances.set(t.accountId, balances.get(t.accountId)! + t.amount)
    } else if (t.type === 'despesa' && !t.cardId && t.accountId !== undefined && balances.has(t.accountId)) {
      balances.set(t.accountId, balances.get(t.accountId)! - t.amount)
    } else if (t.type === 'transferencia') {
      if (t.accountId !== undefined && balances.has(t.accountId)) {
        balances.set(t.accountId, balances.get(t.accountId)! - t.amount)
      }
      if (t.toAccountId !== undefined && balances.has(t.toAccountId)) {
        balances.set(t.toAccountId, balances.get(t.toAccountId)! + t.amount)
      }
    }
  }

  for (const invoice of invoices) {
    if (invoice.status === 'paga' && invoice.paidFromAccountId !== undefined && balances.has(invoice.paidFromAccountId)) {
      const amount = invoice.paidAmount ?? 0
      balances.set(invoice.paidFromAccountId, balances.get(invoice.paidFromAccountId)! - amount)
    }
  }

  return balances
}
