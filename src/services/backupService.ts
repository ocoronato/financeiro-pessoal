import { db } from '@/database/db'
import { defaultCategories } from '@/database/seed'
import { DEFAULT_SETTINGS } from './settingsService'
import type {
  Account,
  AppSettings,
  Category,
  CreditCard,
  Goal,
  Invoice,
  RecurringTransaction,
  Transaction,
} from '@/types'

export interface BackupData {
  version: number
  exportedAt: string
  accounts: Account[]
  transactions: Transaction[]
  categories: Category[]
  creditCards: CreditCard[]
  invoices: Invoice[]
  goals: Goal[]
  recurringTransactions: RecurringTransaction[]
  settings: AppSettings[]
}

export async function exportBackup(): Promise<BackupData> {
  const [accounts, transactions, categories, creditCards, invoices, goals, recurringTransactions, settings] =
    await Promise.all([
      db.accounts.toArray(),
      db.transactions.toArray(),
      db.categories.toArray(),
      db.creditCards.toArray(),
      db.invoices.toArray(),
      db.goals.toArray(),
      db.recurringTransactions.toArray(),
      db.settings.toArray(),
    ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts,
    transactions,
    categories,
    creditCards,
    invoices,
    goals,
    recurringTransactions,
    settings,
  }
}

export function downloadBackupFile(data: BackupData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const dateStr = new Date().toISOString().slice(0, 10)
  downloadBlob(blob, `financeiro-backup-${dateStr}.json`)
}

export function parseBackupFile(text: string): BackupData {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('O arquivo selecionado não é um JSON válido.')
  }
  if (
    !data ||
    typeof data !== 'object' ||
    !Array.isArray((data as BackupData).accounts) ||
    !Array.isArray((data as BackupData).transactions) ||
    !Array.isArray((data as BackupData).categories)
  ) {
    throw new Error('Arquivo de backup inválido ou incompatível.')
  }
  return data as BackupData
}

export async function importBackup(data: BackupData) {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
    await Promise.all([
      data.accounts.length ? db.accounts.bulkAdd(data.accounts) : undefined,
      data.transactions.length ? db.transactions.bulkAdd(data.transactions) : undefined,
      data.categories.length ? db.categories.bulkAdd(data.categories) : undefined,
      data.creditCards.length ? db.creditCards.bulkAdd(data.creditCards) : undefined,
      data.invoices.length ? db.invoices.bulkAdd(data.invoices) : undefined,
      data.goals.length ? db.goals.bulkAdd(data.goals) : undefined,
      data.recurringTransactions.length ? db.recurringTransactions.bulkAdd(data.recurringTransactions) : undefined,
      data.settings.length ? db.settings.bulkAdd(data.settings) : db.settings.add(DEFAULT_SETTINGS),
    ])
  })
}

export async function eraseAllData() {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
    await db.categories.bulkAdd(defaultCategories)
    await db.settings.add(DEFAULT_SETTINGS)
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
