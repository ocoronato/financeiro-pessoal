export type TransactionType = 'receita' | 'despesa' | 'transferencia'
export type TransactionStatus = 'pago' | 'pendente'

export interface Transaction {
  id?: number
  type: TransactionType
  description: string
  amount: number
  date: string
  categoryId?: number
  accountId?: number
  toAccountId?: number
  cardId?: number
  invoiceId?: number
  installmentGroupId?: string
  installmentNumber?: number
  installmentTotal?: number
  status: TransactionStatus
  note?: string
  recurringId?: number
  createdAt: string
}
