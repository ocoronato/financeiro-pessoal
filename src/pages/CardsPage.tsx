import { useMemo, useState } from 'react'
import { CreditCard as CreditCardIcon, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { CreditCardCard } from '@/features/cards/CreditCardCard'
import { CreditCardFormDialog } from '@/features/cards/CreditCardFormDialog'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useInvoices } from '@/hooks/useInvoices'
import { useTransactions } from '@/hooks/useTransactions'
import { deleteCreditCard, calculateCardUsage } from '@/services/creditCardService'
import { getInvoicePeriod } from '@/utils/date'
import { toast } from '@/hooks/use-toast'
import type { CreditCard } from '@/types'

export default function CardsPage() {
  const cards = useCreditCards()
  const invoices = useInvoices()
  const transactions = useTransactions()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CreditCard | undefined>()
  const [deleting, setDeleting] = useState<CreditCard | undefined>()

  const invoiceTotals = useMemo(() => {
    const totals = new Map<number, number>()
    for (const t of transactions) {
      if (t.invoiceId === undefined) continue
      totals.set(t.invoiceId, (totals.get(t.invoiceId) ?? 0) + t.amount)
    }
    return totals
  }, [transactions])

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting?.id) return
    try {
      await deleteCreditCard(deleting.id)
      toast({ title: 'Cartão excluído', variant: 'success' })
    } catch (err) {
      toast({
        title: 'Não foi possível excluir',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      })
    } finally {
      setDeleting(undefined)
    }
  }

  return (
    <div>
      <PageHeader
        title="Cartões"
        description="Seus cartões de crédito, limites e faturas."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Novo cartão
          </Button>
        }
      />

      {cards.length === 0 ? (
        <EmptyState
          icon={CreditCardIcon}
          title="Nenhum cartão cadastrado"
          description="Adicione seus cartões de crédito para acompanhar limites e faturas."
          actionLabel="Adicionar primeiro cartão"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const { month, year } = getInvoicePeriod(new Date(), card.closingDay)
            const currentInvoice = invoices.find(
              (i) => i.cardId === card.id && i.month === month && i.year === year,
            )
            const currentInvoiceTotal = currentInvoice?.id ? (invoiceTotals.get(currentInvoice.id) ?? 0) : 0
            const used = card.id !== undefined ? calculateCardUsage(card.id, transactions, invoices) : 0

            return (
              <CreditCardCard
                key={card.id}
                card={card}
                used={used}
                currentInvoice={currentInvoice}
                currentInvoiceTotal={currentInvoiceTotal}
                onEdit={() => {
                  setEditing(card)
                  setFormOpen(true)
                }}
                onDelete={() => setDeleting(card)}
              />
            )
          })}
        </div>
      )}

      <CreditCardFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir cartão?"
        description={`Tem certeza que deseja excluir "${deleting?.name}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
