import { useState } from 'react'
import { Pencil, Plus, Repeat, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { EmptyState } from '@/components/shared/EmptyState'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { MoneyDisplay } from '@/components/shared/MoneyDisplay'
import { RecurringFormDialog } from './RecurringFormDialog'
import { useRecurring } from '@/hooks/useRecurring'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreditCards } from '@/hooks/useCreditCards'
import { deleteRecurring, toggleRecurringActive } from '@/services/recurringService'
import { toast } from '@/hooks/use-toast'
import type { RecurringTransaction } from '@/types'

export function RecurringList() {
  const recurring = useRecurring()
  const categories = useCategories()
  const accounts = useAccounts()
  const cards = useCreditCards()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<RecurringTransaction | undefined>()
  const [deleting, setDeleting] = useState<RecurringTransaction | undefined>()

  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const accountMap = new Map(accounts.map((a) => [a.id, a]))
  const cardMap = new Map(cards.map((c) => [c.id, c]))

  async function confirmDelete() {
    if (!deleting?.id) return
    await deleteRecurring(deleting.id)
    toast({ title: 'Recorrência excluída', variant: 'success' })
    setDeleting(undefined)
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing(undefined)
            setFormOpen(true)
          }}
        >
          <Plus className="size-4" />
          Nova recorrência
        </Button>
      </div>

      {recurring.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Nenhuma recorrência cadastrada"
          description="Cadastre contas e receitas fixas, como aluguel, assinaturas ou salário."
        />
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border">
          {recurring.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.description}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Todo dia {r.dayOfMonth} · {r.cardId ? cardMap.get(r.cardId)?.name : accountMap.get(r.accountId)?.name}
                </p>
                <CategoryBadge category={categoryMap.get(r.categoryId)} size="sm" className="mt-1" />
              </div>
              <MoneyDisplay
                value={r.amount}
                variant={r.kind === 'receita' ? 'income' : 'expense'}
                size="sm"
                className="shrink-0 font-medium"
              />
              <Switch
                checked={r.active}
                onCheckedChange={(checked) => r.id && toggleRecurringActive(r.id, checked)}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setEditing(r)
                  setFormOpen(true)
                }}
              >
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(r)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <RecurringFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir recorrência?"
        description={`Tem certeza que deseja excluir "${deleting?.description}"? As transações já geradas não serão removidas.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
