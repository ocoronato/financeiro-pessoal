import type { Account, Category, Transaction, TransactionStatus, TransactionType } from '@/types'
import { formatDate } from '@/utils/format'

const TYPE_LABELS: Record<TransactionType, string> = {
  receita: 'Receita',
  despesa: 'Despesa',
  transferencia: 'Transferência',
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
}

function csvField(value: string): string {
  if (/[",;\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildTransactionsCsv(transactions: Transaction[], categories: Category[], accounts: Account[]): string {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))
  const accountMap = new Map(accounts.map((a) => [a.id, a.name]))

  const header = ['Data', 'Descrição', 'Categoria', 'Conta', 'Tipo', 'Valor', 'Status']

  const rows = transactions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => [
      formatDate(t.date),
      t.description,
      t.categoryId !== undefined ? (categoryMap.get(t.categoryId) ?? '') : '',
      t.accountId !== undefined ? (accountMap.get(t.accountId) ?? '') : t.cardId ? 'Cartão de crédito' : '',
      TYPE_LABELS[t.type],
      t.amount.toFixed(2).replace('.', ','),
      STATUS_LABELS[t.status],
    ])

  return [header, ...rows].map((cols) => cols.map((c) => csvField(String(c))).join(';')).join('\r\n')
}

export function downloadCsv(csv: string, filename = 'transacoes.csv') {
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
