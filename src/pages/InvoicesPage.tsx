import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { InvoiceCard } from '@/features/invoices/InvoiceCard'
import { InvoiceDetailDialog } from '@/features/invoices/InvoiceDetailDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useInvoices } from '@/hooks/useInvoices'
import { useTransactions } from '@/hooks/useTransactions'
import type { InvoiceStatus } from '@/types'

export default function InvoicesPage() {
  const cards = useCreditCards()
  const invoices = useInvoices()
  const transactions = useTransactions()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<number | undefined>()

  const cardFilter = searchParams.get('cartao') ?? 'todos'
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'todos'>('todos')

  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const invoiceTotals = useMemo(() => {
    const totals = new Map<number, number>()
    for (const t of transactions) {
      if (t.invoiceId === undefined) continue
      totals.set(t.invoiceId, (totals.get(t.invoiceId) ?? 0) + t.amount)
    }
    return totals
  }, [transactions])

  const filtered = useMemo(() => {
    return invoices
      .filter((i) => cardFilter === 'todos' || String(i.cardId) === cardFilter)
      .filter((i) => statusFilter === 'todos' || i.status === statusFilter)
      .filter((i) => cardMap.has(i.cardId))
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
  }, [invoices, cardFilter, statusFilter, cardMap])

  const selected = invoices.find((i) => i.id === selectedId)
  const selectedTotal = selected?.id ? (invoiceTotals.get(selected.id) ?? 0) : 0
  const selectedCard = selected ? cardMap.get(selected.cardId) : undefined

  return (
    <div>
      <PageHeader title="Faturas" description="Acompanhe e pague as faturas dos seus cartões." />

      {cards.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhum cartão cadastrado"
          description="Cadastre um cartão de crédito para começar a acompanhar faturas."
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <Select value={cardFilter} onValueChange={(v) => setSearchParams(v === 'todos' ? {} : { cartao: v })}>
              <SelectTrigger className="w-auto min-w-40">
                <SelectValue placeholder="Cartão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cartões</SelectItem>
                {cards.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as InvoiceStatus | 'todos')}>
              <SelectTrigger className="w-auto min-w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="atrasada">Atrasada</SelectItem>
                <SelectItem value="paga">Paga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Receipt} title="Nenhuma fatura encontrada" description="Ajuste os filtros acima." />
          ) : (
            <div className="space-y-2">
              {filtered.map((invoice) => {
                const card = cardMap.get(invoice.cardId)
                if (!card) return null
                return (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    card={card}
                    total={invoice.id ? (invoiceTotals.get(invoice.id) ?? 0) : 0}
                    onClick={() => setSelectedId(invoice.id)}
                  />
                )
              })}
            </div>
          )}
        </>
      )}

      <InvoiceDetailDialog
        invoice={selected}
        card={selectedCard}
        total={selectedTotal}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
      />
    </div>
  )
}
