import { db } from '@/database/db'
import type { CreditCard, Invoice } from '@/types'
import { getInvoiceClosingDate, getInvoiceDueDate, getInvoicePeriod, toISODate } from '@/utils/date'

export async function getOrCreateInvoice(cardId: number, referenceDate: Date): Promise<Invoice> {
  const card = await db.creditCards.get(cardId)
  if (!card) throw new Error('Cartão não encontrado')

  const { month, year } = getInvoicePeriod(referenceDate, card.closingDay)

  // Wrapped in one Dexie transaction so two concurrent calls for the same
  // card+period (e.g. React StrictMode's double effect invocation) can't
  // both miss the "existing" check and create duplicate invoices.
  return db.transaction('rw', db.invoices, async () => {
    const existing = await db.invoices.where('[cardId+month+year]').equals([cardId, month, year]).first()
    if (existing) return existing

    const closingDate = toISODate(getInvoiceClosingDate(month, year, card.closingDay))
    const dueDate = toISODate(getInvoiceDueDate(month, year, card.dueDay, card.closingDay))

    const id = await db.invoices.add({
      cardId,
      month,
      year,
      closingDate,
      dueDate,
      status: 'aberta',
    })
    const created = await db.invoices.get(id)
    if (!created) throw new Error('Falha ao criar fatura')
    return created
  })
}

export async function ensureInvoicesExist(card: CreditCard, monthsAhead = 1) {
  const now = new Date()
  for (let i = 0; i <= monthsAhead; i++) {
    const ref = new Date(now.getFullYear(), now.getMonth() + i, 1)
    await getOrCreateInvoice(card.id!, ref)
  }
}

export async function refreshInvoiceStatuses() {
  const todayStr = toISODate(new Date())
  const openInvoices = await db.invoices.where('status').anyOf(['aberta', 'atrasada']).toArray()
  const updates = openInvoices
    .filter((inv) => {
      const shouldBeLate = inv.dueDate < todayStr
      return shouldBeLate !== (inv.status === 'atrasada')
    })
    .map((inv) => ({ ...inv, status: (inv.dueDate < todayStr ? 'atrasada' : 'aberta') as Invoice['status'] }))

  if (updates.length > 0) {
    await db.invoices.bulkPut(updates)
  }
}

export async function getInvoiceTotal(invoiceId: number): Promise<number> {
  const txs = await db.transactions.where('invoiceId').equals(invoiceId).toArray()
  return txs.reduce((sum, t) => sum + t.amount, 0)
}

export async function payInvoice(invoiceId: number, accountId: number, paidDate: string) {
  const amount = await getInvoiceTotal(invoiceId)
  await db.invoices.update(invoiceId, {
    status: 'paga',
    paidDate,
    paidFromAccountId: accountId,
    paidAmount: amount,
  })
}

export async function reopenInvoice(invoiceId: number) {
  const invoice = await db.invoices.get(invoiceId)
  if (!invoice) return
  const todayStr = toISODate(new Date())
  await db.invoices.update(invoiceId, {
    status: invoice.dueDate < todayStr ? 'atrasada' : 'aberta',
    paidDate: undefined,
    paidFromAccountId: undefined,
    paidAmount: undefined,
  })
}
