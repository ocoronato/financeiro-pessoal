import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { TransactionCard } from '@/features/transactions/TransactionCard'
import { PayInvoiceDialog } from './PayInvoiceDialog'
import { useTransactionsByInvoice } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'
import { deleteTransaction, duplicateTransaction } from '@/services/transactionService'
import { reopenInvoice } from '@/services/invoiceService'
import { formatDate, formatMonthYear } from '@/utils/format'
import { toast } from '@/hooks/use-toast'
import type { CreditCard, Invoice, InvoiceStatus } from '@/types'

const STATUS_VARIANT: Record<InvoiceStatus, 'success' | 'warning' | 'destructive'> = {
  paga: 'success',
  aberta: 'warning',
  atrasada: 'destructive',
}
const STATUS_LABEL: Record<InvoiceStatus, string> = { paga: 'Paga', aberta: 'Aberta', atrasada: 'Atrasada' }

interface InvoiceDetailDialogProps {
  invoice?: Invoice
  card?: CreditCard
  total: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailDialog({ invoice, card, total, open, onOpenChange }: InvoiceDetailDialogProps) {
  const transactions = useTransactionsByInvoice(invoice?.id)
  const categories = useCategories()
  const accounts = useAccounts()
  const { openEdit } = useTransactionDialog()
  const [payOpen, setPayOpen] = useState(false)
  const [reopenConfirm, setReopenConfirm] = useState(false)

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
  const sorted = useMemo(() => transactions.slice().sort((a, b) => a.date.localeCompare(b.date)), [transactions])

  if (!invoice || !card) return null

  async function handleReopen() {
    if (!invoice?.id) return
    await reopenInvoice(invoice.id)
    toast({ title: 'Fatura reaberta', variant: 'success' })
    setReopenConfirm(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 capitalize">
              {card.name} · {formatMonthYear(invoice.month, invoice.year)}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total da fatura</p>
              <p className="text-xl font-semibold tabular-nums">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-xs text-muted-foreground">Vencimento {formatDate(invoice.dueDate)}</p>
            </div>
            <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
          </div>

          {invoice.status === 'paga' ? (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Paga em {invoice.paidDate && formatDate(invoice.paidDate)}
                {' · '}
                {accounts.find((a) => a.id === invoice.paidFromAccountId)?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setReopenConfirm(true)}>
                Reabrir fatura
              </Button>
            </div>
          ) : (
            <Button onClick={() => setPayOpen(true)} className="w-full">
              Pagar fatura
            </Button>
          )}

          <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
            {sorted.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma compra nesta fatura.</p>
            ) : (
              sorted.map((t) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  category={t.categoryId !== undefined ? categoryMap.get(t.categoryId) : undefined}
                  card={card}
                  onEdit={() => openEdit(t)}
                  onDuplicate={() => t.id && duplicateTransaction(t.id)}
                  onDelete={() => t.id && deleteTransaction(t.id)}
                  onToggleStatus={() => {}}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PayInvoiceDialog invoice={invoice} total={total} open={payOpen} onOpenChange={setPayOpen} />
      <ConfirmDialog
        open={reopenConfirm}
        onOpenChange={setReopenConfirm}
        title="Reabrir fatura?"
        description="O pagamento registrado será desfeito e o valor voltará a ser considerado em aberto."
        confirmLabel="Reabrir"
        onConfirm={handleReopen}
      />
    </>
  )
}
