export type InvoiceStatus = 'aberta' | 'paga' | 'atrasada'

export interface Invoice {
  id?: number
  cardId: number
  month: number
  year: number
  closingDate: string
  dueDate: string
  status: InvoiceStatus
  paidDate?: string
  paidFromAccountId?: number
  paidAmount?: number
}
