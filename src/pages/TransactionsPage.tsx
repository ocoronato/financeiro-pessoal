import { useMemo, useState } from 'react'
import { ArrowLeftRight, ListChecks, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { TransactionCard } from '@/features/transactions/TransactionCard'
import { TransactionFilters, DEFAULT_FILTERS, type TransactionFilterState } from '@/features/transactions/TransactionFilters'
import { TransferDialog } from '@/features/transactions/TransferDialog'
import { useTransactionDialog } from '@/features/transactions/TransactionDialogProvider'
import { useTransactions } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useCreditCards } from '@/hooks/useCreditCards'
import { deleteTransaction, duplicateTransaction, toggleTransactionStatus } from '@/services/transactionService'
import { toast } from '@/hooks/use-toast'
import { formatDateLong } from '@/utils/format'
import type { Transaction } from '@/types'

export default function TransactionsPage() {
  const transactions = useTransactions()
  const accounts = useAccounts()
  const categories = useCategories()
  const cards = useCreditCards()
  const { openCreate, openEdit } = useTransactionDialog()

  const [filters, setFilters] = useState<TransactionFilterState>(DEFAULT_FILTERS)
  const [transferOpen, setTransferOpen] = useState(false)
  const [deleting, setDeleting] = useState<Transaction | undefined>()

  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts])
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return transactions.filter((t) => {
      if (search && !t.description.toLowerCase().includes(search)) return false
      if (filters.type !== 'todos' && t.type !== filters.type) return false
      if (filters.categoryId !== 'todos' && t.categoryId !== filters.categoryId) return false
      if (filters.accountId !== 'todos' && t.accountId !== filters.accountId && t.toAccountId !== filters.accountId)
        return false
      if (filters.status !== 'todos' && t.status !== filters.status) return false
      return true
    })
  }, [transactions, filters])

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const list = map.get(t.date) ?? []
      list.push(t)
      map.set(t.date, list)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  async function handleDuplicate(t: Transaction) {
    if (!t.id) return
    await duplicateTransaction(t.id)
    toast({ title: 'Transação duplicada', variant: 'success' })
  }

  async function handleToggleStatus(t: Transaction) {
    if (!t.id) return
    await toggleTransactionStatus(t.id, t.status === 'pago' ? 'pendente' : 'pago')
  }

  async function confirmDelete() {
    if (!deleting?.id) return
    await deleteTransaction(deleting.id)
    toast({ title: 'Transação excluída', variant: 'success' })
    setDeleting(undefined)
  }

  return (
    <div>
      <PageHeader
        title="Transações"
        description="Todas as suas receitas, despesas e transferências."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTransferOpen(true)} disabled={accounts.length < 2}>
              <ArrowLeftRight className="size-4" />
              Transferência
            </Button>
            <Button onClick={() => openCreate()}>
              <Plus className="size-4" />
              Nova transação
            </Button>
          </div>
        }
      />

      <TransactionFilters value={filters} onChange={setFilters} />

      <div className="mt-5 space-y-6">
        {transactions.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nenhuma transação cadastrada"
            description="Adicione sua primeira receita ou despesa para começar."
            actionLabel="Adicionar primeira transação"
            onAction={() => openCreate()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={ListChecks} title="Nenhum resultado" description="Ajuste os filtros ou a busca." />
        ) : (
          groups.map(([date, items]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-medium capitalize text-muted-foreground">{formatDateLong(date)}</p>
              <div className="space-y-2">
                {items.map((t) => (
                  <TransactionCard
                    key={t.id}
                    transaction={t}
                    category={t.categoryId !== undefined ? categoryMap.get(t.categoryId) : undefined}
                    account={t.accountId !== undefined ? accountMap.get(t.accountId) : undefined}
                    toAccount={t.toAccountId !== undefined ? accountMap.get(t.toAccountId) : undefined}
                    card={t.cardId !== undefined ? cardMap.get(t.cardId) : undefined}
                    onEdit={() => openEdit(t)}
                    onDuplicate={() => handleDuplicate(t)}
                    onDelete={() => setDeleting(t)}
                    onToggleStatus={() => handleToggleStatus(t)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir transação?"
        description={`Tem certeza que deseja excluir "${deleting?.description}"?`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
