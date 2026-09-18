import { useState } from 'react'
import { ArrowLeftRight, Plus, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { AccountCard } from '@/features/accounts/AccountCard'
import { AccountFormDialog } from '@/features/accounts/AccountFormDialog'
import { TransferDialog } from '@/features/transactions/TransferDialog'
import { useAccountBalances } from '@/hooks/useAccountBalances'
import { deleteAccount } from '@/services/accountService'
import { toast } from '@/hooks/use-toast'
import type { Account } from '@/types'

export default function AccountsPage() {
  const { accounts, balances } = useAccountBalances()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account | undefined>()
  const [transferOpen, setTransferOpen] = useState(false)
  const [deleting, setDeleting] = useState<Account | undefined>()

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(account: Account) {
    setEditing(account)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting?.id) return
    try {
      await deleteAccount(deleting.id)
      toast({ title: 'Conta excluída', variant: 'success' })
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
        title="Contas"
        description="Gerencie suas contas e o saldo disponível em cada uma."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTransferOpen(true)} disabled={accounts.length < 2}>
              <ArrowLeftRight className="size-4" />
              Transferir
            </Button>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Nova conta
            </Button>
          </div>
        }
      />

      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhuma conta cadastrada"
          description="Adicione sua primeira conta para começar a controlar seu dinheiro."
          actionLabel="Adicionar primeira conta"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              balance={account.id !== undefined ? (balances.get(account.id) ?? 0) : 0}
              onEdit={() => openEdit(account)}
              onDelete={() => setDeleting(account)}
            />
          ))}
        </div>
      )}

      <AccountFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir conta?"
        description={`Tem certeza que deseja excluir "${deleting?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
