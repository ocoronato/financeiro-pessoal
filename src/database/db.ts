import Dexie, { type Table } from 'dexie'
import type { Account } from '@/types'
import type { Category } from '@/types'
import type { Transaction } from '@/types'
import type { CreditCard } from '@/types'
import type { Invoice } from '@/types'
import type { Goal } from '@/types'
import type { RecurringTransaction } from '@/types'
import type { AppSettings } from '@/types'
import { defaultCategories } from './seed'

export class AppDatabase extends Dexie {
  accounts!: Table<Account, number>
  categories!: Table<Category, number>
  transactions!: Table<Transaction, number>
  creditCards!: Table<CreditCard, number>
  invoices!: Table<Invoice, number>
  goals!: Table<Goal, number>
  recurringTransactions!: Table<RecurringTransaction, number>
  settings!: Table<AppSettings, string>

  constructor() {
    super('financeiro-pessoal')

    this.version(1).stores({
      accounts: '++id, name, type',
      categories: '++id, name, kind',
      transactions:
        '++id, type, date, accountId, toAccountId, categoryId, cardId, invoiceId, installmentGroupId, status, recurringId',
      creditCards: '++id, name',
      invoices: '++id, cardId, [cardId+month+year], status',
      goals: '++id, name',
      recurringTransactions: '++id',
      settings: 'id',
    })

    this.on('populate', () => {
      void this.categories.bulkAdd(defaultCategories)
      void this.settings.add({ id: 'app', theme: 'system' })
    })
  }
}

export const db = new AppDatabase()
